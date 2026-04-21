# 🚀 Fast Obsidian MCP Server (v1.5.0)
![License: Non-Commercial](https://img.shields.io/badge/License-Non--Commercial-orange.svg)
![Node version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![MCP version](https://img.shields.io/badge/MCP-1.5.0-blue.svg)

[English Guide](./README.md)

옵시디언(Obsidian) 보관소를 AI 모델(Claude, Gemini 등)과 직접 연결해주는 **고성능, 제로 디펜던시(Zero-Dependency)** MCP 서버입니다. 이제 인텔리전스 검색 엔진을 통해 수천 개의 노트 속에서 정확한 지식을 즉시 찾아냅니다.

## ✨ v1.5.0 신규 기능: Intelligence Search

- 🧠 **가중치 기반 검색 (Weighted Scoring)**: 제목 매칭 가점 및 본문 출현 빈도 분석을 통해 가장 관련성 높은 노트를 최상단에 배치합니다.
- 💬 **지능형 문맥 추출 (Contextual Snippets)**: 검색어가 포함된 문장의 앞뒤 문맥을 자동으로 추출하여 검색 결과의 가독성과 AI의 이해도를 극대화했습니다.
- 🤖 **AI 추천 엔진 (`get_recommendations`)**: 보관소의 지식을 분석하여 다음에 작성할 주제와 누락된 링크를 제안합니다.
- 📅 **안전한 날짜별 자동 정리 (`organize_notes_by_date`)**: 루트의 메모를 수정 날짜 기준 폴더로 자동 분류하며, 중복 시 타임스탬프를 추가하여 데이터를 보호합니다.

## 🛠️ 설치 및 설정

### 1. 사전 준비
- [Node.js](https://nodejs.org/) (v16 이상 권장)

### 2. 프로젝트 설치
```bash
git clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git
cd Obsidian-for-Gemini-Cli
```

### 3. MCP 설정 추가
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

## 📂 제공되는 도구 (v1.5.0)

| 도구명 | 설명 | 주요 특징 |
| :--- | :--- | :--- |
| `search_notes` | **(UPGRADED)** 가중치 기반 고성능 지능형 검색 | 검색어 주변 문맥 추출 지원 |
| `get_recommendations` | AI 기반 주제 및 링크 추천 | 보관소 내용 분석 |
| `organize_notes_by_date` | 루트 노트를 날짜별 폴더로 안전하게 정리 | 덮어쓰기 방지 로직 |
| `update_note` | 특정 경로에 노트 생성/수정 | 정밀한 경로 제어 |
| `list_notes` / `read_note` | 파일 목록 조회 및 내용 읽기 | 기본 파일 조작 |
| `web_search` / `web_clip` | 실시간 웹 검색 및 본문 추출 | 외부 지식 통합 |
| `smart_link` | 내용 유사도 분석 및 연관 노트 추천 | 지식 연결 도움 |

## 🔒 보안 및 신뢰성
- **엄격한 경로 제어**: `OBSIDIAN_VAULT_PATH`를 벗어난 임의의 파일 접근을 차단합니다.
- **무중단 운영**: 개별 파일 처리 중 오류가 발생해도 전체 서버는 안정적으로 동작합니다.

## ⚡ Gemini CLI 전용 빠른 설치 (매직 프롬프트)

> **"안녕 Gemini, 'Fast Obsidian MCP' 서버를 설치해줘. `https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git`를 `C:\Users\%USERNAME%\fast-obsidian-mcp`에 클론하고, 내 설정에 'obsidian' 서버로 등록해줘. 내 옵시디언 보관소 경로는 `C:\Gemini Project`야."**

## 📄 라이선스
비상업적 라이선스 (Non-Commercial). **상업적 목적의 판매 및 재배포는 엄격히 금지**됩니다.

---
Developed by **안호영 (An Ho Yong)**
