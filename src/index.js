/**
 * Fast Obsidian MCP Server (v1.7.0)
 * Developed by An Ho Yong
 *
 * High-performance, zero-dependency MCP server for Obsidian Vault.
 * v1.7.0 adds safe JS evaluation and advanced web search query controls.
 */

const fs = require('fs').promises;
const fsNative = require('fs');
const path = require('path');
const readline = require('readline');
const http = require('http');
const https = require('https');
const vm = require('vm');

const SERVER_VERSION = '1.7.0';
const DEFAULT_SEARCH_LIMIT = 10;
const MAX_SEARCH_LIMIT = 50;
const DEFAULT_WEB_SEARCH_LIMIT = 5;
const MAX_WEB_SEARCH_LIMIT = 10;
const DEFAULT_JS_TIMEOUT_MS = 400;
const MAX_JS_TIMEOUT_MS = 2500;
const VAULT_PATH = path.resolve(process.env.OBSIDIAN_VAULT_PATH || '');
const rl = readline.createInterface({ input: process.stdin, terminal: false });

const send = (id, result = null, error = null) => {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result, error }) + '\n');
};

const log = (msg) => console.error(`[Obsidian-MCP] ${msg}`);

rl.on('line', async (line) => {
  try {
    const { method, params, id } = JSON.parse(line);

    if (method === 'initialize') {
      return send(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'fast-obsidian-mcp', version: SERVER_VERSION }
      });
    }

    if (method === 'tools/list') {
      return send(id, {
        tools: [
          { name: 'list_notes', description: 'List all markdown notes in the vault.', inputSchema: { type: 'object' } },
          { name: 'read_note', description: 'Read content of a specific note.', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } },
          { name: 'write_note', description: 'Create a note with "Title_Date.md" format.', inputSchema: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' } }, required: ['title', 'content'] } },
          { name: 'update_note', description: 'Update or create a note at a specific path, including nested folders.', inputSchema: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] } },
          { name: 'organize_notes_by_date', description: 'Safely move root notes to date folders.', inputSchema: { type: 'object' } },
          { name: 'get_recommendations', description: 'Suggest next topics, tags, and orphan notes based on vault content.', inputSchema: { type: 'object' } },
          {
            name: 'search_notes',
            description: 'Weighted vault search with phrase matching, filters, and contextual snippets.',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                limit: { type: 'number' },
                pathPrefix: { type: 'string' }
              },
              required: ['query']
            }
          },
          {
            name: 'web_search',
            description: 'Search the web with optional filters for domain, language/region, and recency.',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                limit: { type: 'number' },
                site: { type: 'string' },
                region: { type: 'string' },
                lang: { type: 'string' },
                timeRange: { type: 'string', enum: ['day', 'week', 'month', 'year'] },
                safeSearch: { type: 'boolean' }
              },
              required: ['query']
            }
          },
          { name: 'web_clip', description: 'Extract text from a URL.', inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] } },
          {
            name: 'js_eval',
            description: 'Execute JavaScript in a restricted VM context (no filesystem/network access).',
            inputSchema: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                context: { type: 'object' },
                timeoutMs: { type: 'number' }
              },
              required: ['code']
            }
          },
          { name: 'smart_link', description: 'Suggest internal links based on similarity.', inputSchema: { type: 'object', properties: { text: { type: 'string' }, limit: { type: 'number' } }, required: ['text'] } },
          { name: 'list_assets', description: 'List non-markdown files.', inputSchema: { type: 'object' } }
        ]
      });
    }

    if (method === 'tools/call') {
      const { name, arguments: args } = params;
      const result = await handleTool(name, args);
      return send(id, result);
    }
  } catch (e) {
    log(`Error: ${e.message}`);
  }
});

async function handleTool(name, args) {
  try {
    ensureVaultPath();
    const safeArgs = args || {};

    if (name === 'list_notes') {
      const notes = await walk(VAULT_PATH, '.md');
      return { content: [{ type: 'text', text: notes.sort(sortText).join('\n') }] };
    }

    if (name === 'read_note') {
      return { content: [{ type: 'text', text: await fs.readFile(getSafePath(safeArgs.path), 'utf-8') }] };
    }

    if (name === 'write_note') {
      const title = sanitizeTitle(requireString(safeArgs.title, 'title'));
      const date = new Date().toISOString().split('T')[0];
      const relativePath = `${title}_${date}.md`;
      const fullPath = getSafePath(relativePath);
      await ensureParentDirectory(fullPath);
      await fs.writeFile(fullPath, requireString(safeArgs.content, 'content'), 'utf-8');
      return { content: [{ type: 'text', text: `Success: Saved as ${relativePath}` }] };
    }

    if (name === 'update_note') {
      const targetPath = getSafePath(requireString(safeArgs.path, 'path'));
      await ensureParentDirectory(targetPath);
      await fs.writeFile(targetPath, requireString(safeArgs.content, 'content'), 'utf-8');
      return { content: [{ type: 'text', text: `Success: Updated ${safeArgs.path}` }] };
    }

    if (name === 'organize_notes_by_date') {
      const entries = await fs.readdir(VAULT_PATH, { withFileTypes: true });
      let movedCount = 0;

      for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

        const oldPath = path.join(VAULT_PATH, entry.name);
        const stat = await fs.stat(oldPath);
        const dateStr = stat.mtime.toISOString().split('T')[0];
        const targetDir = path.join(VAULT_PATH, dateStr);
        if (!fsNative.existsSync(targetDir)) await fs.mkdir(targetDir, { recursive: true });

        let targetPath = path.join(targetDir, entry.name);
        if (fsNative.existsSync(targetPath)) {
          const ext = path.extname(entry.name);
          targetPath = path.join(targetDir, `${path.basename(entry.name, ext)}_${Date.now()}${ext}`);
        }

        await fs.rename(oldPath, targetPath);
        movedCount++;
      }

      return { content: [{ type: 'text', text: `Success: Organized ${movedCount} notes.` }] };
    }

    if (name === 'get_recommendations') {
      const recommendations = await buildRecommendations();
      return { content: [{ type: 'text', text: JSON.stringify(recommendations, null, 2) }] };
    }

    if (name === 'search_notes') {
      const searchResult = await searchNotes(safeArgs);
      return { content: [{ type: 'text', text: JSON.stringify(searchResult, null, 2) }] };
    }

    if (name === 'web_search') {
      const searchPlan = buildWebSearchPlan(safeArgs);
      const html = await fetchUrl(searchPlan.url);
      const results = parseDuckDuckGoResults(html, searchPlan.limit);
      return { content: [{ type: 'text', text: JSON.stringify({ ...searchPlan.meta, results }, null, 2) }] };
    }

    if (name === 'web_clip') {
      const content = await fetchUrl(requireString(safeArgs.url, 'url'));
      const cleanContent = content
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 3000);
      return { content: [{ type: 'text', text: decodeHtml(cleanContent) }] };
    }

    if (name === 'smart_link') {
      const recommendations = await smartLink(safeArgs);
      return { content: [{ type: 'text', text: JSON.stringify(recommendations, null, 2) }] };
    }

    if (name === 'js_eval') {
      const jsResult = await runJsEval(safeArgs);
      return { content: [{ type: 'text', text: JSON.stringify(jsResult, null, 2) }] };
    }

    if (name === 'list_assets') {
      const assets = await walk(VAULT_PATH, '', true);
      const filtered = assets.filter((file) => !file.endsWith('.md')).sort(sortText);
      return { content: [{ type: 'text', text: filtered.join('\n') }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (e) {
    return { isError: true, content: [{ type: 'text', text: e.message }] };
  }
}

async function searchNotes(args) {
  const query = requireString(args.query, 'query');
  const limit = clampNumber(args.limit, DEFAULT_SEARCH_LIMIT, 1, MAX_SEARCH_LIMIT);
  const pathPrefix = sanitizePathPrefix(args.pathPrefix);
  const files = (await walk(VAULT_PATH, '.md')).filter((file) => !pathPrefix || normalizeSlash(file).startsWith(pathPrefix));
  const terms = buildSearchTerms(query);
  const ranked = [];

  for (const file of files) {
    try {
      const absolutePath = path.join(VAULT_PATH, file);
      const content = await fs.readFile(absolutePath, 'utf-8');
      const stat = await fs.stat(absolutePath);
      const analysis = analyzeNote(file, content, stat, terms);
      if (analysis.score <= 0) continue;

      ranked.push({
        path: file,
        score: analysis.score,
        modifiedAt: stat.mtime.toISOString(),
        matchCount: analysis.matchCount,
        matchedTerms: analysis.matchedTerms,
        heading: analysis.bestHeading,
        tags: analysis.tags.slice(0, 8),
        preview: analysis.preview
      });
    } catch (e) {
      log(`search_notes skipped ${file}: ${e.message}`);
    }
  }

  ranked.sort((a, b) => b.score - a.score || sortText(a.path, b.path));
  return {
    query,
    limit,
    pathPrefix: pathPrefix || null,
    totalMatches: ranked.length,
    results: ranked.slice(0, limit)
  };
}

function analyzeNote(file, content, stat, terms) {
  const normalizedContent = normalizeText(content);
  const normalizedPath = normalizeText(file);
  const fileName = normalizeText(path.basename(file, '.md'));
  const headings = extractHeadings(content);
  const normalizedHeadings = headings.map((heading) => normalizeText(heading));
  const tags = extractTags(content);
  const normalizedTags = tags.map((tag) => normalizeText(tag));

  let score = 0;
  let matchCount = 0;
  let firstMatchIndex = -1;
  const matchedTerms = new Set();
  let bestHeading = '';

  for (const phrase of terms.phrases) {
    const normalizedPhrase = normalizeText(phrase);
    if (!normalizedPhrase) continue;

    const titleBoost = countOccurrences(fileName, normalizedPhrase);
    const pathBoost = countOccurrences(normalizedPath, normalizedPhrase);
    const contentBoost = countOccurrences(normalizedContent, normalizedPhrase);
    const headingBoost = normalizedHeadings.reduce((sum, heading) => sum + countOccurrences(heading, normalizedPhrase), 0);
    const tagBoost = normalizedTags.reduce((sum, tag) => sum + countOccurrences(tag, normalizedPhrase), 0);

    const termScore = (titleBoost * 24) + (headingBoost * 18) + (tagBoost * 14) + (pathBoost * 10) + (contentBoost * 8);
    if (termScore > 0) {
      score += termScore;
      matchCount += titleBoost + pathBoost + contentBoost + headingBoost + tagBoost;
      matchedTerms.add(phrase);
      if (firstMatchIndex === -1) firstMatchIndex = normalizedContent.indexOf(normalizedPhrase);
      if (!bestHeading && headingBoost > 0) bestHeading = headings[normalizedHeadings.findIndex((heading) => heading.includes(normalizedPhrase))] || '';
    }
  }

  for (const keyword of terms.keywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) continue;

    const titleBoost = countOccurrences(fileName, normalizedKeyword);
    const pathBoost = countOccurrences(normalizedPath, normalizedKeyword);
    const contentBoost = countOccurrences(normalizedContent, normalizedKeyword);
    const headingBoost = normalizedHeadings.reduce((sum, heading) => sum + countOccurrences(heading, normalizedKeyword), 0);
    const tagBoost = normalizedTags.reduce((sum, tag) => sum + countOccurrences(tag, normalizedKeyword), 0);

    const exactWordBonus = hasWordBoundary(normalizedContent, normalizedKeyword) ? 4 : 0;
    const termScore = (titleBoost * 16) + (headingBoost * 12) + (tagBoost * 10) + (pathBoost * 7) + (contentBoost * 4) + exactWordBonus;
    if (termScore > 0) {
      score += termScore;
      matchCount += titleBoost + pathBoost + contentBoost + headingBoost + tagBoost;
      matchedTerms.add(keyword);
      if (firstMatchIndex === -1) firstMatchIndex = normalizedContent.indexOf(normalizedKeyword);
      if (!bestHeading && headingBoost > 0) bestHeading = headings[normalizedHeadings.findIndex((heading) => heading.includes(normalizedKeyword))] || '';
    }
  }

  if (matchedTerms.size > 1) score += matchedTerms.size * 5;
  score += computeRecencyBonus(stat.mtime);

  const preview = buildSnippet(content, firstMatchIndex, [...matchedTerms]);
  return {
    score,
    matchCount,
    matchedTerms: [...matchedTerms],
    preview,
    bestHeading,
    tags
  };
}

async function buildRecommendations() {
  const files = await walk(VAULT_PATH, '.md');
  const noteDetails = [];
  const tagCount = new Map();
  const backlinks = new Map();

  for (const file of files) {
    try {
      const absolutePath = path.join(VAULT_PATH, file);
      const content = await fs.readFile(absolutePath, 'utf-8');
      const stat = await fs.stat(absolutePath);
      const tags = extractTags(content);
      const links = extractWikiLinks(content);

      tags.forEach((tag) => tagCount.set(tag, (tagCount.get(tag) || 0) + 1));
      links.forEach((link) => backlinks.set(link, (backlinks.get(link) || 0) + 1));

      noteDetails.push({
        path: file,
        modifiedAt: stat.mtime,
        tags,
        links,
        headings: extractHeadings(content)
      });
    } catch (e) {
      log(`get_recommendations skipped ${file}: ${e.message}`);
    }
  }

  noteDetails.sort((a, b) => b.modifiedAt - a.modifiedAt);

  const latestNotes = noteDetails.slice(0, 5).map((note) => ({
    path: note.path,
    modifiedAt: note.modifiedAt.toISOString(),
    tags: note.tags.slice(0, 5),
    headings: note.headings.slice(0, 3)
  }));

  const orphanNotes = noteDetails
    .filter((note) => (backlinks.get(path.basename(note.path, '.md')) || 0) === 0)
    .slice(0, 5)
    .map((note) => note.path);

  const topTags = [...tagCount.entries()]
    .sort((a, b) => b[1] - a[1] || sortText(a[0], b[0]))
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  const suggestedLinks = buildSuggestedLinks(noteDetails);

  return {
    summary: {
      noteCount: noteDetails.length,
      orphanCount: orphanNotes.length,
      uniqueTagCount: tagCount.size
    },
    latestNotes,
    topTags,
    orphanNotes,
    suggestedLinks
  };
}

function buildSuggestedLinks(noteDetails) {
  const scoredPairs = [];

  for (let i = 0; i < noteDetails.length; i++) {
    for (let j = i + 1; j < noteDetails.length; j++) {
      const left = noteDetails[i];
      const right = noteDetails[j];
      const sharedTags = left.tags.filter((tag) => right.tags.includes(tag));
      const sharedWords = intersectKeywords(path.basename(left.path, '.md'), path.basename(right.path, '.md'));
      const score = (sharedTags.length * 4) + sharedWords.length;
      if (score < 2) continue;

      scoredPairs.push({
        from: left.path,
        to: right.path,
        score,
        reason: sharedTags.length > 0
          ? `shared tags: ${sharedTags.slice(0, 3).join(', ')}`
          : `shared title words: ${sharedWords.slice(0, 3).join(', ')}`
      });
    }
  }

  scoredPairs.sort((a, b) => b.score - a.score || sortText(a.from, b.from));
  return scoredPairs.slice(0, 8);
}

async function smartLink(args) {
  const text = requireString(args.text, 'text');
  const limit = clampNumber(args.limit, 5, 1, 20);
  const files = await walk(VAULT_PATH, '.md');
  const sourceKeywords = extractKeywords(text, 12);
  const scored = [];

  for (const file of files) {
    try {
      const absolutePath = path.join(VAULT_PATH, file);
      const content = await fs.readFile(absolutePath, 'utf-8');
      const title = path.basename(file, '.md');
      const titleKeywords = extractKeywords(title, 8);
      const contentKeywords = extractKeywords(content, 20);
      const sharedTitle = intersectKeywords(sourceKeywords, titleKeywords);
      const sharedContent = intersectKeywords(sourceKeywords, contentKeywords);
      const score = (sharedTitle.length * 5) + (sharedContent.length * 2);
      if (score <= 0) continue;

      scored.push({
        path: file,
        score,
        link: `[[${normalizeSlash(file).replace(/\.md$/i, '')}]]`,
        matchedKeywords: [...new Set([...sharedTitle, ...sharedContent])].slice(0, 8)
      });
    } catch (e) {
      log(`smart_link skipped ${file}: ${e.message}`);
    }
  }

  scored.sort((a, b) => b.score - a.score || sortText(a.path, b.path));
  return { query: text, results: scored.slice(0, limit) };
}

async function walk(dir, ext = '', includeAll = false, rel = '') {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') return [];
      const absolute = path.join(dir, entry.name);
      const relative = path.join(rel, entry.name);
      if (entry.isDirectory()) return walk(absolute, ext, includeAll, relative);
      if (includeAll || entry.name.endsWith(ext)) return relative;
      return [];
    }));
    return files.flat();
  } catch (e) {
    return [];
  }
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).toString();
        res.resume();
        return resolve(fetchUrl(redirectUrl));
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function runJsEval(args) {
  const code = requireString(args.code, 'code');
  if (code.length > 4000) {
    throw new Error('Invalid argument: code is too long (max 4000 chars)');
  }

  const timeoutMs = clampNumber(args.timeoutMs, DEFAULT_JS_TIMEOUT_MS, 50, MAX_JS_TIMEOUT_MS);
  const userContext = sanitizeEvalContext(args.context);
  const sandbox = {
    Math,
    Date,
    JSON,
    Number,
    String,
    Boolean,
    Array,
    Object,
    RegExp,
    URL,
    URLSearchParams,
    Intl,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    encodeURIComponent,
    decodeURIComponent,
    ...userContext
  };

  const context = vm.createContext(sandbox);
  const script = new vm.Script(code, { filename: 'js_eval.vm.js' });
  let output = script.runInContext(context, { timeout: timeoutMs });

  if (isPromiseLike(output)) {
    output = await promiseWithTimeout(output, timeoutMs);
  }

  return {
    timeoutMs,
    type: output === null ? 'null' : typeof output,
    output: safeSerialize(output)
  };
}

function buildWebSearchPlan(args) {
  const rawQuery = requireString(args.query, 'query');
  const query = rawQuery.replace(/\s+/g, ' ').trim().slice(0, 300);
  const limit = clampNumber(args.limit, DEFAULT_WEB_SEARCH_LIMIT, 1, MAX_WEB_SEARCH_LIMIT);
  const site = sanitizeDomain(args.site);
  const region = sanitizeRegion(args.region || args.lang || 'wt-wt');
  const safeSearch = typeof args.safeSearch === 'boolean' ? args.safeSearch : true;
  const timeRange = sanitizeTimeRange(args.timeRange);
  const queryWithSite = site ? `${query} site:${site}` : query;

  const params = new URLSearchParams({
    q: queryWithSite,
    kl: region,
    kp: safeSearch ? '1' : '-2'
  });

  if (timeRange) {
    params.set('df', timeRange);
  }

  return {
    url: `https://duckduckgo.com/html/?${params.toString()}`,
    limit,
    meta: {
      query,
      finalQuery: queryWithSite,
      limit,
      site: site || null,
      region,
      safeSearch,
      timeRange: fromDuckDuckGoTimeRange(timeRange)
    }
  };
}

function parseDuckDuckGoResults(html, limit) {
  const results = [];
  const linkRegex = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null && results.length < limit) {
    const block = html.slice(match.index, Math.min(html.length, match.index + 2500));
    const snippetMatch = block.match(/class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>|class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
    const title = decodeHtml(stripHtml(match[2]).trim());
    const url = decodeDuckDuckGoUrl(match[1]);
    const snippet = decodeHtml(stripHtml((snippetMatch && (snippetMatch[1] || snippetMatch[2])) || '').trim());

    if (!title || !url) continue;
    results.push({ url, title, snippet });
  }

  return results;
}

function ensureVaultPath() {
  if (!VAULT_PATH) {
    throw new Error('OBSIDIAN_VAULT_PATH is not configured');
  }
}

function getSafePath(targetPath) {
  const full = path.resolve(VAULT_PATH, targetPath);
  if (full !== VAULT_PATH && !full.startsWith(`${VAULT_PATH}${path.sep}`)) {
    throw new Error('Access Denied');
  }
  return full;
}

async function ensureParentDirectory(fullPath) {
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
}

function requireString(value, name) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Invalid argument: ${name} is required and must be a string`);
  }
  return value.trim();
}

function sanitizeTitle(title) {
  return title.replace(/[<>:"/\\|?*\u0000-\u001F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
}

function sanitizePathPrefix(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  const normalized = normalizeSlash(value.trim()).replace(/^\/+/, '').replace(/\/+$/, '');
  if (normalized.includes('..')) throw new Error('Invalid argument: pathPrefix must stay inside the vault');
  return normalized;
}

function clampNumber(value, fallback, min, max) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(value)));
}

function sanitizeDomain(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  const cleaned = value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .toLowerCase();
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(cleaned)) {
    throw new Error('Invalid argument: site must be a valid domain (example.com)');
  }
  return cleaned;
}

function sanitizeRegion(value) {
  const region = String(value || '').trim().toLowerCase();
  if (!region) return 'wt-wt';
  if (!/^[a-z]{2}(?:-[a-z]{2})$/i.test(region)) {
    throw new Error('Invalid argument: region/lang must use format like us-en or kr-ko');
  }
  return region;
}

function sanitizeTimeRange(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  const normalized = value.trim().toLowerCase();
  const map = { day: 'd', week: 'w', month: 'm', year: 'y' };
  if (!map[normalized]) {
    throw new Error('Invalid argument: timeRange must be one of day, week, month, year');
  }
  return map[normalized];
}

function fromDuckDuckGoTimeRange(value) {
  const map = { d: 'day', w: 'week', m: 'month', y: 'year' };
  return map[value] || null;
}

function buildSearchTerms(query) {
  const phrases = [];
  const phraseRegex = /"([^"]+)"/g;
  let match;

  while ((match = phraseRegex.exec(query)) !== null) {
    if (match[1].trim()) phrases.push(match[1].trim());
  }

  const withoutPhrases = query.replace(phraseRegex, ' ');
  const keywords = [...new Set(withoutPhrases.split(/\s+/).map((item) => item.trim()).filter(Boolean))];
  return { phrases, keywords };
}

function normalizeText(value) {
  return value.toLowerCase().replace(/\r/g, '');
}

function normalizeSlash(value) {
  return value.replace(/\\/g, '/');
}

function countOccurrences(source, needle) {
  if (!source || !needle) return 0;
  let count = 0;
  let index = source.indexOf(needle);
  while (index !== -1) {
    count++;
    index = source.indexOf(needle, index + needle.length);
  }
  return count;
}

function hasWordBoundary(content, keyword) {
  const escaped = escapeRegExp(keyword);
  return new RegExp(`(^|[^\\p{L}\\p{N}_])${escaped}([^\\p{L}\\p{N}_]|$)`, 'iu').test(content);
}

function extractHeadings(content) {
  return content
    .split(/\r?\n/)
    .filter((line) => /^#{1,6}\s+/.test(line))
    .map((line) => line.replace(/^#{1,6}\s+/, '').trim())
    .filter(Boolean);
}

function extractTags(content) {
  return [...new Set((content.match(/(^|\s)#([^\s#.,/\\()[\]{}]+)/g) || [])
    .map((tag) => tag.trim().replace(/^[^#]*#/, '#'))
    .filter(Boolean))];
}

function extractWikiLinks(content) {
  const matches = content.match(/\[\[([^[\]|#]+)(?:#[^[\]|]+)?(?:\|[^[\]]+)?\]\]/g) || [];
  return matches
    .map((match) => match.slice(2, -2).split('|')[0].split('#')[0].trim())
    .filter(Boolean);
}

function buildSnippet(content, firstMatchIndex, matchedTerms) {
  const flatContent = content.replace(/\r/g, '');
  if (!flatContent.trim()) return '';

  let targetIndex = typeof firstMatchIndex === 'number' && firstMatchIndex >= 0 ? firstMatchIndex : -1;
  if (targetIndex === -1 && matchedTerms.length > 0) {
    const lowerContent = flatContent.toLowerCase();
    for (const term of matchedTerms) {
      const index = lowerContent.indexOf(term.toLowerCase());
      if (index !== -1) {
        targetIndex = index;
        break;
      }
    }
  }

  if (targetIndex === -1) {
    return flatContent.replace(/\n+/g, ' ').slice(0, 180).trim();
  }

  const start = Math.max(0, targetIndex - 70);
  const end = Math.min(flatContent.length, targetIndex + 140);
  return `${start > 0 ? '...' : ''}${flatContent.slice(start, end).replace(/\n+/g, ' ').trim()}${end < flatContent.length ? '...' : ''}`;
}

function computeRecencyBonus(modifiedAt) {
  const ageDays = (Date.now() - modifiedAt.getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays <= 3) return 6;
  if (ageDays <= 14) return 3;
  if (ageDays <= 30) return 1;
  return 0;
}

function extractKeywords(value, limit) {
  return [...new Set(normalizeText(value)
    .split(/[^\p{L}\p{N}_-]+/u)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2)
    .slice(0, limit))];
}

function intersectKeywords(left, right) {
  const leftValues = Array.isArray(left) ? left : extractKeywords(left, 12);
  const rightValues = Array.isArray(right) ? right : extractKeywords(right, 12);
  const rightSet = new Set(rightValues);
  return leftValues.filter((item) => rightSet.has(item));
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
}

function decodeDuckDuckGoUrl(value) {
  if (!value) return '';
  const decoded = decodeHtml(value);
  try {
    const urlObj = new URL(decoded, 'https://duckduckgo.com');
    const redirectTarget = urlObj.searchParams.get('uddg');
    if (redirectTarget) return decodeURIComponent(redirectTarget);
    if (/^https?:\/\//i.test(decoded)) return decoded;
    if (/^https?:\/\//i.test(urlObj.toString())) return urlObj.toString();
  } catch (e) {
    if (/^https?:\/\//i.test(decoded)) return decoded;
  }
  return '';
}

function sanitizeEvalContext(value) {
  if (value === undefined) return {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid argument: context must be a plain object');
  }

  const output = {};
  for (const [key, item] of Object.entries(value)) {
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) continue;
    output[key] = sanitizeJsonLikeValue(item, 0);
  }
  return output;
}

function sanitizeJsonLikeValue(value, depth) {
  if (depth > 4) return null;
  if (value === null) return null;
  if (typeof value === 'string') return value.slice(0, 5000);
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.slice(0, 200).map((item) => sanitizeJsonLikeValue(item, depth + 1));
  if (typeof value === 'object') {
    const nested = {};
    for (const [key, item] of Object.entries(value).slice(0, 200)) {
      nested[String(key).slice(0, 100)] = sanitizeJsonLikeValue(item, depth + 1);
    }
    return nested;
  }
  return String(value);
}

function isPromiseLike(value) {
  return !!value && typeof value.then === 'function';
}

function promiseWithTimeout(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`js_eval timed out after ${timeoutMs}ms`)), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

function safeSerialize(value) {
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) return value;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (e) {
    return String(value);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sortText(left, right) {
  return String(left).localeCompare(String(right), 'en');
}

log(`Fast Obsidian MCP Server (v${SERVER_VERSION}) Running - Search + JS Eval Activated`);
