# 🚀 Fast Obsidian MCP - Gemini CLI 자동 설치 가이드

이 문서를 Gemini CLI에 그대로 복사해서 붙여넣으세요. Gemini CLI가 모든 설치 과정을 자동으로 수행합니다.

---

## 🤖 Gemini CLI에게 보내는 메시지 (아래 내용을 복사하세요)

> **"안녕 Gemini, 아래의 고성능 Obsidian MCP 서버를 내 컴퓨터에 설치해줘. 모든 파일은 `C:\Users\%USERNAME%\fast-obsidian-mcp` 폴더에 생성하고, 내 Gemini CLI 설정(`.gemini/settings.json`)에도 'obsidian' 서버로 등록해줘. 내 옵시디언 보관소 경로는 `C:\Gemini Project`야."**

### 📦 생성할 파일 목록 및 코드

#### 1. package.json
```json
{
  "name": "fast-obsidian-mcp",
  "version": "1.0.0",
  "main": "src/index.js",
  "author": "An Ho Yong",
  "license": "MIT"
}
```

#### 2. src/index.js (초고속 Zero-Dep MCP 서버)
```javascript
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const VAULT_PATH = path.resolve(process.env.OBSIDIAN_VAULT_PATH || '');
const rl = readline.createInterface({ input: process.stdin, terminal: false });
const send = (id, result = null, error = null) => { process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result, error }) + '\n'); };
rl.on('line', async (line) => {
  try {
    const { method, params, id } = JSON.parse(line);
    if (method === 'initialize') return send(id, { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'fast-obsidian-mcp', version: '1.0.0' } });
    if (method === 'tools/list') return send(id, { tools: [
      { name: 'list_notes', description: '메모 목록 조회', inputSchema: { type: 'object' } },
      { name: 'read_note', description: '메모 읽기', inputSchema: { type: 'object', properties: { path: { type: 'string' } } } },
      { name: 'write_note', description: '날짜별 폴더 정리 생성', inputSchema: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' } } } },
      { name: 'search_notes', description: '고속 병렬 검색', inputSchema: { type: 'object', properties: { query: { type: 'string' } } } }
    ]});
    if (method === 'tools/call') {
      const { name, arguments: args } = params;
      const getSafePath = (p) => path.join(VAULT_PATH, p);
      if (name === 'list_notes') { const f = await walk(VAULT_PATH); return send(id, { content: [{ type: 'text', text: f.join('\n') }] }); }
      if (name === 'read_note') { const c = await fs.readFile(getSafePath(args.path), 'utf-8'); return send(id, { content: [{ type: 'text', text: c }] }); }
      if (name === 'write_note') {
        const d = new Date().toISOString().split('T')[0];
        const folder = path.join(VAULT_PATH, d);
        const file = path.join(folder, `${args.title}_${d}.md`);
        await fs.mkdir(folder, { recursive: true });
        await fs.writeFile(file, args.content, 'utf-8');
        return send(id, { content: [{ type: 'text', text: `Success: ${d}/${args.title}_${d}.md` }] });
      }
      if (name === 'search_notes') {
        const q = args.query.toLowerCase(); const f = await walk(VAULT_PATH);
        const m = await Promise.all(f.map(async (i) => {
          const c = await fs.readFile(path.join(VAULT_PATH, i), 'utf-8');
          return c.toLowerCase().includes(q) ? { path: i, preview: c.slice(0, 50) + '...' } : null;
        }));
        return send(id, { content: [{ type: 'text', text: JSON.stringify(m.filter(Boolean), null, 2) }] });
      }
    }
  } catch (e) { console.error(e); }
});
async function walk(dir, rel = '') {
  const ent = await fs.readdir(dir, { withFileTypes: true });
  const f = await Promise.all(ent.map(async (e) => {
    if (e.name.startsWith('.') || e.name === 'node_modules') return [];
    return e.isDirectory() ? walk(path.join(dir, e.name), path.join(rel, e.name)) : (e.name.endsWith('.md') ? path.join(rel, e.name) : []);
  }));
  return f.flat();
}
```

---

## 🛠️ 수동 설치를 원하는 경우 (PowerShell)
직접 실행하려면 아래 명령어를 복사하세요:
```powershell
$path = "$env:USERPROFILE\fast-obsidian-mcp" ; mkdir $path ; mkdir "$path\src"
# (위에 있는 코드를 각각 index.js 등으로 저장하면 됩니다)
```

**Developed by An Ho Yong**
