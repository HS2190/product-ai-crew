# Product AI Crew

Claude Code 기반 AI 멀티 에이전트 제품 조직.
Researcher, PM, 서비스 기획자, UI/UX 디자이너, UX 라이터, Engineer 6개 롤을 독립 에이전트로 구성하고,
오케스트레이터가 요청을 분석해 적합한 에이전트를 자동으로 순차 호출한다.
각 단계 산출물은 Reviewer가 내용 품질을 검수한다(존재 검증 → 내용 비평 2단계 게이트).
범위는 리서치부터 동작하는 **프론트엔드 구현**까지다(백엔드·DB·API는 범위 밖, 데이터는 mock/정적).

---

## 에이전트 구성

| 에이전트 | 역할 | 파일 |
|---------|------|------|
| 오케스트레이터 | 요청 분석 → 모드 판단 → 에이전트 순차 호출 | `CLAUDE.md` |
| Researcher | 리서치 수집·종합, 경쟁 분석, insights 도출 | `agents/researcher/CLAUDE.md` |
| PM | 제품 전략 수립, PRD 작성, 기능 우선순위 결정 | `agents/pm/CLAUDE.md` |
| 서비스 기획자 | 화면 기획, 기능 명세서, User Flow 설계 | `agents/planner/CLAUDE.md` |
| UI/UX 디자이너 | 화면 디자인, 컴포넌트 스펙, 디자인 시스템 | `agents/designer/CLAUDE.md` |
| UX 라이터 | UX 문구 작성, 라이팅 가이드, 금지 표현 관리 | `agents/ux-writer/CLAUDE.md` |
| Engineer | 프론트엔드 구현, 빌드 검증 (최종 산출물) | `agents/engineer/CLAUDE.md` |
| Reviewer | 각 단계 산출물의 내용 품질 비평 (pass/revise/escalate) | `agents/reviewer/CLAUDE.md` |

---

## 폴더 구조

```text
product-ai-crew/
├── CLAUDE.md              ← 오케스트레이터 (진입점)
├── README.md
├── install.sh             ← 로컬 설치 스크립트
│
├── agents/                ← 에이전트 롤 정의
│   ├── researcher/CLAUDE.md
│   ├── pm/CLAUDE.md
│   ├── planner/CLAUDE.md
│   ├── designer/CLAUDE.md
│   ├── ux-writer/CLAUDE.md
│   ├── engineer/CLAUDE.md
│   └── reviewer/CLAUDE.md
│
├── workflows/             ← 워크플로우 정의
│   ├── research-process.md ← RESEARCH 모드
│   ├── full-process.md    ← FULL 모드
│   ├── plan-process.md    ← PLAN 모드
│   ├── quick-design.md    ← DESIGN 모드
│   ├── build-process.md   ← BUILD 모드
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
git clone https://github.com/HS2190/product-ai-crew.git
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
   - `agents/researcher/CLAUDE.md`
   - `agents/pm/CLAUDE.md`
   - `agents/planner/CLAUDE.md`
   - `agents/designer/CLAUDE.md`
   - `agents/ux-writer/CLAUDE.md`
   - `agents/engineer/CLAUDE.md`
   - `agents/reviewer/CLAUDE.md`
   - `workflows/research-process.md`
   - `workflows/full-process.md`
   - `workflows/plan-process.md`
   - `workflows/quick-design.md`
   - `workflows/build-process.md`
   - `workflows/ux-writing.md`
   - `workflows/custom-flow.md`

---

## 실행 모드

| 모드 | 사용 상황 | 에이전트 순서 |
|------|---------|-------------|
| **FULL** | 신규 서비스/기능 전체 (구현까지) | Researcher → PM → 기획자 → 디자이너 → UX라이터 → Engineer |
| **PLAN** | 리서치·기획서까지 | Researcher → PM → 기획자 |
| **RESEARCH** | 리서치·경쟁사 분석만 | Researcher 단독 |
| **DESIGN** | 기획안 있고 디자인만 | 기획자 → 디자이너 |
| **BUILD** | 디자인 스펙·문구 있고 구현만 | Engineer 단독 (또는 디자이너 → Engineer) |
| **WRITE** | 문구 작업만 | UX라이터 단독 |
| **CUSTOM** | 직접 조합 | 사용자 정의 |

### 호출 예시

```
"[서비스명] [기능명] 전체 프로세스 진행해줘"
"리서치랑 경쟁사 분석만 해줘"
"PRD랑 화면 기획서까지만 만들어줘"
"기획안 있어, 디자인만 해줘"
"디자인 스펙 있어, 코드로 구현만 해줘"
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
    ├── researcher/ ← 리서치 종합, 경쟁 분석, insights
    ├── pm/         ← PRD, 로드맵, 우선순위
    ├── planner/    ← 화면 기획안, 기능 명세서, User Flow
    ├── designer/   ← 디자인 스펙, 컴포넌트 스펙
    ├── ux-writer/  ← 라이팅 가이드, 문구 시트
    ├── engineer/   ← 동작하는 프론트엔드 코드, 빌드 결과
    └── session.md  ← 작업 세션 체크포인트 (오케스트레이터 자동 관리)
```
