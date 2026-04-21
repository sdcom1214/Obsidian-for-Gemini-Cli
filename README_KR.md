# 🚀 Fast Obsidian MCP Server (v1.4.0)
![License: Non-Commercial](https://img.shields.io/badge/License-Non--Commercial-orange.svg)
![Node version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![MCP version](https://img.shields.io/badge/MCP-1.4.0-blue.svg)

[English Guide](./README.md)

옵시디언(Obsidian) 보관소를 AI 모델(Claude, Gemini 등)과 직접 연결해주는 **고성능, 제로 디펜던시(Zero-Dependency)** MCP 서버입니다. 이제 AI가 직접 당신의 지식을 정리하고 새로운 주제를 추천합니다.

## ✨ v1.4.0 신규 기능

- 🤖 **AI 추천 엔진 (`get_recommendations`)**: 현재 보관소의 지식을 분석하여 다음에 작성할 주제와 연결할 링크를 AI가 제안합니다.
- 📅 **날짜별 자동 정리 (`organize_notes_by_date`)**: 루트에 쌓인 노트를 수정 날짜에 맞춰 폴더별(`YYYY-MM-DD/`)로 자동 분류합니다. (덮어쓰기 방지 로직 포함)
- 📝 **정밀한 노트 업데이트 (`update_note`)**: 날짜 규칙에 상관없이 특정 경로의 파일을 직접 생성하거나 수정할 수 있습니다.
- 🌐 **마스터 위키 (`Wiki.md`)**: 보관소의 전체 흐름을 한눈에 파악할 수 있는 자동화 대시보드를 지원합니다.

## 🛠️ 설치 방법

### 1. 사전 준비
- [Node.js](https://nodejs.org/) (v16 이상)

### 2. 프로젝트 다운로드
```bash
git clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git
cd Obsidian-for-Gemini-Cli
```

## ⚙️ 설정 방법

`Gemini CLI` 또는 `Codex` 설정 파일에 아래 내용을 추가하세요:

**Gemini (`settings.json`)**
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["C:/경로/to/fast-obsidian-mcp/src/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "C:/여러분의/보관소/경로"
      }
    }
  }
}
```

## 📂 제공되는 도구 (v1.4.0)

| 도구명 | 설명 | 입력 인자 |
| :--- | :--- | :--- |
| `list_notes` | 보관소 내 모든 마크다운 파일 목록을 보여줍니다. | 없음 |
| `read_note` | 특정 경로의 노트 내용을 읽어옵니다. | `path` |
| `update_note` | **(NEW)** 특정 경로에 노트를 생성하거나 수정합니다. | `path`, `content` |
| `organize_notes_by_date` | **(NEW)** 루트의 노트를 날짜별 폴더로 안전하게 자동 정리합니다. | 없음 |
| `get_recommendations` | **(NEW)** 보관소 내용을 분석하여 새로운 주제와 링크를 추천합니다. | 없음 |
| `write_note` | `제목_날짜.md` 형식으로 새 노트를 생성합니다. | `title`, `content` |
| `search_notes` | 보관소 전체를 대상으로 초고속 키워드 검색을 수행합니다. | `query` |
| `web_search` | 실시간 웹 정보를 검색합니다. | `query` |
| `web_clip` | URL에서 본문을 추출하여 정리합니다. | `url` |
| `smart_link` | 내용 유사도를 분석하여 연관 노트를 추천합니다. | `text` |
| `list_assets` | 이미지, PDF 등 비마크다운 파일 목록을 보여줍니다. | 없음 |

## 🔒 보안 및 안정성
- **접근 제어**: `OBSIDIAN_VAULT_PATH` 외부의 파일 접근을 엄격히 차단합니다.
- **데이터 보호**: 파일 이동/수정 시 동일한 파일명이 존재할 경우 타임스탬프를 추가하여 덮어쓰기를 방지합니다.
- **예외 처리**: 개별 파일의 오류가 전체 MCP 동작에 영향을 주지 않도록 설계되었습니다.

## 📄 라이선스
비상업적 라이선스. **상업적 목적의 판매 및 재배포는 엄격히 금지**됩니다.

---
Developed by **안호영 (An Ho Yong)**
