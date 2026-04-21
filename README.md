# 🚀 Fast Obsidian MCP Server (v1.5.0)
![License: Non-Commercial](https://img.shields.io/badge/License-Non--Commercial-orange.svg)
![Node version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![MCP version](https://img.shields.io/badge/MCP-1.5.0-blue.svg)

[Korean Guide](./README_KO.md)

High-performance, zero-dependency MCP server for Obsidian.
Find exact knowledge instantly across thousands of notes with the new Intelligence Search engine.

## ✨ New in v1.5.0: Intelligence Search

- 🧠 **Weighted Scoring**: Prioritizes title matches and keyword density to bring the most relevant notes to the top.
- 💬 **Contextual Snippets**: Automatically extracts the surrounding context of your search terms, making results more readable for both you and the AI.
- 🤖 **AI Recommendation Engine (`get_recommendations`)**: AI analyzes your vault to suggest next topics and missing links.
- 📅 **Safe Auto-Organization (`organize_notes_by_date`)**: Automatically moves root notes into date-based folders with overwrite protection.

## 🛠️ Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)

### 2. Clone Repository
```bash
git clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git
cd Obsidian-for-Gemini-Cli
```

### 3. Configuration (Gemini CLI)
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

## 📂 Available Tools (v1.5.0)

| Tool | Description | Highlights |
| :--- | :--- | :--- |
| `search_notes` | **(UPGRADED)** High-performance weighted search | Contextual snippet extraction |
| `get_recommendations` | AI suggests next topics/links | Vault content analysis |
| `organize_notes_by_date` | Move root notes to date folders safely | Overwrite protection |
| `update_note` | Create/Update a note at a specific path | Precise control |
| `web_search` / `web_clip` | Real-time web search and extraction | External knowledge integration |

## ⚡ Quick Install for Gemini CLI (Magic Prompt)

> **"Hi Gemini, install 'Fast Obsidian MCP' server for me. Clone `https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git` into `C:\Users\%USERNAME%\fast-obsidian-mcp`, and register it as an 'obsidian' server in my settings. My obsidian vault path is `C:\Gemini Project`."**

## 📄 License
Non-Commercial License. **Sale or redistribution for commercial purposes is strictly prohibited.**

---
Developed by **An Ho Yong**