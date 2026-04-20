# One-Click Auto Install Prompts (Codex and Gemini)

Use these prompts as-is.
Flow: clone repo -> ask user for Obsidian vault path -> register env/config -> verify.

## 1) Codex One-Click Prompt
```text
Set up fast-obsidian-mcp for me as a one-click install.

Requirements:
1. Clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git into:
   C:\Users\%USERNAME%\fast-obsidian-mcp
2. Ask me for my Obsidian vault path before config.
3. Save the path to MCP env as OBSIDIAN_VAULT_PATH.
4. Register MCP server "obsidian" in:
   C:\Users\%USERNAME%\.codex\config.toml
5. Use:
   - command: node
   - args: C:\Users\%USERNAME%\fast-obsidian-mcp\src\index.js
6. Validate by checking initialize and list_notes readiness.
7. Print final summary with:
   - repo path
   - vault path
   - config file path
   - whether restart is needed
```

## 2) Gemini One-Click Prompt
```text
Install fast-obsidian-mcp for me in one click.

Requirements:
1. Clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git into:
   C:\Users\%USERNAME%\fast-obsidian-mcp
2. Ask me for my Obsidian vault path before writing settings.
3. Add MCP server "obsidian" to:
   %USERPROFILE%\.gemini\settings.json
4. Use:
   - command: node
   - args: C:/Users/%USERNAME%/fast-obsidian-mcp/src/index.js
   - env.OBSIDIAN_VAULT_PATH: (the path I provide)
5. Validate by checking list_notes readiness.
6. Print final summary with:
   - repo path
   - vault path
   - settings file path
   - whether restart is needed
```

## 3) Korean Version (Codex)
```text
fast-obsidian-mcp를 원클릭으로 설치해줘.

요구사항:
1. 저장소를 C:\Users\%USERNAME%\fast-obsidian-mcp 에 git clone.
2. 설정 전에 내 Obsidian Vault 경로를 먼저 물어봐.
3. 받은 경로를 OBSIDIAN_VAULT_PATH 환경변수로 등록.
4. C:\Users\%USERNAME%\.codex\config.toml 에 obsidian MCP 서버 등록.
5. 실행값:
   - command: node
   - args: C:\Users\%USERNAME%\fast-obsidian-mcp\src\index.js
6. initialize/list_notes 가능 상태인지 확인.
7. 마지막에 repo 경로, vault 경로, 설정 파일, 재시작 필요 여부를 요약해서 알려줘.
```

