# Product AI Crew

Claude Code 위에서 동작하는 AI 멀티 에이전트 제품팀.
Researcher · PM · 기획자 · UX 라이터 · 디자이너 · Engineer · QA 7개 역할을 독립 에이전트로 두고, 오케스트레이터가 요청을 분석해 필요한 에이전트를 차례로 호출한다.
각 단계 산출물은 Reviewer가 검수한다(존재 검증 → 내용 비평 2단계 게이트). 검수는 만든 모델과 다른 모델(Codex)이 맡는다.
범위는 리서치부터 동작하는 **프론트엔드 구현 · 검증(QA)**까지다(백엔드 · DB · API는 범위 밖, 데이터는 mock/정적).

---

## 에이전트 구성

| 에이전트 | 역할 | 파일 |
|---------|------|------|
| 오케스트레이터 | 요청 분석 → 모드 판단 → 에이전트 순차 호출 · 세션 · 기억층 관리 | `CLAUDE.md` |
| Researcher | 리서치 수집 · 종합, 경쟁 분석, insights 도출 | `agents/researcher/CLAUDE.md` |
| PM | 제품 전략, PRD, 기능 우선순위 | `agents/pm/CLAUDE.md` |
| 기획자 | 화면 기획(목록 · 구성 · 흐름), 기능 명세(상태 · 예외 · 설정값), 확인 필요 모음 | `agents/planner/CLAUDE.md` |
| UX 라이터 | 화면 문구를 디자인 전에 확정, 라이팅 가이드, 금지 표현 관리 | `agents/ux-writer/CLAUDE.md` |
| 디자이너 | 디자인 시스템 위에서 화면 디자인(문구 시트 문구로), 컴포넌트 스펙 | `agents/designer/CLAUDE.md` |
| Engineer | 프론트엔드 구현, 빌드 검증 | `agents/engineer/CLAUDE.md` |
| QA | 구현 화면을 실제로 써 보며 검증, 테스트 케이스 · 버그 리포트 (FULL 마지막) | `agents/qa/CLAUDE.md` |
| Reviewer | 각 단계 산출물 비평 (pass / revise / rollback / escalate) | `agents/reviewer/CLAUDE.md` |

---

## 실행 모드

| 모드 | 사용 상황 | 에이전트 순서 |
|------|---------|-------------|
| **FULL** | 신규 서비스 · 기능 전체 (구현 · 검증까지) | Researcher → PM → 기획자 → UX라이터 → 디자이너 → (가상 사용자 점검) → Engineer → QA |
| **PLAN** | 리서치 · 기획서까지 | Researcher → PM → 기획자 |
| **RESEARCH** | 리서치 · 경쟁사 분석만 | Researcher 단독 |
| **DESIGN** | 기획안 있고 디자인만 | 기획자 → 디자이너 |
| **BUILD** | 디자인 스펙 · 문구 있고 구현만 | Engineer 단독 (또는 디자이너 → Engineer) |
| **WRITE** | 문구 작업만 | UX라이터 단독 |
| **CUSTOM** | 직접 조합 | 사용자 정의 |

### 호출 예시

```
"팀 일정 조율 서비스, 전체 프로세스 진행해줘"
"예약 화면 기획안 있어, 디자인만 해줘"
"설정 화면 디자인 스펙 있어, 코드로 구현만 해줘"
"회원가입 플로우 UX 문구 전체 검토해줘"
```

---

## 설치

```bash
git clone https://github.com/HS2190/product-ai-crew.git
cd product-ai-crew
chmod +x install.sh && ./install.sh
claude
```

`install.sh`는 `skills/`를 `~/.claude/skills`에, `plugins/`를 `~/.claude/plugins`에 심링크로 연결한다. 이미 있는 스킬은 덮어쓰지 않는다.

### 설정 (`crew.config.md`)

설치마다 다른 값은 이 파일 하나에만 둔다. 에이전트 · 워크플로우 문서는 고치지 않는다.

| 키 | 기본값 | 뜻 |
|----|-------|----|
| `projects_root` | `workspace` | 작업물 위치. 별도 레포에 두려면 그 경로(예: `../my-design-docs/projects`) |
| `default_company` | 비어 있음 | 기억층 회사. 비어 있으면 작업 시작 때 한 번 묻는다 |
| `reviewer` | `codex` | 검수 모델. Codex가 없으면 Claude가 대신하고 '같은 모델 검수'로 표시 |

회사 전용 규칙(톤 · 고정 디자인 시스템 · 핸드오프 규칙)은 `workspace/_memory/companies/[회사명]/conventions.md`에, 프로젝트마다 다른 디자인 시스템은 그 프로젝트 `session.md`의 `design_system:`에 적는다.

### 함께 쓰면 좋은 것 (선택)

| 도구 | 쓰는 곳 | 없으면 |
|------|--------|-------|
| [Codex CLI](https://github.com/openai/codex) (`codex login`) | Reviewer 검수를 다른 모델에 맡김 | Claude가 직접 검수하고 결과에 "같은 모델 검수"라고 표시 |
| `user-voice-sim` 스킬 (`~/.claude/skills/user-voice-sim`) | FULL의 가상 사용자 점검 | 그 단계를 건너뛰고 사유만 보고 |
| Figma MCP | 디자이너 단계의 Figma 작화 | 마크다운 스펙만 산출 |
| Playwright | QA의 화면 실행 테스트 | 실행 못 한 항목을 `not_run`으로 보고 |

외부 스킬 일부는 라이선스 문제로 이 레포에 넣지 않았다. 출처와 설치 방법은 [THIRD_PARTY.md](THIRD_PARTY.md)에 있다. 설치하면 스킬 인덱스에 자동으로 잡힌다.

---

## 빠른 명령 (어느 폴더에서나)

`install.sh`가 스킬로 연결해 두므로 크루 폴더 밖에서도 쓸 수 있다.

| 명령 | 하는 일 |
|------|--------|
| `/crew [요청]` | 크루 오케스트레이터로 작업 시작 · 이어 하기 (요청이 없으면 상태판부터) |
| `/crew-status` | 끝나지 않은 세션 상태판 (모드 · 다음 단계 · 기다리는 것) |
| `/crew-review [파일]` | 파일 하나를 크루 검수 기준으로 Codex에게 따로 검수 (크루 밖에서 쓴 문서도 가능) |

---

## 잘 쓰는 법

- **맥락을 구체적으로 준다.** "기능 만들어줘"보다 "현장 작업자가 스마트폰으로 사진을 찍어 등록하는 기능, 한 손 조작 · 큰 버튼 · 최소 입력"이 결과가 훨씬 낫다.
- **가진 리서치 자료를 넘긴다.** 인터뷰 전사 · 설문 · 지원 티켓이 있으면 Researcher가 추측 대신 사실에서 시작한다.
- **필요한 단계만 부른다.** 한 번에 FULL보다 PLAN → (검토) → DESIGN → BUILD처럼 나눠 부르면 단계마다 방향을 잡기 쉽다. 검수만 따로 돌리고 싶으면 `scripts/review.py`를 바로 써도 된다.
- **의존하는 단계는 순서대로.** 기획 → 문구 → 디자인처럼 앞 결과를 쓰는 단계는 병렬로 돌리지 않는다.
- **멈추면 이유를 본다.** `blocked` · `needs_input` · `escalate`는 사람 판단이 필요하다는 뜻이다. 답을 주면 그 단계부터 이어 간다.
- **대화가 끊겨도 된다.** 진행 상태는 `session.md`에 남아 있어 같은 작업을 다시 부르면 멈춘 곳부터 이어 간다.

---

## 내 디자인 시스템 붙이기

회사(팀)마다 고정 디자인 시스템을 붙일 수 있다. 붙이면 디자이너 단계가 스킬 고르기 없이 그 시스템을 바로 적용하고, 없으면 기획 결과를 보고 디자인 스킬을 추천한 뒤 사용자가 고를 때까지 기다린다.

1. 디자인 시스템을 스킬로 만든다: `skills/[회사-DS]/SKILL.md` (토큰 · 컴포넌트 · 레이아웃 규칙, 코드 토큰 파일이 있으면 `references/tokens.css`)
2. `workspace/_memory/companies/_template/`을 복사해 `companies/[회사명]/`을 만든다.
3. `conventions.md`의 「고정 디자인 시스템」에 스킬 경로 · Figma 라이브러리 · 핸드오프 주석 규칙을 적는다.
4. 작업을 시작할 때 회사명을 알려 주면(또는 오케스트레이터가 물으면) 그 회사의 규칙 · 결정이 모든 에이전트에 자동으로 들어간다.

---

## 기억층

프로젝트를 넘어 쌓이는 판단과 선호를 `workspace/_memory/`에 둔다.

| 층 | 경로 | 담는 것 |
|----|------|--------|
| 개인 | `designer-profile.md` | 회사가 바뀌어도 유지되는 작업 취향 · 원칙 (첫 개인 선호 승인 시 생성) |
| 회사 | `companies/[회사명]/decisions.md` | 그 회사에서 내린 판단과 근거 |
| 회사 | `companies/[회사명]/conventions.md` | 톤 · 디자인 규칙 · 기술 제약 · 고정 디자인 시스템 |

작업을 시작하면 자동으로 모든 에이전트에 주입되고, 새 항목은 오케스트레이터가 제안하고 사용자가 승인한 것만 저장된다. 자세한 내용은 `workspace/_memory/README.md`.

---

## 폴더 구조

```text
product-ai-crew/
├── CLAUDE.md              ← 오케스트레이터 (진입점)
├── README.md
├── THIRD_PARTY.md         ← 이 레포에 넣지 않은 외부 스킬 출처 · 설치
├── BACKLOG.md             ← 시스템 개선 아이디어
├── install.sh
├── product-ai-crew-instructions.md   ← claude.ai 프로젝트용 합본 (자동 생성)
├── agents/                ← 에이전트 역할 정의
├── .claude/agents/        ← Claude Code 서브에이전트 등록
├── workflows/             ← 모드별 워크플로우
├── skills/                ← 스킬 (INDEX.md = 스킬 인덱스, 세션 시작 시 자동 갱신)
├── plugins/
├── scripts/
│   ├── build-skill-index.py
│   └── build-instructions.py
└── workspace/
    ├── persona-template.md
    ├── _memory/                    ← 프로젝트 간 기억층
    └── [서비스명]/                 ← 작업물 (역할별 폴더 + session.md)
```

작업물은 `workspace/[서비스명]/`에 역할별로 저장된다. 작업물을 커밋하지 않으려면 `.gitignore`의 해당 줄 주석을 푼다.

### Claude.ai 프로젝트로 쓸 때

1. [claude.ai/projects](https://claude.ai/projects)에서 새 프로젝트를 만든다.
2. **Project Instructions**에 `product-ai-crew-instructions.md` 내용을 붙여 넣는다.
3. 디자인 시스템이 있으면 그 명세 문서와 `conventions.md`를 **Project Knowledge**에 올린다.

`product-ai-crew-instructions.md`는 `CLAUDE.md` · `agents/*/CLAUDE.md` · `workflows/*.md`를 합친 파일이다. 원본을 고친 뒤 다시 만든다.

```bash
python3 scripts/build-instructions.py
```
