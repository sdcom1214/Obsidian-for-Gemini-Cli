/**
 * Fast Obsidian MCP Server (v1.0.0)
 * 
 * A high-performance, zero-dependency MCP server for Obsidian Vault.
 * Provides tools for listing, reading, searching, and writing notes.
 * 
 * Features:
 * - Zero external dependencies (Pure Node.js)
 * - Parallel file system operations for performance
 * - Date-based folder & file organization (Standardized)
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Configuration: Obsidian Vault Path
const VAULT_PATH = path.resolve(process.env.OBSIDIAN_VAULT_PATH || '');

if (!VAULT_PATH) {
  console.error("Error: OBSIDIAN_VAULT_PATH environment variable is required.");
  process.exit(1);
}

const rl = readline.createInterface({ input: process.stdin, terminal: false });

// Helper: JSON-RPC response
const send = (id, result = null, error = null) => {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result, error }) + '\n');
};

const log = (msg) => console.error(`[Obsidian-MCP] ${msg}`);

rl.on('line', async (line) => {
  try {
    const { method, params, id } = JSON.parse(line);

    switch (method) {
      case 'initialize':
        return send(id, { 
          protocolVersion: '2024-11-05', 
          capabilities: { tools: {} }, 
          serverInfo: { name: 'fast-obsidian-mcp', version: '1.0.0' } 
        });

      case 'notifications/initialized': return;

      case 'tools/list':
        return send(id, {
          tools: [
            { name: 'list_notes', description: 'List all markdown notes in the vault.', inputSchema: { type: 'object' } },
            { name: 'read_note', description: 'Read a note content.', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ["path"] } },
            { name: 'search_notes', description: 'Fast search keyword in vault.', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ["query"] } },
            { name: 'write_note', description: 'Write a note with standard date-based organization.', inputSchema: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' } }, required: ["title", "content"] } }
          ]
        });

      case 'tools/call':
        const { name, arguments: args } = params;
        const result = await handleTool(name, args);
        return send(id, result);

      default:
        return send(id, null, { code: -32601, message: 'Method not found' });
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

    if (name === 'list_notes') {
      const files = await walk(VAULT_PATH);
      return { content: [{ type: 'text', text: files.join('\n') }] };
    }

    if (name === 'read_note') {
      const content = await fs.readFile(getSafePath(args.path), 'utf-8');
      return { content: [{ type: 'text', text: content }] };
    }

    if (name === 'write_note') {
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const folderPath = path.join(VAULT_PATH, date);
      const fileName = `${args.title}_${date}.md`;
      const full = path.join(folderPath, fileName);
      
      await fs.mkdir(folderPath, { recursive: true });
      await fs.writeFile(full, args.content, 'utf-8');
      return { content: [{ type: 'text', text: `Success: ${date}/${fileName} created` }] };
    }

    if (name === 'search_notes') {
      const query = (args.query || '').toLowerCase();
      const files = await walk(VAULT_PATH);
      const matches = await Promise.all(files.map(async (f) => {
        const c = await fs.readFile(path.join(VAULT_PATH, f), 'utf-8');
        if (c.toLowerCase().includes(query)) {
          return { path: f, preview: c.slice(0, 60).replace(/\n/g, ' ') + '...' };
        }
        return null;
      }));
      return { content: [{ type: 'text', text: JSON.stringify(matches.filter(Boolean), null, 2) }] };
    }
  } catch (e) { return { isError: true, content: [{ type: 'text', text: e.message }] }; }
}

async function walk(dir, rel = '') {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (e) => {
      if (e.name.startsWith('.') || e.name === 'node_modules') return [];
      const res = path.join(dir, e.name);
      const r = path.join(rel, e.name);
      return e.isDirectory() ? walk(res, r) : (e.name.endsWith('.md') ? r : []);
    }));
    return files.flat();
  } catch (e) { return []; }
}

log('Fast Obsidian MCP Server (v1.0.0) Running (Zero-Dep)');
