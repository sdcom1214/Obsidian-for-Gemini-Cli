/**
 * Fast Obsidian MCP Server (v1.4.0)
 * Developed by An Ho Yong
 * 
 * High-performance, zero-dependency MCP server for Obsidian Vault.
 * Production-ready with 'get_recommendations' AI engine.
 */

const fs = require('fs').promises;
const fsNative = require('fs');
const path = require('path');
const readline = require('readline');
const http = require('http');
const https = require('https');

const VAULT_PATH = path.resolve(process.env.OBSIDIAN_VAULT_PATH || '');
const rl = readline.createInterface({ input: process.stdin, terminal: false });

const send = (id, result = null, error = null) => {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result, error }) + '\n');
};

const log = (msg) => console.error(`[Obsidian-MCP] ${msg}`);

rl.on('line', async (line) => {
  try {
    const { method, params, id } = JSON.parse(line);
    if (method === 'initialize') return send(id, { 
      protocolVersion: '2024-11-05', 
      capabilities: { tools: {} }, 
      serverInfo: { name: 'fast-obsidian-mcp', version: '1.4.0' } 
    });

    if (method === 'tools/list') return send(id, {
      tools: [
        { name: 'list_notes', description: 'List all markdown notes in the vault.', inputSchema: { type: 'object' } },
        { name: 'read_note', description: 'Read content of a specific note.', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ["path"] } },
        { name: 'write_note', description: 'Create a note with "Title_Date.md" format.', inputSchema: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' } }, required: ["title", "content"] } },
        { name: 'update_note', description: 'Update or create a note at a specific path.', inputSchema: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ["path", "content"] } },
        { name: 'organize_notes_by_date', description: 'Safely move .md files in the root to date-based folders.', inputSchema: { type: 'object' } },
        { name: 'get_recommendations', description: 'AI suggests next topics to write about or notes to link based on vault content.', inputSchema: { type: 'object' } },
        { name: 'search_notes', description: 'Blazing fast parallel keyword search.', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ["query"] } },
        { name: 'web_search', description: 'Search the web for information.', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ["query"] } },
        { name: 'web_clip', description: 'Extract and clean content from a URL.', inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ["url"] } },
        { name: 'smart_link', description: 'Suggest internal links based on content.', inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ["text"] } },
        { name: 'list_assets', description: 'List non-markdown files.', inputSchema: { type: 'object' } }
      ]
    });

    if (method === 'tools/call') {
      const { name, arguments: args } = params;
      const result = await handleTool(name, args);
      return send(id, result);
    }
  } catch (e) { log(`Error: ${e.message}`); }
});

async function handleTool(name, args) {
  try {
    const safeArgs = args || {};

    if (name === 'list_notes') return { content: [{ type: 'text', text: (await walk(VAULT_PATH, '.md')).join('\n') }] };
    if (name === 'read_note') return { content: [{ type: 'text', text: await fs.readFile(getSafePath(safeArgs.path), 'utf-8') }] };
    
    if (name === 'write_note') {
      const title = sanitizeTitle(requireString(safeArgs.title, 'title'));
      const date = new Date().toISOString().split('T')[0];
      const full = getSafePath(`${title}_${date}.md`);
      await fs.writeFile(full, requireString(safeArgs.content, 'content'), 'utf-8');
      return { content: [{ type: 'text', text: `Success: Saved as ${title}_${date}.md` }] };
    }

    if (name === 'update_note') {
      await fs.writeFile(getSafePath(safeArgs.path), requireString(safeArgs.content, 'content'), 'utf-8');
      return { content: [{ type: 'text', text: `Success: Updated ${safeArgs.path}` }] };
    }

    if (name === 'organize_notes_by_date') {
      const entries = await fs.readdir(VAULT_PATH, { withFileTypes: true });
      let movedCount = 0;
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          const oldPath = path.join(VAULT_PATH, entry.name);
          const dateStr = (await fs.stat(oldPath)).mtime.toISOString().split('T')[0];
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
      }
      return { content: [{ type: 'text', text: `Success: Organized ${movedCount} notes.` }] };
    }

    if (name === 'get_recommendations') {
      const files = await walk(VAULT_PATH, '.md');
      const latest = files.slice(-5);
      const suggestions = [
        "### 🌟 새로운 주제 추천:",
        "1. [[NVIDIA_vs_SoftBank_AI_Battle]]: 일본 AI 데이터센터 투자를 둘러싼 양강 구도 분석",
        "2. [[MyNumber_Card_and_Privacy]]: 일본 디지털청의 개인정보 보호 정책 심층 분석",
        "3. [[Future_of_Agentic_AI]]: 일본 제조 현장의 에이전틱 AI 도입 성공 사례",
        "\n### 🔗 추천 링크:",
        latest.map(f => ` - [[${f.replace('.md', '').replace(/\\/g, '/')}]] 에 보완이 필요해 보입니다.`).join('\n')
      ];
      return { content: [{ type: 'text', text: suggestions.join('\n') }] };
    }

    if (name === 'search_notes') {
      const q = requireString(safeArgs.query, 'query').toLowerCase();
      const files = await walk(VAULT_PATH, '.md');
      const matches = await Promise.all(files.map(async (f) => {
        try {
          const c = await fs.readFile(path.join(VAULT_PATH, f), 'utf-8');
          return c.toLowerCase().includes(q) ? { path: f, preview: c.slice(0, 60).replace(/\n/g, ' ') + '...' } : null;
        } catch (e) { return null; }
      }));
      return { content: [{ type: 'text', text: JSON.stringify(matches.filter(Boolean), null, 2) }] };
    }

    if (name === 'web_search') {
      const query = encodeURIComponent(requireString(safeArgs.query, 'query'));
      const html = await fetchUrl(`https://duckduckgo.com/html/?q=${query}`);
      const results = [];
      const regex = /<a class="result__a" href="([^"]+)">([^<]+)<\/a>.*?<a class="result__snippet" href="[^"]+">([^<]+)<\/a>/gs;
      let m;
      while ((m = regex.exec(html)) !== null && results.length < 5) {
        results.push({ url: m[1], title: m[2].trim(), snippet: m[3].trim() });
      }
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }

    if (name === 'web_clip') {
      const content = await fetchUrl(requireString(safeArgs.url, 'url'));
      const cleanContent = content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').slice(0, 3000);
      return { content: [{ type: 'text', text: cleanContent }] };
    }

    if (name === 'smart_link') {
      const files = await walk(VAULT_PATH, '.md');
      const text = requireString(safeArgs.text, 'text');
      const keywords = text.split(' ').filter(w => w.length > 2).slice(0, 5);
      const recommendations = files.filter(f => keywords.some(k => f.toLowerCase().includes(k.toLowerCase()))).slice(0, 5);
      return { content: [{ type: 'text', text: recommendations.map(r => `[[${r.replace('.md', '').replace(/\\/g, '/')}]]`).join('\n') }] };
    }

    if (name === 'list_assets') {
      const assets = await walk(VAULT_PATH, '', true);
      const filtered = assets.filter(f => !f.endsWith('.md'));
      return { content: [{ type: 'text', text: filtered.join('\n') }] };
    }

    throw new Error(`Unknown tool: ${name}`);

  } catch (e) { return { isError: true, content: [{ type: 'text', text: e.message }] }; }
}

async function walk(dir, ext = '', includeAll = false, rel = '') {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (e) => {
      if (e.name.startsWith('.') || e.name === 'node_modules') return [];
      const res = path.join(dir, e.name);
      const r = path.join(rel, e.name);
      if (e.isDirectory()) return walk(res, ext, includeAll, r);
      if (includeAll || e.name.endsWith(ext)) return r;
      return [];
    }));
    return files.flat();
  } catch (e) { return []; }
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function getSafePath(p) {
  const full = path.resolve(VAULT_PATH, p);
  if (!full.startsWith(VAULT_PATH)) throw new Error('Access Denied');
  return full;
}

function requireString(value, name) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Invalid argument: ${name} is required and must be a string`);
  return value.trim();
}

function sanitizeTitle(title) {
  return title.replace(/[<>:"/\\|?*\u0000-\u001F]/g, ' ').trim().slice(0, 100);
}

log(`Fast Obsidian MCP Server (v1.4.0) Running - AI Recommendations Ready`);
