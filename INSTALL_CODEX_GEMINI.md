# Fast Obsidian MCP Setup Guide (Codex and Gemini)

This guide explains how to connect `fast-obsidian-mcp` in Codex CLI and Gemini CLI.

## 1. Prerequisites
- Node.js 16+
- Repo path: `C:\Users\<USER>\fast-obsidian-mcp`
- Vault path example: `C:\Gemini Project`

Check:
```powershell
node -v
```

## 2. Clone the repo
```powershell
git clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git C:\Users\<USER>\fast-obsidian-mcp
```

## 3. Connect in Codex CLI
Config file:
- `C:\Users\<USER>\.codex\config.toml`

Add:
```toml
[mcp_servers.obsidian]
command = "node"
args = ['C:\Users\<USER>\fast-obsidian-mcp\src\index.js']
env = { OBSIDIAN_VAULT_PATH = 'C:\Gemini Project' }
```

Restart the Codex session after saving.

## 4. Connect in Gemini CLI
Config file (may vary by environment):
- `%USERPROFILE%\.gemini\settings.json`

Add under `mcpServers`:
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["C:/Users/<USER>/fast-obsidian-mcp/src/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "C:/Gemini Project"
      }
    }
  }
}
```

## 5. Smoke test
Run tools in this order:
1. `list_notes`
2. `read_note` with an existing note path
3. `write_note` with `title` and `content`
4. `search_notes` with a keyword

## 6. Common issues
1. `node` not found:
- Reinstall Node.js or fix PATH.

2. Vault access error:
- Verify `OBSIDIAN_VAULT_PATH`.
- Check write permission on the vault folder.

3. Server not shown in Codex immediately:
- Restart Codex session.
