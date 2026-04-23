## 폴더 구조

```
project/
├── SETUP.md                       ← 이 파일 (전체 구조 안내)
├── _roles/                        ← 역할 설정 (공통, 모든 프로젝트에서 재사용)
│   ├── planner/
│   │   └── CLAUDE.md              ← 기획자 역할 설정
│   ├── designer/
│   │   └── CLAUDE.md              ← 디자이너 역할 설정
│   └── ux-writer/
│       └── CLAUDE.md              ← UX 라이터 역할 설정
│
└── {프로젝트명}/                   ← 프로젝트별 폴더
    ├── persona.md                 ← 프로젝트 페르소나 (전 역할 공통 참고)
    ├── planner/                   ← 기획 산출물
    │   ├── screen-spec.md
    │   ├── feature-spec.md
    │   └── flow.md
    ├── designer/                  ← 디자인 산출물
    └── ux-writer/                 ← UX 라이팅 산출물
```

---

## 서비스 공통 컨텍스트

- **서비스명**: 위페어 파트너스
- **서비스 유형**: 1급/2급 사고차량 수리 공업사를 위한 B2B SaaS 앱
- **핵심 기능**: 작업 사진 촬영·등록, 고객 결제 비용 전송, 개인정보 동의 수취
- **결과물 형식**: 전 역할 Confluence 마크다운 통일
- **협업 구조**: 기획자 → 디자이너 → UX 라이터 → 개발자 순으로 핸드오프

---

## 역할별 담당 업무

| 역할 | 폴더 | 주요 업무 | 산출물 |
|---|---|---|---|
| 서비스·화면 기획자 | `_roles/planner/` | 서비스 플로우 설계, 화면 정의서, IA 설계, 요구사항 정리 | screen-spec.md, feature-spec.md, flow.md |
| 프로덕트 디자이너 | `_roles/designer/` | 피그마 화면 분석, 디자인 시스템 문서화, 컴포넌트 스펙, 디자인 QA | design-spec.md, component-spec.md |
| UX 라이터 | `_roles/ux-writer/` | UI 문구 추출·분류, 문구 품질 검토, 개선 문구 제안 | [화면명]-ux-writing.md |

---



---
