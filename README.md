# Product AI Crew

Claude Code 기반 AI 멀티 에이전트 제품 조직.
PM, 서비스 기획자, UI/UX 디자이너, UX 라이터 4개 롤을 독립 에이전트로 구성하고,
오케스트레이터가 요청을 분석해 적합한 에이전트를 자동으로 순차 호출한다.

---

## 에이전트 구성

| 에이전트 | 역할 | 파일 |
|---------|------|------|
| 오케스트레이터 | 요청 분석 → 모드 판단 → 에이전트 순차 호출 | `CLAUDE.md` |
| PM | 제품 전략 수립, PRD 작성, 기능 우선순위 결정 | `agents/pm/CLAUDE.md` |
| 서비스 기획자 | 화면 기획, 기능 명세서, User Flow 설계 | `agents/planner/CLAUDE.md` |
| UI/UX 디자이너 | 화면 디자인, 컴포넌트 스펙, 디자인 시스템 | `agents/designer/CLAUDE.md` |
| UX 라이터 | UX 문구 작성, 라이팅 가이드, 금지 표현 관리 | `agents/ux-writer/CLAUDE.md` |

---

## 폴더 구조

```text
product-ai-crew/
├── CLAUDE.md              ← 오케스트레이터 (진입점)
├── README.md
├── install.sh             ← 로컬 설치 스크립트
│
├── agents/                ← 에이전트 롤 정의
│   ├── pm/CLAUDE.md
│   ├── planner/CLAUDE.md
│   ├── designer/CLAUDE.md
│   └── ux-writer/CLAUDE.md
│
├── workflows/             ← 워크플로우 정의
│   ├── full-process.md    ← FULL 모드
│   ├── plan-process.md    ← PLAN 모드
│   ├── quick-design.md    ← DESIGN 모드
│   ├── ux-writing.md      ← WRITE 모드
│   └── custom-flow.md     ← CUSTOM 모드
│
├── skills/                ← Claude Code 스킬
└── plugins/               ← Claude Code 플러그인
    ├── design/
    ├── figma/
    ├── frontend-design/
    └── frontend-design-audit/
```

> `workspace/` 폴더는 서비스별 산출물 저장 경로로 `.gitignore` 처리됩니다.

---

## 설치 방법

### GitHub에서 클론해서 사용

```bash
git clone https://github.com/hs2190-bot/product-ai-crew.git
cd product-ai-crew
chmod +x install.sh && ./install.sh
```

이후 Claude Code에서 이 폴더를 열어 사용한다.

```bash
claude
```

### Claude.ai Project로 사용

1. [claude.ai/projects](https://claude.ai/projects) 에서 새 프로젝트 생성
2. **Project Instructions** 에 `CLAUDE.md` 내용 붙여넣기
3. **Project Knowledge** 에 아래 파일 업로드:
   - `agents/pm/CLAUDE.md`
   - `agents/planner/CLAUDE.md`
   - `agents/designer/CLAUDE.md`
   - `agents/ux-writer/CLAUDE.md`
   - `workflows/full-process.md`
   - `workflows/plan-process.md`
   - `workflows/quick-design.md`
   - `workflows/ux-writing.md`
   - `workflows/custom-flow.md`

---

## 실행 모드

| 모드 | 사용 상황 | 에이전트 순서 |
|------|---------|-------------|
| **FULL** | 신규 서비스/기능 전체 | PM → 기획자 → 디자이너 → UX라이터 |
| **PLAN** | 기획서까지만 | PM → 기획자 |
| **DESIGN** | 기획안 있고 디자인만 | 기획자 → 디자이너 |
| **WRITE** | 문구 작업만 | UX라이터 단독 |
| **CUSTOM** | 직접 조합 | 사용자 정의 |

### 호출 예시

```
"위페어 파트너스 차량 입고 등록 기능 전체 프로세스 진행해줘"
"PRD랑 화면 기획서까지만 만들어줘"
"기획안 있어, 디자인만 해줘"
"로그인 화면 UX 문구 전체 검토해줘"
```

---

## 새로운 롤 추가 방법

1. `agents/[롤명]/CLAUDE.md` 파일 생성
2. `## 실행 모드` 및 `## 오케스트레이터 연동 (CREW 모드)` 섹션 포함
3. `CLAUDE.md`(오케스트레이터) 에이전트 목록 및 파이프라인 흐름 업데이트
4. 필요 시 `workflows/`에 새 워크플로우 파일 추가

---

## 산출물 저장 경로

모든 산출물은 `workspace/[서비스명]/` 하위에 역할별로 저장한다.

```text
workspace/
└── [서비스명]/
    ├── pm/         ← PRD, 로드맵, 우선순위
    ├── planner/    ← 화면 기획안, 기능 명세서, User Flow
    ├── designer/   ← 디자인 스펙, 컴포넌트 스펙
    ├── ux-writer/  ← 라이팅 가이드, 문구 시트
    └── session.md  ← 작업 세션 체크포인트 (오케스트레이터 자동 관리)
```
