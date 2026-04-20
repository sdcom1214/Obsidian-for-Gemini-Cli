# 📝 Release Notes - v1.0.0

## 🚀 [v1.0.0] - 2026-04-20 (Initial Release)

안호영(An Ho Yong) 개발자의 **Fast Obsidian MCP Server** 첫 번째 정식 버전을 출시합니다.

### ✨ 주요 기능 (Key Features)
- **Zero-Dependency**: 외부 라이브러리 설치 없이 Node.js 표준 라이브러리만으로 구동되는 초경량 구조.
- **초고속 병렬 처리**: `Promise.all`을 이용한 파일 시스템 최적화로 대규모 보관소에서도 즉각적인 응답 속도 제공.
- **날짜 기반 자동 정리**: 노트를 생성할 때 자동으로 `YYYY-MM-DD` 폴더를 생성하고 `제목_날짜.md` 형식으로 저장하는 표준화 기능 탑재.
- **Google Drive 동기화**: Rclone 기반의 클라우드 백업 및 동기화 스크립트(`sync_gdrive.ps1`) 지원.
- **Gemini CLI 매직 프롬프트**: 복사-붙여넣기 한 번으로 설치부터 설정까지 완료되는 자동화 가이드 제공.

### 🔒 보안 및 라이선스 (Security & License)
- **비상업적 라이선스**: 개인적 용도의 복제 및 수정은 자유로우나, **상업적 목적의 판매는 엄격히 금지**됩니다.
- **경로 검증**: AI 모델이 지정된 옵시디언 보관소 경로 외부의 파일에 접근할 수 없도록 철저한 경로 검증 로직 적용.

---

## 🛠️ 설치 및 사용 (Installation)
- 상세한 설치 방법은 [README.md](./README.md) 및 [README_KR.md](./README_KR.md)를 참조하세요.
- Gemini CLI 사용자라면 [INSTALL_VIA_GEMINI.md](./INSTALL_VIA_GEMINI.md)의 프롬프트를 활용하세요.

---
**Developed by 안호영 (An Ho Yong)**
