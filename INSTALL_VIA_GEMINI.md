# 🤖 Gemini CLI 초고속 자동 설치 프롬프트

아래의 박스 안의 내용을 **전부 복사**하여 Gemini CLI 대화창에 붙여넣으세요. 
Gemini가 스스로 판단하여 파일들을 생성하고 설정을 완료할 것입니다.

---

### 📋 복사할 내용 (이 아래부터 끝까지 복사하세요)

안녕 Gemini! 아래의 고성능 **Fast Obsidian MCP** 서버를 내 컴퓨터에 설치해줘.

1. **대상 폴더**: `C:\Users\%USERNAME%\fast-obsidian-mcp`
2. **설정 등록**: `.gemini/settings.json`에 `obsidian`이라는 이름으로 서버를 등록해.
3. **환경 변수**: `OBSIDIAN_VAULT_PATH`를 `C:\Gemini Project`로 설정해.

**생성할 소스 코드 (`src/index.js`):**
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

위 코드를 바탕으로 설치를 완료해줘!

---
**Developed by 안호영 (An Ho Yong)**
