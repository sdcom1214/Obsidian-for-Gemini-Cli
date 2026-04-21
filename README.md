# Fast Obsidian MCP Server (v1.7.0)
![License: Non-Commercial](https://img.shields.io/badge/License-Non--Commercial-orange.svg)
![Node version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![MCP version](https://img.shields.io/badge/MCP-1.7.0-blue.svg)

[Korean Guide](./README_KO.md)

High-performance, zero-dependency MCP server for Obsidian.
This version adds safe JavaScript execution and advanced web search query controls.

## New in v1.7.0

- New `js_eval` tool for restricted JavaScript execution with timeout and optional context object.
- Upgraded `web_search` with `limit`, `site`, `region/lang`, `timeRange`, and `safeSearch` controls.
- Improved web result parsing for cleaner title/snippet extraction and redirect URL decoding.
- Existing vault tools remain compatible (`search_notes`, `get_recommendations`, `smart_link`, etc.).

## Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v16 or higher

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

## Available Tools (v1.7.0)

| Tool | Description | Highlights |
| :--- | :--- | :--- |
| `search_notes` | Weighted vault search with phrase support and filters | Snippets, headings, tags, metadata |
| `get_recommendations` | Analyze vault structure and suggest next links | Latest notes, top tags, orphan detection |
| `update_note` | Create or update a note at a specific path | Creates nested folders automatically |
| `organize_notes_by_date` | Move root notes to date folders safely | Overwrite protection |
| `smart_link` | Suggest internal links from note similarity | Keyword overlap scoring |
| `web_search` / `web_clip` | Real-time web search and extraction | Query filters + external knowledge integration |
| `js_eval` | Run JavaScript in an isolated VM context | Timeout control + optional variables |

## Search Notes Examples

```json
{ "query": "agent memory" }
```

```json
{ "query": "\"project update\" roadmap", "limit": 5, "pathPrefix": "Work/Projects" }
```

## Web Search Example

```json
{
  "query": "MCP server best practices",
  "limit": 5,
  "site": "modelcontextprotocol.io",
  "region": "us-en",
  "timeRange": "month",
  "safeSearch": true
}
```

## JS Eval Example

```json
{
  "code": "Math.round((price + tax) * 100) / 100",
  "context": { "price": 12.345, "tax": 0.99 },
  "timeoutMs": 300
}
```

## License
Non-Commercial License. Sale or redistribution for commercial purposes is strictly prohibited.

Developed by **An Ho Yong**
