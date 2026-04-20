# 🚀 Fast Obsidian MCP Server (고성능 옵시디언 MCP 서버)
![License: Non-Commercial](https://img.shields.io/badge/License-Non--Commercial-orange.svg)
![Node version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![MCP version](https://img.shields.io/badge/MCP-1.2.0-blue.svg)

[English Guide](./README.md)

옵시디언(Obsidian) 보관소를 AI 모델(Claude, Gemini 등)과 직접 연결해주는 **고성능, 제로 디펜던시(Zero-Dependency)** MCP 서버입니다.

## ✨ 주요 특징

- ⚡ **초경량/초고속**: 외부 라이브러리를 전혀 사용하지 않는 순수 Node.js 구현.
- 🚀 **병렬 처리**: 수백 개의 파일을 동시에 처리하여 즉각적인 응답 제공.
- 📅 **표준화된 정리**: 자동으로 날짜별 폴더(`YYYY-MM-DD/`)에 메모를 정리.
- 🌐 **웹 검색 및 클립**: 웹 정보를 검색하고 내용을 즉시 보관소로 추출.
- 🔒 **보안**: 지정된 경로 외부로의 접근을 엄격히 차단.

## 🛠️ 설치 방법

### 1. 사전 준비
- [Node.js](https://nodejs.org/) (v16 이상)
- [Rclone](https://rclone.org/) (선택 사항, 클라우드 동기화용)

### 2. 프로젝트 다운로드
```bash
git clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git
cd Obsidian-for-Gemini-Cli
```

## ⚙️ 설정 방법

설정 파일에 아래 내용을 추가하세요:
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

## 📂 제공되는 도구 (v1.2.0)

| 도구명 | 설명 | 입력 인자 |
| :--- | :--- | :--- |
| `list_notes` | 보관소 내 모든 마크다운 파일 목록을 보여줍니다. | 없음 |
| `read_note` | 특정 노트의 전체 내용을 읽어옵니다. | `path` |
| `write_note` | 날짜별 폴더 규칙에 맞춰 노트를 생성/수정합니다. | `title`, `content` |
| `search_notes` | 보관소 전체를 대상으로 초고속 키워드 검색을 수행합니다. | `query` |
| `web_search` | 웹 정보를 검색합니다 (DuckDuckGo 기반). | `query` |
| `web_clip` | URL에서 본문 내용을 추출하여 정리합니다. | `url` |
| `smart_link` | 내용 유사도를 분석하여 연관 노트(`[[링크]]`)를 추천합니다. | `text` |
| `list_assets` | 이미지, PDF 등 비마크다운 파일 목록을 보여줍니다. | 없음 |

## ⚡ Gemini CLI를 통한 초고속 설치 (매직 프롬프트)

> **"안녕 Gemini, 'Fast Obsidian MCP' 서버를 설치해줘. `https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git`를 `C:\Users\%USERNAME%\fast-obsidian-mcp`에 클론하고, 내 `.gemini/settings.json`에 'obsidian' 서버로 등록해줘. 내 옵시디언 보관소 경로는 `C:\Gemini Project`야."**

## 📄 라이선스
비상업적 라이선스. **상업적 목적의 판매는 엄격히 금지**됩니다.

---
Developed by **안호영 (An Ho Yong)**
