# Prompt Pack (Codex and Gemini)

Use these copy-paste prompts to automate installation and verification.

## 1) Gemini install prompt
```text
Install Fast Obsidian MCP for me.

1. Clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git
   into C:\Users\%USERNAME%\fast-obsidian-mcp.
2. Add an "obsidian" server entry in %USERPROFILE%\.gemini\settings.json under mcpServers.
3. Set command to "node".
4. Set args to C:/Users/%USERNAME%/fast-obsidian-mcp/src/index.js.
5. Set env.OBSIDIAN_VAULT_PATH to C:/Gemini Project.
6. Verify that list_notes can run.
```

## 2) Codex install prompt
```text
Connect fast-obsidian-mcp as an MCP server in Codex.

Requirements:
- Repo path: C:\Users\%USERNAME%\fast-obsidian-mcp
- Vault path: C:\Gemini Project

Tasks:
1. Add an obsidian MCP server entry to C:\Users\%USERNAME%\.codex\config.toml.
2. Set command to node.
3. Set args to C:\Users\%USERNAME%\fast-obsidian-mcp\src\index.js.
4. Set env OBSIDIAN_VAULT_PATH to C:\Gemini Project.
5. Tell me if Codex restart is required.
6. Create one test note in the vault for validation.
```

## 3) Shared health-check prompt
```text
Check the Obsidian MCP connection end-to-end.

Checklist:
1. Confirm node is executable.
2. Confirm the obsidian entry exists in MCP config.
3. Validate OBSIDIAN_VAULT_PATH.
4. Run tests in order: list_notes, read_note, write_note, search_notes.
5. If any step fails, provide root cause and exact fix commands.
```
