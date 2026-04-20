# 🚀 Fast Obsidian MCP Server
![License: Non-Commercial](https://img.shields.io/badge/License-Non--Commercial-orange.svg)
![Node version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![MCP version](https://img.shields.io/badge/MCP-1.2.0-blue.svg)

[🇰🇷 한국어 문서(Korean Guide)](./README_KR.md)

A high-performance, **zero-dependency** Model Context Protocol (MCP) server for Obsidian. This tool allows AI models (like Claude, Gemini, etc.) to interact directly with your local Obsidian vault.

## ✨ Key Features

- ⚡ **Zero-Dependency**: No `npm install` required. Pure Node.js.
- 🚀 **High Performance**: Parallel file system operations for instant response.
- 📅 **Smart Organization**: Automatically organizes notes by date (`YYYY-MM-DD/Title_Date.md`).
- 🌐 **Web Search & Clip**: Search the web and extract content directly into your vault.
- 🔒 **Secure**: Strict path validation to protect your data.

## 🛠️ Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Rclone](https://rclone.org/) (optional, for cloud sync)

### 2. Setup
```bash
git clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git
cd Obsidian-for-Gemini-Cli
```

## ⚙️ Configuration

Add to your MCP client config (e.g., `claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["C:/path/to/fast-obsidian-mcp/src/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "C:/Your/Vault/Path"
      }
    }
  }
}
```

## 📂 Tools Provided (v1.2.0)

| Tool | Description | Input |
| :--- | :--- | :--- |
| `list_notes` | List all markdown files in the vault. | None |
| `read_note` | Read the content of a specific note. | `path` |
| `write_note` | Create/update notes with date-based folder. | `title`, `content` |
| `search_notes` | Fast parallel search across all notes. | `query` |
| `web_search` | Search the web (DuckDuckGo based). | `query` |
| `web_clip` | Extract and clean text from a URL. | `url` |
| `smart_link` | Suggest internal links `[[note]]` based on text. | `text` |
| `list_assets` | List non-markdown files (images, PDFs). | None |

## ⚡ Quick Install via Gemini CLI (Magic Prompt)

> **"Hey Gemini, install the 'Fast Obsidian MCP' server for me. Clone `https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git` into `C:\Users\%USERNAME%\fast-obsidian-mcp` and register it as 'obsidian' in my `.gemini/settings.json`. My vault path is `C:\Gemini Project`."**

## 📄 License
Non-Commercial License. Sale is strictly prohibited.

---
Developed by **안호영 (An Ho Yong)**
