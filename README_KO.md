# 🚀 Fast Obsidian MCP Server (v1.4.0)
![License: Non-Commercial](https://img.shields.io/badge/License-Non--Commercial-orange.svg)
![Node version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![MCP version](https://img.shields.io/badge/MCP-1.4.0-blue.svg)

[English Guide](./README.md) | [Korean Guide](./README_KO.md)

옵시디언(Obsidian) 보관소를 AI 모델(Claude, Gemini 등)과 직접 연결해주는 **고성능, 제로 디펜던시(Zero-Dependency)** MCP 서버입니다. 이제 AI가 당신의 지식을 스스로 정리하고, 새로운 통찰을 제안하는 똑똑한 보관소를 경험하세요.

## ✨ v1.4.0 핵심 기능

- 🤖 **AI 추천 엔진 (`get_recommendations`)**
  - 현재 보관소의 지식을 분석하여 다음에 작성할 주제와 누락된 연결 링크를 AI가 지능적으로 제안합니다.
- 📅 **안전한 날짜별 자동 정리 (`organize_notes_by_date`)**
  - 루트에 쌓인 메모를 수정 날짜 기준 폴더(`YYYY-MM-DD/`)로 자동 분류합니다.
  - **데이터 보호**: 동일한 파일명이 존재할 경우 타임스탬프를 추가하여 덮어쓰기를 원천 차단합니다.
- 📝 **정밀한 노트 업데이트 (`update_note`)**
  - 날짜 규칙에 얽매이지 않고 특정 경로의 파일을 직접 생성하거나 수정할 수 있는 정교한 제어 기능을 제공합니다.
- 🌐 **마스터 위키 대시보드 (`Wiki.md`)**
  - 보관소의 전체 구조와 주요 지표를 한눈에 파악할 수 있는 자동화된 위키 생성을 지원합니다.

## 🛠️ 설치 및 설정

### 1. 사전 준비
- [Node.js](https://nodejs.org/) (v16 이상 권장)

### 2. 프로젝트 설치
```bash
git clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git
cd Obsidian-for-Gemini-Cli
```

### 3. MCP 설정 추가
사용하시는 도구(Gemini CLI, Codex 등)의 설정 파일에 아래 내용을 추가하세요.

**Gemini CLI (`settings.json`)**
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["C:/경로/to/Obsidian-for-Gemini-Cli/src/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "C:/여러분의/보관소/경로"
      }
    }
  }
}
```

## 📂 제공되는 도구 (v1.4.0)

| 도구명 | 설명 | 주요 인자 |
| :--- | :--- | :--- |
| `list_notes` | 보관소 내 모든 마크다운 파일 목록 조회 | 없음 |
| `read_note` | 특정 경로의 노트 내용 읽기 | `path` |
| `update_note` | **(NEW)** 특정 경로에 노트 생성/수정 | `path`, `content` |
| `organize_notes_by_date` | **(NEW)** 루트 노트를 날짜별 폴더로 안전하게 정리 | 없음 |
| `get_recommendations` | **(NEW)** AI 기반 주제 및 링크 추천 | 없음 |
| `write_note` | `제목_날짜.md` 형식으로 새 노트 생성 | `title`, `content` |
| `search_notes` | 보관소 전체 초고속 키워드 검색 | `query` |
| `web_search` | 실시간 웹 검색 (DuckDuckGo 기반) | `query` |
| `web_clip` | URL 본문 추출 및 마크다운 변환 도움 | `url` |
| `smart_link` | 내용 유사도 분석 및 연관 노트 추천 | `text` |
| `list_assets` | 이미지, PDF 등 비마크다운 파일 목록 조회 | 없음 |

## 🔒 보안 및 신뢰성
- **엄격한 경로 제어**: `OBSIDIAN_VAULT_PATH`를 벗어난 임의의 파일 접근을 원천 차단합니다.
- **안전한 파일 이동**: 중복 파일 발생 시 자동 이름 변경 로직을 통해 소중한 데이터를 보호합니다.
- **무중단 운영**: 개별 파일 처리 중 오류가 발생해도 전체 서버는 중단 없이 안정적으로 동작합니다.

## 📄 라이선스
비상업적 라이선스 (Non-Commercial). **상업적 목적의 판매 및 재배포는 엄격히 금지**됩니다.

---
Developed by **안호영 (An Ho Yong)**