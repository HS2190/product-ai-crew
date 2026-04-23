# 프로젝트 역할 구조

## 폴더 구조

```
project/
├── SETUP.md
├── planner/
│   └── CLAUDE.md
├── designer/
│   └── CLAUDE.md
└── ux-writer/
    └── CLAUDE.md
```

## 역할별 담당 업무

| 프로젝트 | 역할 | 주요 업무 | 결과물 형식 |
|---|---|---|---|
| planner/ | 서비스·화면 기획자 | 서비스 플로우 설계, 화면 정의서 작성, IA 설계, 요구사항 정리, 우선순위 제안 | Confluence 마크다운 |
| designer/ | 프로덕트 디자이너 | 피그마 화면 분석, 디자인 시스템 문서화, 컴포넌트 스펙 정의, 디자인 QA 체크리스트 | Confluence 마크다운 |
| ux-writer/ | UX 라이터 | UI 문구 추출·분류, 문구 품질 검토, 개선 문구 제안, 금지 표현 대체 | Confluence 마크다운 |

## 사용 방법

각 작업을 시작할 때 해당 폴더를 VS Code에서 열고 Claude Code를 실행하면
해당 역할의 CLAUDE.md를 자동으로 읽고 역할에 맞게 동작합니다.

```
# 기획 작업 시
cd project/planner && claude

# 디자인 작업 시
cd project/designer && claude

# UX 라이팅 작업 시
cd project/ux-writer && claude
```

## 공통 서비스 컨텍스트

- **서비스 유형**: B2B SaaS
- **주요 사용자**: 기업 고객 (업무용 툴 사용자)
- **결과물 형식**: 전 역할 Confluence 마크다운 통일
- **협업 구조**: 기획자 → 디자이너 → UX 라이터 → 개발자 순으로 핸드오프
