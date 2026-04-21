# 🚀 Fast Obsidian MCP Server (v1.4.0)
![License: Non-Commercial](https://img.shields.io/badge/License-Non--Commercial-orange.svg)
![Node version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![MCP version](https://img.shields.io/badge/MCP-1.4.0-blue.svg)

[Korean Guide](./README_KR.md)

High-performance, zero-dependency MCP server for Obsidian.
Let AI organize your knowledge and suggest new insights directly in your vault.

## ✨ New in v1.4.0

- 🤖 **AI Recommendation Engine (`get_recommendations`)**: AI analyzes your vault to suggest next topics and relevant links.
- 📅 **Safe Auto-Organization (`organize_notes_by_date`)**: Automatically moves root notes into date-based folders (`YYYY-MM-DD/`) with overwrite protection.
- 📝 **Precise Path Updates (`update_note`)**: Create or update notes at any specific path within the vault.
- 🌐 **Master Wiki (`Wiki.md`)**: Support for automated dashboarding to visualize your entire vault structure.

## 🛠️ Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)

### 2. Clone Repository
```bash
git clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git
cd Obsidian-for-Gemini-Cli
```

## ⚙️ Configuration

Add the following to your `Gemini CLI` or `Codex` config:

**Gemini (`settings.json`)**
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["C:/path/to/Obsidian-for-Gemini-Cli/src/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "C:/Your/Obsidian/Vault"
      }
    }
  }
}
```

## 📂 Available Tools (v1.4.0)

| Tool | Description | Input |
| :--- | :--- | :--- |
| `list_notes` | List all markdown notes in the vault | None |
| `read_note` | Read content of a specific note | `path` |
| `update_note` | **(NEW)** Create/Update a note at a specific path | `path`, `content` |
| `organize_notes_by_date` | **(NEW)** Move root notes to date-based folders safely | None |
| `get_recommendations` | **(NEW)** AI suggests next topics/links based on content | None |
| `write_note` | Create a note with `Title_Date.md` format | `title`, `content` |
| `search_notes` | Blazing fast parallel keyword search | `query` |
| `web_search` | Search the web for real-time info | `query` |
| `web_clip` | Extract and clean content from a URL | `url` |
| `smart_link` | Suggest internal links based on similarity | `text` |
| `list_assets` | List images, PDFs, and other assets | None |

## 🔒 Safety & Reliability
- **Access Control**: Strictly prevents access outside `OBSIDIAN_VAULT_PATH`.
- **Data Protection**: Automatically adds timestamps to filenames if a duplicate exists during organization to prevent data loss.
- **Robustness**: Individual file errors do not crash the entire MCP server.

## 📄 License
Non-Commercial License. **Sale or redistribution for commercial purposes is strictly prohibited.**

---
Developed by **An Ho Yong**
