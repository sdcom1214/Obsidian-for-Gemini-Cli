# ?? Fast Obsidian MCP Server

[?á∞?á∑ ?úÍµ≠??Î¨∏ÏÑú(Korean Guide)](./README_KR.md)

A high-performance, **zero-dependency** Model Context Protocol (MCP) server for Obsidian. This tool allows AI models (like Claude, Gemini, etc.) to interact directly with your local Obsidian vault.

## ??Key Features

- ??**Zero-Dependency**: No `npm install` required for runtime. Pure Node.js.
- ?? **High Performance**: Parallel file system operations for instant search/read.
- ?ìÖ **Smart Organization**: Automatically organizes notes by date (`YYYY-MM-DD/Title_Date.md`).
- ?ÅÔ∏è **Cloud Sync**: Built-in support for Google Drive synchronization via Rclone.
- ?îí **Secure**: Path validation to ensure AI stays within your vault.

## ?õ†Ô∏?Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rclone](https://rclone.org/) (optional, for Google Drive sync)

### 2. Setup
Clone this repository or download the files.
```bash
git clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git
cd Obsidian-for-Gemini-Cli
```

## ?ôÔ∏è Configuration

Add the following to your MCP client config (e.g., `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["C:/path/to/fast-obsidian-mcp/src/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "C:/Your/Obsidian/Vault/Path"
      }
    }
  }
}
```

## ?ìÇ Tools Provided

| Tool | Description |
| :--- | :--- |
| `list_notes` | Lists all markdown files in the vault. |
| `read_note` | Reads the content of a specific note. |
| `write_note` | Creates or updates a note with date-based folder. |
| `search_notes` | Blazing fast parallel search across the entire vault. |

## ??Quick Install via Gemini CLI (Magic Prompt)

Just copy and paste the prompt below into your **Gemini CLI**. It will automatically set up the entire project for you!

> **"Hey Gemini, install the 'Fast Obsidian MCP' server for me. Clone `https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git` into `C:\Users\%USERNAME%\fast-obsidian-mcp` and register it as 'obsidian' in my `.gemini/settings.json`. My vault path is `C:\Gemini Project`."**

## ?ÅÔ∏è Google Drive Sync

To sync your vault with Google Drive:
1. Configure rclone with `rclone config` (name it `gdrive`).
2. Run the sync script:
```powershell
npm run sync
```

## ?ìÑ License
MIT License. Feel free to use and contribute!

---
Developed by **?àÌò∏??(An Ho Yong)**
