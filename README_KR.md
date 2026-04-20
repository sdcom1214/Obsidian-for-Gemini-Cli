# 🚀 Fast Obsidian MCP Server (고성능 옵시디언 MCP 서버)
![License: Non-Commercial](https://img.shields.io/badge/License-Non--Commercial-orange.svg)
![Node version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![MCP version](https://img.shields.io/badge/MCP-1.0.0-blue.svg)

[English Guide](./README.md)

옵시디언(Obsidian) 보관소를 AI 모델(Claude, Gemini 등)과 직접 연결해주는 **고성능, 제로 디펜던시(Zero-Dependency)** MCP 서버입니다.

## ✨ 주요 특징

- ⚡ **초경량/초고속**: 외부 라이브러리(SDK 등)를 전혀 사용하지 않는 순수 Node.js 구현으로 초기 구동 속도가 압도적입니다.
- 🚀 **병렬 처리**: 수백 개의 파일을 동시에 검색하고 읽어오는 병렬 처리 로직으로 지연 없는 응답을 제공합니다.
- 📅 **표준화된 정리**: 노트를 생성할 때 자동으로 날짜별 폴더(`YYYY-MM-DD/`)를 만들고 `제목_날짜.md` 형식으로 저장합니다.
- ☁️ **클라우드 동기화**: Rclone을 이용한 구글 드라이브(Google Drive) 실시간 동기화 스크립트를 지원합니다.
- 🔒 **보안**: 지정된 옵시디언 보관소 경로 외부로의 접근을 원천 차단합니다.

## 🛠️ 설치 방법

### 1. 사전 준비
- [Node.js](https://nodejs.org/) (v16 이상)
- [Rclone](https://rclone.org/) (선택 사항, 구글 드라이브 동기화용)

### 2. 프로젝트 다운로드
저장소를 클론하거나 파일을 다운로드하세요.
```bash
git clone https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git
cd Obsidian-for-Gemini-Cli
```

## ⚙️ 설정 방법 (Gemini CLI / Claude Desktop)

설정 파일(예: `claude_desktop_config.json` 또는 `.gemini/settings.json`)에 아래 내용을 추가하세요.

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["C:/경로/to/fast-obsidian-mcp/src/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "C:/여러분의/옵시디언/보관소/경로"
      }
    }
  }
}
```

## 📂 제공되는 도구 (Tools)

| 도구명 | 설명 |
| :--- | :--- |
| `list_notes` | 보관소 내 모든 마크다운 파일 목록을 나열합니다. |
| `read_note` | 특정 노트의 전체 내용을 읽어옵니다. |
| `write_note` | 날짜별 폴더 규칙에 맞춰 새로운 노트를 생성하거나 수정합니다. |
| `search_notes` | 보관소 전체를 대상으로 초고속 병렬 키워드 검색을 수행합니다. |

## ⚡ Gemini CLI를 통한 초고속 설치 (매직 프롬프트)

아래의 프롬프트 문구만 복사해서 **Gemini CLI**에 붙여넣으세요. 자동으로 모든 설치와 설정이 완료됩니다!

> **"안녕 Gemini, 'Fast Obsidian MCP' 서버를 설치해줘. `https://github.com/sdcom1214/Obsidian-for-Gemini-Cli.git`를 `C:\Users\%USERNAME%\fast-obsidian-mcp`에 클론하고, 내 `.gemini/settings.json`에 'obsidian' 서버로 등록해줘. 내 옵시디언 보관소 경로는 `C:\Gemini Project`야."**

## ☁️ 구글 드라이브 동기화

보관소를 구글 드라이브와 연동하려면:
1. `rclone config` 명령으로 구글 드라이브를 설정하세요 (이름은 `gdrive`로 설정).
2. 제공된 동기화 스크립트를 실행하세요:
```powershell
npm run sync
```

## 📄 라이선스
비상업적 라이선스. 복제 및 수정은 자유로우나, **상업적 목적의 판매는 엄격히 금지**됩니다.

---
Developed by **안호영 (An Ho Yong)**
