/**
 * Fast Obsidian MCP Server (v1.1.0)
 * Developed by 안호영 (An Ho Yong)
 */

const fs = require('fs').promises;
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
    if (method === 'initialize') return send(id, { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'fast-obsidian-mcp', version: '1.1.0' } });
    if (method === 'tools/list') return send(id, {
      tools: [
        { name: 'list_notes', description: '모든 마크다운 노트 목록 조회', inputSchema: { type: 'object' } },
        { name: 'read_note', description: '노트 내용 읽기', inputSchema: { type: 'object', properties: { path: { type: 'string' } } } },
        { name: 'write_note', description: '노트 생성/수정 (날짜별 정리)', inputSchema: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' } }, required: ["title", "content"] } },
        { name: 'search_notes', description: '고속 병렬 검색', inputSchema: { type: 'object', properties: { query: { type: 'string' } } } },
        { name: 'web_clip', description: '웹 페이지 내용을 마크다운으로 추출', inputSchema: { type: 'object', properties: { url: { type: 'string' }, title: { type: 'string' } }, required: ["url"] } },
        { name: 'smart_link', description: '관련 있는 기존 노트 링크 추천', inputSchema: { type: 'object', properties: { text: { type: 'string' } } } },
        { name: 'list_assets', description: '이미지 등 첨부파일 목록 조회', inputSchema: { type: 'object' } }
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
    const getSafePath = (p) => {
      const full = path.join(VAULT_PATH, p);
      if (!full.startsWith(VAULT_PATH)) throw new Error('Access Denied');
      return full;
    };

    if (name === 'list_notes') return { content: [{ type: 'text', text: (await walk(VAULT_PATH, '.md')).join('\n') }] };
    if (name === 'read_note') return { content: [{ type: 'text', text: await fs.readFile(getSafePath(args.path), 'utf-8') }] };
    
    if (name === 'write_note') {
      const date = new Date().toISOString().split('T')[0];
      const folder = path.join(VAULT_PATH, date);
      const file = path.join(folder, `${args.title}_${date}.md`);
      await fs.mkdir(folder, { recursive: true });
      await fs.writeFile(file, args.content, 'utf-8');
      return { content: [{ type: 'text', text: `Success: ${date}/${args.title}_${date}.md` }] };
    }

    if (name === 'search_notes') {
      const q = args.query.toLowerCase();
      const files = await walk(VAULT_PATH, '.md');
      const matches = await Promise.all(files.map(async (f) => {
        const c = await fs.readFile(path.join(VAULT_PATH, f), 'utf-8');
        return c.toLowerCase().includes(q) ? { path: f, preview: c.slice(0, 60).replace(/\n/g, ' ') + '...' } : null;
      }));
      return { content: [{ type: 'text', text: JSON.stringify(matches.filter(Boolean), null, 2) }] };
    }

    if (name === 'web_clip') {
      const content = await fetchUrl(args.url);
      const cleanContent = content.replace(/<[^>]*>?/gm, ' ').slice(0, 2000); // Simple HTML to Text
      return { content: [{ type: 'text', text: cleanContent }] };
    }

    if (name === 'smart_link') {
      const files = await walk(VAULT_PATH, '.md');
      const keywords = args.text.split(' ').filter(w => w.length > 1).slice(0, 5);
      const recommendations = files.filter(f => keywords.some(k => f.includes(k))).slice(0, 5);
      return { content: [{ type: 'text', text: recommendations.map(r => `[[${r.replace('.md', '')}]]`).join('\n') }] };
    }

    if (name === 'list_assets') {
      const assets = await walk(VAULT_PATH, '', true);
      const filtered = assets.filter(f => !f.endsWith('.md'));
      return { content: [{ type: 'text', text: filtered.join('\n') }] };
    }

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
    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

log('Fast Obsidian MCP Server (v1.1.0) Running - Mega Update by An Ho Yong');
