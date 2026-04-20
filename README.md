# Fast Obsidian MCP Server
![License: Non-Commercial](https://img.shields.io/badge/License-Non--Commercial-orange.svg)
![Node version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)

High-performance, zero-dependency MCP server for Obsidian.
It lets AI clients interact with your local vault through MCP tools.

[Korean Guide](./README_KR.md)

## Codex and Gemini Obsidian MCP Guide
Use these docs for quick setup:
- [INSTALL_CODEX_GEMINI.md](./INSTALL_CODEX_GEMINI.md)
- [INSTALL_PROMPTS_CODEX_GEMINI.md](./INSTALL_PROMPTS_CODEX_GEMINI.md)

Quick config examples:

1. Codex (`.codex/config.toml`)
```toml
[mcp_servers.obsidian]
command = "node"
args = ['C:\Users\<USER>\fast-obsidian-mcp\src\index.js']
env = { OBSIDIAN_VAULT_PATH = 'C:\Gemini Project' }
```

2. Gemini (`%USERPROFILE%\.gemini\settings.json`)
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

## Features
- Zero dependency: no `npm install` required
- Fast file operations on markdown notes
- Web search and web clipping helpers
- Internal link suggestions for notes
- Asset listing support

## Installation
1. Prerequisites
- [Node.js](https://nodejs.org/) 16+
- [Rclone](https://rclone.org/) (optional, for cloud sync scripts)

2. Clone
```bash
git clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git C:\Users\<USER>\fast-obsidian-mcp
cd C:\Users\<USER>\fast-obsidian-mcp
```

## Tools
| Tool | Description | Input |
| :--- | :--- | :--- |
| `list_notes` | List markdown files in the vault | None |
| `read_note` | Read one note | `path` |
| `write_note` | Create or update a note | `title`, `content` |
| `search_notes` | Search notes by keyword | `query` |
| `web_search` | Search the web | `query` |
| `web_clip` | Extract text from a URL | `url` |
| `smart_link` | Suggest `[[note]]` links | `text` |
| `list_assets` | List non-markdown files | None |

## License
Non-Commercial License. Sale is strictly prohibited.

Developed by An Ho Yong
