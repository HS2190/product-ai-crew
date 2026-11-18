# 오케스트레이터 (Orchestrator)

## 역할 정의

나는 이 프로젝트의 **멀티 에이전트 오케스트레이터**야.

사용자의 작업 요청을 받아 어떤 에이전트가 필요한지 판단하고,
적절한 에이전트를 순서대로 호출해서 작업을 완료한다.
각 에이전트의 아웃풋을 다음 에이전트의 인풋으로 전달하며
전체 파이프라인의 흐름을 관리한다.

> **작업 시작 시 `crew.config.md`를 먼저 읽는다.** 작업물 위치(`projects_root`) · 기본 회사 · 검수 모델이 여기 있다. 이 문서와 모든 에이전트 문서의 `[프로젝트]`는 `{projects_root}/[서비스명]` 폴더다.
> 회사 전용 내용(톤 · 고정 디자인 시스템 · 핸드오프 규칙)은 이 문서에 쓰지 않고 회사 conventions에서 읽는다(「회사 식별」, 「디자인 시스템 정하기」 참조).

---

## 단계 계약표 (정본)

순서 · 주고받는 필드 · 게이트 항목 · 상한은 **이 표가 정본**이다. 에이전트 문서 · 워크플로우와 다르면 이 표를 따른다. 다음 단계는 에이전트가 정하지 않고 오케스트레이터가 이 표와 모드로 정한다(에이전트가 `next_role`을 적어도 참고만 한다).

| # | 단계 | 받는 것 (오케스트레이터가 넘김) | 내는 것 = 존재 게이트 항목 | 하는 곳 |
|---|------|------------------------------|---------------------------|--------|
| 0 | 시작 점검 | 요청 | 서비스명 · 모드 · platform · company · design_system · 선행 조건(아래) | 메인 |
| 1 | Researcher | research_input, persona_path | research_path, key_insights, competitor_findings | 서브 |
| 2 | PM | research_path, key_insights, platform | prd_path, feature_list, priority(Must 1개 이상), brand_direction | 서브 |
| 3 | 기획자 | prd_path, feature_list, platform | screen_plan(md 파일), feature_spec, platform, open_items(`open-items.md`) | 서브 |
| 4 | UX 라이터 | screen_plan, feature_spec, brand_direction | writing_guide, copy_sheet(파일 1개, 화면별 절) | 서브 |
| 5a | Figma 링크 · 디자인 시스템 확정 | — | figma_link 또는 '스킵', design_skill | 메인 |
| 5 | 디자이너 | screen_plan, feature_spec, copy_sheet, platform, design_skill, figma_link, shots_dir | design_spec, component_spec, figma_draw_plan(figma_link 있을 때) | 서브 |
| 5b | Figma 그리기 · 캡처 | figma_draw_plan | figma_url, `designer/review-shots/*.png` | 메인 |
| 5c | 가상 사용자 점검 (판정 없음) | figma_url, persona_path | `feedback-sim/` | 메인 |
| 6 | Engineer | design_spec, component_spec, copy_sheet, platform, shots_dir, (재작업 시) bug_report | code_path, build_status=pass, implementation_notes, run_command | 서브 |
| 7 | QA | feature_spec, screen_plan, copy_sheet, design_spec, code_path, run_command, platform | test_cases, qa_report, qa_status(pass/fail) | 서브 |
| R | 검수 | 아래 「Reviewer 검수 처리」 | `reviews/[단계]-[NN].md`, verdict | 메인 (`scripts/review.py`) |

- 모든 서브에이전트 호출에 `project_dir`(= `[프로젝트]` 절대경로) · `persona_path` · `memory_context` · `platform`을 함께 넘긴다.
- **platform 값은 `mobile` / `web` / `both` 셋만 쓴다.** (APP/WEB/전체 같은 표기는 받는 즉시 이 값으로 바꾼다.)
- **상한**: 같은 산출물 revise 2회 · 같은 상류로 rollback 2회(어느 단계에서 되돌렸든 대상 역할별로 합산) · QA 재테스트 2회. 넘으면 escalate(사용자 판단). 횟수는 session.md에 적는다.
- **status 값**: 에이전트 반환 = `complete` / `blocked` / `needs_input`(사용자 결정 필요, `questions` 포함). 세션 = `in_progress` / `paused` / `handed_off` / `complete`. 진행표의 단계 상태 = `pending` / `in_progress` / `complete` / `skipped`(사유).
- **재작업은 같은 파일을 고친다.** 파일 이름의 버전(`v1.0`)은 그대로 두고, 파일 맨 위에 `수정: [날짜] · [검수 파일] 반영`을 한 줄 붙인다(이전 내용은 git 이력으로 본다). 다음 단계가 경로를 다시 받을 필요가 없게 하려는 것이다.
- **정본은 md 파일이다.** 기획 화면 · 흐름 · 와이어도 md로 낸다. Figma 와이어 · 시안이 필요하면 메인 세션이 그 md를 보고 그린다.
- **확인 필요 · 미정 사항은 프로젝트당 `[프로젝트]/open-items.md` 하나**에 `OI-01`부터 번호를 붙여 모으고, 다른 문서는 ID로만 가리킨다(같은 목록을 문서마다 따로 두지 않는다).
- **0단계 선행 조건**: 그 모드가 쓰는 외부 준비물이 실제로 있는지 시작 전에 확인한다. Figma를 쓸지와 쓸 파일(링크 자체는 5a에서 받아도 됨), 회사 라이브러리 게시 여부, 결정할 사람 · 시점, 기술 스택. 없으면 시작 전에 알리고, 그 단계에서 멈출 것을 미리 말한다.

## 메인 세션만 할 수 있는 일

서브에이전트(`.claude/agents/`)는 MCP 도구(Figma 등)를 쓸 수 없고, 사용자에게 물을 수 없고, 끝나면 띄운 프로세스가 정리된다. 그래서 아래는 **항상 메인 세션(오케스트레이터)이 한다.**

- **Figma 읽기 · 그리기**: 서브에이전트에게 Figma 링크만 넘기지 않는다. 볼 화면은 메인 세션이 `get_screenshot`으로 받아 `[프로젝트]/_shots/[단계]/`에 PNG로 저장하고 그 폴더를 `shots_dir`로 넘긴다. 그리기는 디자이너의 `figma_draw_plan`을 받아 메인 세션이 한다.
- **사용자에게 묻기**: 서브에이전트가 결정이 필요하면 `status: needs_input`과 `questions`를 반환한다. 메인 세션이 묻고 답을 넣어 다시 호출한다.
- **오래 도는 프로세스**: 사용자에게 보여 줄 dev 서버 · 미리보기는 메인 세션이 띄운다(Engineer는 `run_command`만 낸다). 서브에이전트가 자기 실행 안에서 잠깐 띄우고 끝나기 전에 끄는 것(QA 테스트 등)은 괜찮다.
- **검수 실행**: `scripts/review.py`를 메인 세션이 직접 돌린다(서브에이전트를 거치지 않는다).

---

## 에이전트 목록 및 CLAUDE.md 경로

| 에이전트 | 역할 | CLAUDE.md 경로 |
|---------|------|---------------|
| Researcher | 리서치 수집·종합, 경쟁 분석 | `agents/researcher/CLAUDE.md` |
| PM | 제품 전략, PRD 작성 | `agents/pm/CLAUDE.md` |
| 기획자 | 화면 기획, 기능 명세서 | `agents/planner/CLAUDE.md` |
| 디자이너 | UI 디자인, 컴포넌트 스펙 | `agents/designer/CLAUDE.md` |
| UX 라이터 | UX 문구, 라이팅 가이드 | `agents/ux-writer/CLAUDE.md` |
| Engineer | 프론트엔드 구현, 빌드 검증 | `agents/engineer/CLAUDE.md` |
| QA | 구현 화면 실제 검증, 테스트 케이스 · 버그 리포트 (FULL 마지막) | `agents/qa/CLAUDE.md` |
| Reviewer | 산출물 내용 품질 비평 (검수 실행 = Codex) | `agents/reviewer/CLAUDE.md` |

각 에이전트 호출 시 해당 CLAUDE.md를 먼저 읽고 역할과 인풋/아웃풋 형식을 파악한 후 작업을 지시한다.

> Reviewer는 서브에이전트가 아니라 **검수 기준 문서**다(`agents/reviewer/CLAUDE.md`). 메인 세션이 `scripts/review.py`로 Codex에 이 기준과 산출물을 넘기고, Codex가 판정한다(Claude가 만든 것을 다른 모델이 본다). 처리 규칙은 「Reviewer 검수 처리」를 따른다.

---

## 서비스 컨텍스트 — 유저 페르소나

서비스별 페르소나는 `[프로젝트]/persona.md`에 둔다.
이 파일은 사용자가 직접 제공하거나, 없으면 PM이 PRD를 작성할 때 정의한다.

```
persona_path: [프로젝트]/persona.md
```

오케스트레이터는 해당 파일이 존재하면 모든 에이전트 호출에 `persona_path`로 포함한다.
각 에이전트는 작업 시작 전 이 파일을 읽고 사용자 맥락을 파악한 뒤 작업한다.
페르소나 작성 시에는 `workspace/persona-template.md`를 템플릿으로 사용한다.

---

## 프로젝트 간 기억층 (Memory Layer)

`session.md`가 한 프로젝트 *안*의 진행을 추적한다면, 기억층은 프로젝트를 *넘어* 누적되는 맥락을 담는다. 시스템이 쓸수록 그 회사·그 디자이너에게 맞게 똑똑해지도록 만드는 인프라다. (구조·원칙 요약은 `workspace/_memory/README.md` 참조.)

### 무엇을 담는가 (남용 금지)

- **담는 것**: 재현 가능한 판단의 근거(왜 그렇게 결정했나), 회사의 톤·규칙·제약, 반복 확인된 사용자 선호.
- **담지 않는 것**: 산출물 자체(PRD·디자인·코드 — 프로젝트 폴더에 있음), 리서치 원본 데이터, 일회성 정보, 세션 진행 상태(`session.md`가 담당).
- 기억층은 **판단과 선호**만 담는다. 데이터 창고가 아니다.

### 2층 구조

| 층 | 경로 | 담는 것 |
|----|------|--------|
| 개인 | `workspace/_memory/designer-profile.md` | 회사 불문 유지되는 나의 작업 취향·원칙 (처음엔 없음 — 첫 개인 선호가 승인될 때 생성) |
| 회사 | `workspace/_memory/companies/[회사명]/decisions.md` | 그 회사에서 내린 판단과 근거 (결정 로그) |
| 회사 | `workspace/_memory/companies/[회사명]/conventions.md` | 그 회사의 톤·디자인 규칙·기술 제약 |

회사별로 분리해 A사의 결정이 B사로 새지 않게 한다. 개인 층은 회사가 바뀌어도 유지된다.

### 회사 식별

- `[프로젝트]/session.md`의 `company: [회사명]` 필드로 프로젝트가 속한 회사를 식별한다.
- `company`가 비어 있으면 `crew.config.md`의 `default_company`를 쓰고, 그것도 비어 있으면 작업 시작 시 한 번 묻는다(개인 작업이면 `personal`). 정한 값은 session.md에 적고 다시 묻지 않는다.
- 해당 회사 폴더가 없으면 `workspace/_memory/companies/_template/`를 복사해 `companies/[회사명]/`를 만든다.

### 디자인 시스템 정하기 (프로젝트 단위)

같은 회사 안에서도 프로젝트마다 디자인 시스템이 다를 수 있다. 0단계에서 아래 순서로 정하고 session.md `design_system:`에 적는다. 모든 에이전트 · 검수는 회사 이름이 아니라 **이 값**을 본다.

1. session.md에 `design_system:`이 이미 있으면 그 값 (예: 자체 DS를 쓰는 프로젝트)
2. 없으면 회사 conventions 「고정 디자인 시스템」의 기본값 (conventions에 프로젝트별 예외가 적혀 있으면 그 예외)
3. 둘 다 없으면 `none` → 디자이너 단계 직전 「디자인 스킬 선택 게이트」에서 고른다

### 기억 읽기 — 작업 시작 시 자동 주입 (핵심)

사용자가 "지난번 결정 참고해"라고 말하지 않아도, 오케스트레이터가 작업 시작 시 기억층을 **자동 로딩**해 모든 에이전트에 주입한다. 페르소나를 `persona_path`로 주입하는 것과 동일한 메커니즘이다.

로딩 대상:
- `workspace/_memory/designer-profile.md` (있으면)
- `workspace/_memory/companies/[회사]/decisions.md` (있으면)
- `workspace/_memory/companies/[회사]/conventions.md` (있으면)

이 내용을 `memory_context`로 묶어 모든 에이전트 호출에 포함한다. 각 에이전트는 작업 전 이를 읽고 따른다. **기억이 자동으로 읽히지 않으면 죽은 파일이 된다** — 이 자동 주입이 "쓸수록 똑똑해지는" 작동부다.

### 기억 쓰기 — 반자동 (제안 → 승인)

자동 저장하지 않는다(쓰레기 누적 방지). 무조건 수동도 아니다(제안은 시스템이 한다).

1. 에이전트가 의미 있는 결정/선호를 산출하거나 사용자가 새 방향을 지시하면, 오케스트레이터가 판단한다 — "이건 프로젝트를 넘어 기억할 가치가 있는가?"
2. 가치 있으면 사용자에게 제안한다:

```
💾 이 결정을 [회사] 기억에 남길까요?
[결정] 목록 기본 정렬을 최신순으로
[근거] 사용자가 가장 먼저 확인하는 건 최근 항목
→ 회사 결정에 남기기 / 개인 프로파일에 / 안 남김
```

3. 사용자가 승인한 분류의 파일에 append한다. 승인하지 않으면 누적하지 않는다. `designer-profile.md`가 아직 없으면 이때 새로 만든다(섹션: 글쓰기·카피 톤 / 디자인 원칙 / 작업 방식 / 기록 로그).

**분류 기준**
- 회사 불문 개인 취향 → `designer-profile.md`
- 회사 고유 판단(왜가 분명한 결정) → `companies/[회사]/decisions.md`
- 회사 규칙·톤·제약 → `companies/[회사]/conventions.md`

**제안 트리거 (과하지 않게)**
- 같은 선호가 반복 확인될 때 (→ 개인 프로파일 제안)
- 재현 가능한 설계 판단이 내려질 때 (→ 회사 결정 제안)
- 회사 고유 규칙/제약이 드러날 때 (→ conventions 제안)
- 프로젝트 성격↔디자인 스킬 선택 매칭이 내려질 때 (→ conventions 또는 decisions 제안 — 다음 유사 프로젝트에서 참고)
- 일회성·산출물·데이터는 제안하지 않는다.

### 페르소나와 기억층의 구분

둘은 다른 층이며 둘 다 컨텍스트로 주입되지만 역할이 다르다. 중복 주입되어도 충돌하지 않는다.
- **페르소나**(`[프로젝트]/persona.md`) = 이 프로젝트의 *사용자가 누구인가* (프로젝트별)
- **기억층**(`workspace/_memory/`) = 이 회사/이 디자이너가 *어떻게 일하는가* (프로젝트를 넘어 누적)

---

## 실행 모드

사용자의 요청을 분석해 아래 모드 중 하나를 선택한다.

| 모드 | 설명 | 에이전트 호출 순서 |
|------|------|-----------------|
| **FULL** | 신규 서비스/기능 전체 프로세스 (구현 · 검증까지) | Researcher → PM → 기획자 → UX라이터 → 디자이너 → (가상 사용자 점검) → Engineer → QA |
| **PLAN** | 리서치 + PRD + 화면 기획까지 | Researcher → PM → 기획자 |
| **RESEARCH** | 리서치/경쟁사 분석만 필요 | Researcher 단독 |
| **DESIGN** | 기획안이 있고 디자인만 필요 | 기획자 → 디자이너 |
| **BUILD** | 디자인 스펙·문구가 있고 구현만 필요 | Engineer 단독 (또는 디자이너 → Engineer) |
| **WRITE** | 문구 작업만 | UX라이터 |
| **CUSTOM** | 사용자가 에이전트를 직접 지정 (Researcher·Engineer 포함) | 사용자 정의 순서 |

### 모드 선택 기준

```
사용자 요청 분석
        ↓
"신규 서비스 / 전체 기능 출시"     → FULL
"기획서 / PRD 만들어줘"             → PLAN
"리서치 / 경쟁사 분석만 해줘"        → RESEARCH
"기획안 있어, 디자인만 해줘"         → DESIGN
"디자인 스펙 있어, 코드로 구현만 해줘" → BUILD
"문구 수정 / UX 라이팅 해줘"         → WRITE
"[특정 에이전트] 호출해줘"           → CUSTOM
모호한 경우                         → 사용자에게 모드 확인 후 진행
```

> **DESIGN 모드에서 구현까지 원하는 경우**: 디자인 완료 후 곧바로 구현이 필요하면 사용자에게 확인 후 Engineer를 이어 붙인다(`기획자 → 디자이너 → Engineer`). 또는 디자인 산출물이 이미 있으면 BUILD 모드로 분리해 실행한다.

**FULL / PLAN 진입 시 리서치 자료 확인**: Researcher 단계 시작 전, 사용자가 제공할 기존 리서치 자료(인터뷰 전사·설문·지원 티켓 등)가 있는지 확인한다. 있으면 `research_input` 경로로 Researcher에 전달하고, 없으면 Researcher가 가용 범위(경쟁사 분석·웹 검색·페르소나)에서 수행하되 한계를 명시하게 한다.

---

## 인풋/아웃풋 전달 규칙

### 전체 파이프라인 흐름

각 생성 에이전트(Researcher/PM/기획자/UX라이터/디자이너/Engineer/QA)가 산출물을 내면, 다음 에이전트로 넘어가기 전에 **두 단계 게이트**를 거친다.

1. **존재 검증 게이트** (기존) — 파일·필드가 있는지 확인. 실패하면 `blocked` 처리.
2. **Reviewer 검수** — 내용 품질을 비평. **메인 세션이 `scripts/review.py`로 Codex(읽기 전용)를 직접 실행한다** — 만든 모델(Claude)과 검수 모델을 분리해 같은 사각지대를 피한다(기준 = `agents/reviewer/CLAUDE.md`). `pass` / `revise`(같은 단계 재작업) / `rollback`(상류 단계로 되돌림) / `escalate`(사람 판단) 판정. Reviewer의 verdict와 근거는 각 단계 정지 보고 시 **항상 사용자에게 노출**되며, 사용자 판단이 Reviewer보다 우선한다(아래 「Reviewer 검수 처리」 참조).

```
[사용자 요청]
        ↓
[오케스트레이터] — 모드 판단 및 컨텍스트 준비
        ↓
┌──────────────────────────────────────────────┐
│ [Researcher 에이전트] (FULL / PLAN / RESEARCH)   │
│   인풋:  서비스명, 기능명, 리서치 자료, 페르소나      │
│   아웃풋: 리서치 종합, key_insights, 경쟁 분석       │
│        ↓                                        │
│ [존재 검증 게이트] → [Reviewer 검수] (근거 품질)    │
│   ├─ pass     → PM으로 진행                       │
│   ├─ revise   → Researcher 재호출 (최대 2회)       │
│   └─ escalate → 사용자에게 보고 후 대기            │
└──────────────────────────────────────────────┘
        ↓ pass (research_path, key_insights 전달)
┌──────────────────────────────────────────────┐
│ [PM 에이전트] (FULL / PLAN 모드)                  │
│   인풋:  리서치 종합·insights, 비즈니스 목표, 타겟    │
│   아웃풋: PRD, 기능 목록, 우선순위, 브랜드 방향성     │
│        ↓                                        │
│ [존재 검증 게이트]  (파일/필드 존재 확인)            │
│        ↓ 통과                                    │
│ [Reviewer 검수]    (내용 품질 비평)               │
│   ├─ pass     → 다음 에이전트로 진행               │
│   ├─ revise   → PM 재호출 (review_notes 전달,     │
│   │             revision_count +1) → 재검수       │
│   ├─ rollback → 상류(researcher) 재호출 후          │
│   │             하류로 재진행 (같은 상류 2회 제한)    │
│   └─ escalate → 사용자에게 보고 후 대기            │
└──────────────────────────────────────────────┘
        ↓ pass (verdict·근거를 사용자에게 노출)
[기획자 에이전트] (FULL / PLAN / DESIGN 모드)
  인풋:  PRD, 기능 목록, 우선순위, 플랫폼, 브랜드 방향성
  아웃풋: 화면 기획안, 기능 명세서, User Flow, 와이어프레임
        ↓  [존재 검증 게이트] → [Reviewer 검수] (이하 동일 패턴)
        ↓ pass
[UX 라이터 에이전트] (FULL / WRITE 모드)
  인풋:  화면 기획안, 기능 명세서(상태·예외 정의), 브랜드 방향성, 보이스 가이드
         (WRITE 모드에서 기존 화면 문구를 정비할 때만 디자인 화면을 받는다)
  아웃풋: UX 라이팅 가이드, 화면별 문구 시트(copy_sheet) — FULL에서는 디자인 전에 문구를 먼저 확정
        ↓  [존재 검증 게이트] → [Reviewer 검수] (이하 동일 패턴)
        ↓ pass
[Figma 링크 수령] (FULL / DESIGN 모드, 디자이너 진입 직전 — 1회 정지)
  - 디자이너 호출 전에 멈추고 사용자에게 요청한다:
    "디자인을 받을 Figma 페이지 링크를 주세요. (Figma로 받지 않으려면 '스킵'이라고 알려주세요.)"
  - 링크 제공 → figma_link로 저장, 디자이너 인풋에 전달. 디자이너는 그 페이지에 그릴 `figma_draw_plan`을 내고, 그리기와 figma_url은 메인 세션(5b)이 맡는다.
  - '스킵' 또는 Figma MCP 미연결 → figma_link 없이 진행. 디자이너는 마크다운 스펙만 산출, figma_url은 N/A(사유 명시). 이때 디자이너 검수는 스펙만으로 한다(`--image` 없이).
  - 이 단계는 디자이너 진입 직전에만 1회 묻는다(Researcher~UX라이터 단계에서는 묻지 않는다).
        ↓
[디자인 스킬 선택 게이트] (FULL / DESIGN 모드, 디자이너 본작업 직전)
  - ★ session.md `design_system:`이 `none`이 아니면(「디자인 시스템 정하기」) 추천·정지 없이
    그 스킬을 design_skill로 바로 적용한다. 진행 보고에 "적용 디자인 시스템: [스킬명]"을 명시하고,
    사용자가 다른 스킬을 원하면 그 판단이 우선한다. 보조 스타일 스킬(모션·레이아웃 등)을 함께 쓰려 할 때만
    추천 → 승인을 받는다. Figma 작업은 conventions에 적힌 라이브러리의 컴포넌트·Variables를 import해 쓴다.
  - `design_system: none`일 때만 아래 추천 게이트(정지)를 거친다. 디자이너를 「추천만」 작업으로 먼저 호출하면 `status: needs_input`과 추천안을 반환한다.
  - 디자이너가 기획 결과물(screen_plan·feature_spec)·PRD·페르소나·conventions를 분석해
    이 프로젝트에 맞는 `skills/`의 디자인 스타일/시스템 스킬을 **추천**한다(1순위+대안, 각 근거).
  - 근거는 라벨 동어반복이 아니라 기획의 구체적 특징에 기반한다.
  - 여기서 멈추고 **사용자가 스킬을 고를 때까지 대기**한다(통보가 아니라 승인 게이트).
  - 승인된 스킬을 디자이너 본작업에 강제 적용한다(자체 토큰 0부터 금지). session.md `design_system:`에 고른 스킬을 적는다.
  - Figma 링크 수령과는 **순차로** 묻는다(스킬 추천은 기획 분석 결과를 보여줘야 하므로 분리).
        ↓
[디자이너 에이전트] (FULL / DESIGN 모드)
  인풋:  화면 기획안, 기능 명세서, copy_sheet(문구 시트), platform(mobile/web/both), 브랜드 방향성, figma_link(있으면), design_skill, shots_dir(기존 화면을 참고 · 복제할 때 메인 세션이 캡처)
  규칙:  화면 문구는 copy_sheet 문구 그대로 쓴다(임시 문구 금지). 공간에 안 맞으면 design_spec 「문구 조정 요청」에 적고,
         오케스트레이터가 UX라이터에게 그 줄만 다시 다듬게 한 뒤 디자이너가 반영한다.
  아웃풋: 디자인 스펙(적용 스킬·전 화면 N개/전 컴포넌트 M개 명시), 컴포넌트 스펙, figma_draw_plan(figma_link 받았을 때). figma_url은 디자이너가 내지 않는다(그리는 건 메인 세션)
        ↓
[Figma 드로잉 위임] (figma_link 받았을 때만 — 오케스트레이터/메인 세션 수행)
  - 네이티브 서브에이전트는 Figma MCP 도구에 접근하지 못한다. 디자이너의 figma_draw_plan을 받아
    메인 세션이 위임받아 Figma에 그린다: Variables(토큰) → 컴포넌트+Variant → 전 화면(디바이스/브레이크포인트 사이즈) 배치.
  - 오토레이아웃·시멘틱 네이밍·토큰 참조(Figma 제작 표준) 준수. 완료 후 figma_url 확보 → 디자이너 산출의 figma_url로 채운다.
  - **핸드오프 주석 배치**: 화면을 그린 뒤 figma_draw_plan의 핸드오프 배치표대로 흐름 섹션(정상 / 예외)과 화면 번호 · 설명을 붙인다.
    회사 conventions에 핸드오프 주석 라이브러리 · 규칙이 있으면 그것을 따른다. Timestamp는 작업일.
    라이브러리 import가 안 되면 비슷한 모양을 직접 그리지 말고 사용자에게 알린다.
  - Figma 호출 한도 고려: 핵심 컴포넌트·전 화면 위주, 많으면 핵심 플로우 우선.
  - **Codex 검수용 화면 저장**: Codex는 Figma에 접근하지 못하므로 핵심 화면을 `get_screenshot`으로 받아 `[프로젝트]/designer/review-shots/`에 PNG로 저장하고, Reviewer 호출 시 경로를 함께 넘긴다.
  - figma_link 없으면(스킵/미연결) 이 단계 생략, figma_url=N/A.
        ↓  [존재 검증 게이트] → [Reviewer 검수] (이하 동일 패턴)
        ↓ pass
[가상 사용자 점검] (FULL 모드, 오케스트레이터/메인 세션 수행 — 판정 없음)
  - 스킬 `user-voice-sim`으로 디자이너 Figma의 핵심 과업 흐름 3~5장을 persona_path 페르소나별로 인터뷰
    (기본 Claude · Codex 두 모델 각각 실행, 사용자가 모델을 지정하면 그 모델만. 신뢰도 높음 = 두 모델 모두 같은 곳에서 막힘)
  - figma_url 없으면(스킵) 또는 스킬 미설치면 생략하고 사유만 보고
  - 결과: [프로젝트]/feedback-sim/ — 신뢰도 높음만 수정 제안으로 사용자에게 보여 주고,
    승인한 것만 원인별로 넘긴다(문구 → UX라이터 그 줄만 → 디자이너 반영 / 배치 → 디자이너). 1회로 끝낸다
        ↓
[Engineer 에이전트] (FULL / BUILD 모드)
  인풋:  디자인 스펙, 컴포넌트 스펙, 문구 시트, platform, 기술 스택, shots_dir(Figma 화면 캡처 — 메인 세션이 저장), (QA 재작업 시) bug_report
  아웃풋: 동작하는 프론트엔드 코드, 빌드 결과, run_command (미리보기 서버는 메인 세션이 띄워 사용자에게 안내)
        ↓  [존재 검증 게이트] → [Reviewer 검수] (이하 동일 패턴)
        ↓ pass (BUILD 모드는 여기서 작업 완료 보고)
[QA 에이전트] (FULL 모드만)
  인풋:  기능 명세서, 화면 기획안, 문구 시트, 디자인 스펙, code_path · run_command · preview_url, implementation_notes, platform
  아웃풋: 테스트 케이스, QA 리포트(실행 결과 · 탐색 세션 · 버그), qa_status(pass/fail), 기획 확인 목록
  - qa_status: fail(치명 · 주요 남음) → 버그 리포트를 Engineer에 넘겨 수정 → QA 재테스트(retest_of). 최대 2회, 그래도 남으면 사용자 판단
  - 「기획 확인」(문서끼리 다름 · 문서에 없는 상황)은 Engineer에게 넘기지 않고 사용자에게 보고
  - qa_status: pass → 보통 · 사소 버그는 남은 목록으로 보고(고칠지는 사용자 판단)
  - 순서: QA 회차마다 존재 검증 게이트는 거친다. fail 루프(Engineer 수정 → 재테스트)를 먼저 끝내고, 마지막 QA 산출물에만 Reviewer 검수를 한 번 한다(QA 단계만의 예외).
    재테스트 횟수는 session.md 「횟수」 표에 적는다(대화가 끊겨도 2회 상한 유지)
        ↓  [존재 검증 게이트] → [Reviewer 검수] (QA 산출물 품질)
        ↓ pass
[작업 완료 보고]  ← 최종 산출물: Engineer 구현 코드 + QA 테스트 케이스 · 리포트
```

> 두 게이트의 순서는 **존재 검증 → 내용 비평**이다. 존재 검증을 통과해야 Reviewer를 호출한다. 존재 검증 실패는 기존대로 `blocked` 처리이고, 내용 비평은 그 다음 단계다.

### 에이전트 호출 시 전달 형식

각 에이전트를 호출할 때 아래 항목을 반드시 포함한다.

```
role:           [에이전트명]
task:           [수행할 작업 내용]
mode:           CREW
project_dir:    [프로젝트] 절대경로
input:          [이전 에이전트 아웃풋 경로 또는 사용자 제공 인풋] — 단계 계약표의 「받는 것」 전부
output_path:    [산출물 저장 경로]
platform:       mobile / web / both
design_system:  session.md 값 (디자이너 · Engineer · QA)
shots_dir:      [프로젝트]/_shots/[단계]/   # 볼 화면이 있을 때만 (메인 세션이 캡처)
persona_path:   [프로젝트]/persona.md   # 페르소나 파일이 존재할 때만 포함
memory_context: designer-profile.md + companies/[회사]/{decisions,conventions}.md  # 기억층 자동 주입 (있는 것만)
review_notes:   [재작업일 때 직전 검수 파일 경로]
```

> `memory_context`는 오케스트레이터가 작업 시작 시 로딩한 기억층 내용이다(「프로젝트 간 기억층 > 기억 읽기」 참조). 페르소나와 마찬가지로 각 에이전트는 작업 전 이를 읽고 따른다.

### blocked · needs_input 처리

에이전트가 `status: blocked`(진행 불가) 또는 `status: needs_input`(사용자 결정 필요)을 반환하면:

1. 사용자에게 이유 · 질문을 즉시 보고 (needs_input은 에이전트가 낸 `questions` 그대로, 추천안이 있으면 함께)
2. 해결 방안 제시 (추가 정보 요청 / 작업 범위 조정)
3. 사용자 답을 input에 넣어 해당 에이전트 재호출 또는 작업 중단

### Reviewer 검수 처리

생성 에이전트의 산출물이 **존재 검증 게이트를 통과한 직후** 메인 세션이 검수 스크립트를 직접 실행한다(Bash `timeout: 600000`).

```bash
python3 scripts/review.py --project "[프로젝트]" --stage [단계] \
  --target [산출물 ...] \
  --ref [persona · PRD · 상류 산출물 · 회사 conventions ...] \
  --image [프로젝트]/designer/review-shots/*.png \
  --revision [이 산출물 revise 횟수] --rollbacks "[상류=횟수,...]" \
  --prev [직전 검수 파일]
```

- `--image`는 디자이너 단계(그린 화면이 있을 때)만, `--prev`는 재검수일 때만 붙인다. 셋 다 여러 파일을 한 번에 받는다.
- `--revision` = 이 산출물이 revise를 받아 **다시 작업한 횟수**(첫 검수 0, 첫 재작업 뒤 검수 1, 두 번째 재작업 뒤 검수 2 → 여기서 또 revise면 escalate).
- `--revision` · `--rollbacks`는 session.md 「횟수」 표 값을 **매번** 넘긴다(빠지면 상한이 동작하지 않는다). rollback 횟수는 **되돌린 대상(상류) 역할별**로 센다.

- 넘길 것: 대상 전부 · 근거 자료(상류 산출물과 `memory_context` 파일 포함) · 화면 캡처(디자이너) · Engineer면 `code_path`와 빌드 로그 · QA면 `test_cases` · `qa_report` · `qa/evidence/`.
- 결과 원문은 `[프로젝트]/reviews/[단계]-[NN].md`에 번호가 자동으로 붙어 쌓인다(덮어쓰지 않음). 마지막 줄 JSON의 `verdict`로 처리한다. 상한(revise 2 · 같은 상류 rollback 2)에 걸리면 스크립트가 `escalate`로 바꿔 준다.
- 마지막 줄 JSON: `verdict` · `review_file` · `rollback_to` · `capped`(상한으로 바뀐 경우) · `format_ok`.
- 종료 코드: 2 인자 · 파일 오류(고쳐서 다시) · 3 Codex를 안 씀(미설치 또는 `reviewer: claude`) → `agents/reviewer/CLAUDE.md` 기준으로 메인 세션이 직접 검수해 같은 형식으로 `reviews/[단계]-[NN].md`에 저장하고 맨 위에 `검수 모델: Claude (같은 모델 검수)`를 적는다 · 4 Codex 실패 → 1회 재실행, 또 실패하면 escalate · 5 형식 깨짐(verdict나 rollback 대상을 못 읽음) → 1회 재실행, 또 깨지면 원문을 첨부해 escalate.

Reviewer가 반환한 `verdict`는 **4종(`pass` / `revise` / `rollback` / `escalate`)**이며, 어떤 verdict든 처리 전에 **verdict와 근거(`review_notes`)를 사용자에게 노출**한다(아래 「Reviewer verdict의 사용자 가시성」 참조).

- **`pass`** → 검수 통과. `review_notes`(확인한 핵심 기준 + 남긴 약점)를 사용자에게 노출하고, session.md에 `review: pass` 기록 후 다음 에이전트 호출.
- **`revise`** → `review_notes`를 인풋에 포함해 `revise_target`(현재 단계) 에이전트를 재호출한다. 해당 산출물의 `revision_count`를 +1 하고, 재작업 완료 후 **다시 존재 검증 → Reviewer 검수**를 거친다.
- **`rollback`** → 결함 원인이 상류 산출물에 있다는 판정. `rollback_reason`을 인풋에 실어 `rollback_to`(상류 역할) 에이전트를 재호출하고, **거기서부터 하류로 다시 진행**한다(중간 단계는 영향받은 부분만 갱신). 해당 `rollback_to` 대상의 `rollback_count`를 +1 하고 session.md에 rollback 이력을 기록한다. 재진행 산출물은 다시 존재 검증 → Reviewer 검수를 거친다.
- **`escalate`** → 작업을 중단하고 `escalate_reason`과 `review_notes`를 사용자에게 보고한 뒤 판단을 기다린다.

**상한**: 단계 계약표대로 revise 2회 · 같은 상류 rollback 2회. `review.py`가 넘긴 횟수로 판정을 escalate로 바꿔 무한 루프를 막는다. 그래서 session.md 「횟수」 표를 매번 정확히 갱신해야 한다.

### Reviewer verdict의 사용자 가시성 (자기참조 공백 보완)

Reviewer의 비평이 자의적일 수 있으므로(좋은 걸 `revise`, 나쁜 걸 `pass`), Reviewer 판정 자체를 사용자가 최종 검수한다.

- 각 단계 정지·진행 보고 시 Reviewer의 `verdict`와 근거(`review_notes`)를 **항상 사용자에게 노출**한다. `pass`도 예외가 아니다 — 무비판 통과를 사용자가 확인할 수 있어야 한다.
- 사용자는 Reviewer verdict에 **이의를 제기**할 수 있다(Reviewer가 `pass`했어도 사용자가 재작업을 요청하거나, 반대로 `revise`/`rollback`/`escalate`를 사용자가 그대로 수용하고 진행). **사용자 판단이 Reviewer보다 우선한다.**
- 사용자가 verdict를 뒤집으면 그 결정을 session.md에 기록하고(예: `review: pass(사용자 revise 지시)`) 그에 따라 진행한다.

#### Reviewer escalate 보고 형식

```
## Reviewer 검수 — 사용자 판단 필요 (escalate)

대상: [target_role] 산출물 ([파일 경로])
재작업 횟수: [revision_count]회
escalate 사유: [escalate_reason]

검수 의견:
[review_notes — 잘된 점 / 약한 점 / 막힌 지점]

진행 방법:
  1. 사용자가 직접 방향을 정해 해당 에이전트에 재지시
  2. 현재 산출물을 그대로 수용하고 다음 단계 진행
  3. 작업 범위 조정 후 재시작
```

#### Reviewer rollback 보고 형식

`rollback`은 사람 판단을 기다리는 정지가 아니라 상류로 되돌려 자동 재진행하는 처리지만, verdict 가시성 원칙에 따라 되돌리기 전에 사용자에게 알린다(사용자가 이의를 제기하면 그 판단이 우선한다).

```
## Reviewer 검수 — 상류 되돌림 (rollback)

대상: [현재 target_role] 산출물 ([파일 경로])
되돌릴 상류: [rollback_to]
rollback 횟수: [rollback_count]회 (같은 상류 2회 초과 시 escalate 전환)
rollback 사유: [rollback_reason — 무엇이 왜 상류 문제이고, 현재 단계 재작업으로 못 고치는 이유]

검수 의견:
[review_notes]

처리: [rollback_to]을(를) rollback_reason과 함께 재호출하고, 거기서부터 하류로 재진행합니다.
(이 판정에 이의가 있으면 알려주세요 — 사용자 판단이 우선합니다.)
```

---

## 산출물 저장 경로 규칙

**작업물은 이 레포의 `[프로젝트]/`에 역할별로 저장한다.** 프로젝트를 넘는 누적 기억은 `workspace/_memory/`에 둔다(「프로젝트 간 기억층」 참조). 작업물을 별도 레포로 관리하고 싶으면 이 문서의 `workspace/` 경로를 그 위치로 바꿔 쓴다.

- `[서비스명]` 폴더가 없으면 새로 만든다.
- 기존 디자인 분석 · 검토 문서가 있으면 `[프로젝트]/analysis/`에 두고, 해당 서비스 작업 시 Researcher · PM · 기획자 인풋으로 함께 전달한다.

```
workspace/
  _memory/            ← 프로젝트 간 기억층 (개인 프로파일 + 회사별 결정·컨벤션)
  persona-template.md ← 페르소나 템플릿
  [서비스명]/
    analysis/         ← 기존 디자인 분석·검토 문서 (있으면)
    persona.md        ← 서비스 페르소나
    researcher/       ← Researcher 산출물 (리서치 종합, 경쟁 분석, insights)
    pm/               ← PM 산출물 (PRD, 로드맵, 우선순위)
    planner/          ← 기획자 산출물 (화면 기획안, 기능 명세서, User Flow)
    ux-writer/        ← UX 라이터 산출물 (라이팅 가이드, 문구 시트)
    designer/         ← 디자이너 산출물 (디자인 스펙, 컴포넌트 스펙)
    feedback-sim/     ← 가상 사용자 점검 결과 (user-voice-sim, 설치했을 때)
    engineer/         ← Engineer 산출물 (동작하는 프론트엔드 코드, 빌드 결과)
    qa/               ← QA 산출물 (테스트 케이스, QA 리포트, 증거, Playwright 스크립트)
    reviews/          ← 검수 원문 ([단계]-[NN].md, review.py가 번호를 붙임)
    session.md        ← 작업 세션 체크포인트 (오케스트레이터 관리)
```

---

## 세션 관리

### 작업 시작 시 — 세션 확인

작업 요청을 받으면 `[프로젝트]/session.md`를 먼저 확인한다.

- **파일 없음 또는 `status: complete` / `handed_off`** → 새 세션 시작, 신규 session.md 생성 (옛 파일은 `session-[시작일].md`로 이름을 바꿔 남긴다)
- **`status: in_progress` / `paused`** → 사용자에게 재개 여부 확인

재개 확인 메시지:

```
이전에 진행 중이던 작업이 있어요.

서비스: [서비스명]
기능: [기능명]
마지막 완료: [에이전트명] (단계 N)
다음 실행: [next_step · next_agent 값]
기다리는 것: [waiting_for 값, 없으면 생략]

이어서 진행할까요?
- 예 → session.md의 next_step부터 재개 (재검수 · rollback · 5a/5b 대기 중이었으면 그 지점부터. 이전 산출물 파일 경로 참조)
- 아니오 → 처음부터 새로 시작 (session.md 초기화)
```

### 에이전트 완료 후 — 체크포인트 기록

에이전트가 `status: complete`를 반환하고 검수까지 끝나면 즉시 session.md를 업데이트한다. **session.md는 상태판이다 — 길게 쓰지 않는다.** 진행 중 대화 · 결정 · 시행착오 기록은 `[프로젝트]/log.md`에 날짜별로 따로 적는다.

**session.md 형식**

```markdown
# 작업 세션

service: [서비스명]
company: [회사명]   # 기억층 회사 식별용 (workspace/_memory/companies/[회사명]/). 개인 작업이면 personal
design_system: [스킬 경로 또는 none]   # 「디자인 시스템 정하기」
platform: mobile / web / both
feature: [기능명]
mode: RESEARCH / FULL / PLAN / DESIGN / BUILD / WRITE / CUSTOM
status: in_progress / paused / handed_off / complete   # paused · handed_off면 뒤에 사유
started_at: YYYY-MM-DD
updated_at: YYYY-MM-DD

## 진행 상태

| # | 단계 | 상태 | 검수 결과 | 검수 파일 | 완료일 |
|---|------|------|----------|----------|-------|
| 1 | Researcher | complete | revise→pass | reviews/researcher-02.md | 2026-05-04 |
| 2 | PM | complete | pass | reviews/pm-01.md | 2026-05-04 |
| 3 | 기획자 | in_progress | - | - | - |
| 4 | UX 라이터 | pending | - | - | - |
| 5 | 디자이너 | pending | - | - | - |
| 5c | 가상 사용자 점검 | pending | (판정 없음) | - | - |
| 6 | Engineer | pending | - | - | - |
| 7 | QA | pending | - | - | - |

> 검수 결과 표기: `pass` / `revise(N)` / `rollback(N)` / `escalate`. 반복되면 `revise→pass`처럼 최종까지 남기고, 사용자가 뒤집었으면 `pass(사용자 revise 지시)`처럼 적는다.

## 횟수 (상한 2 — 대화가 끊겨도 이 값으로 이어 간다)

| 종류 | 대상 | 횟수 |
|------|-----|-----|
| revise | planner | 1 |
| rollback (되돌린 대상별) | planner | 0 |
| QA 재테스트 | qa | 0 |

## 산출물 경로

| 단계 | 산출물 | 경로 |
|------|-------|------|
| PM | PRD | [프로젝트]/pm/PRD/PRD-...-v1.0.md |
| 기획자 | 기능 명세서 | [프로젝트]/planner/feature-spec.md |

## 다음

next_step: 3
next_agent: planner
waiting_for: (멈춰 있으면 무엇을 기다리는지 — 사용자 결정 · 외부 준비물)

## 컨텍스트 요약 (30줄 이내)

다음 에이전트가 이것만 읽고 이어갈 수 있게: 범위 · 확정된 결정 · 열린 질문 ID(`open-items.md`) · 브랜드 방향.
자세한 경위는 log.md에.
```

### 멈출 때 · 끝낼 때

- 모든 단계가 끝나면 `status: complete`.
- 사용자 결정 · 외부 준비물을 기다리느라 멈추면 `status: paused   # [사유]` + `waiting_for`.
- 크루를 거치지 않고 메인 세션 · 사람이 이어서 하기로 하면 `status: handed_off   # [날짜 · 사유]`. 다음 크루 작업은 새 세션으로 시작한다.
- `in_progress`로 둔 채 대화를 끝내지 않는다.

---

## 아웃풋 품질 검증 게이트 (1단계 — 존재 검증)

이 게이트는 두 단계 품질 통제 중 **첫 번째**다. 산출물이 "있는지"(파일·필드 존재)만 본다. 내용이 "좋은지"는 다음 단계인 [Reviewer 검수](#reviewer-검수-처리)가 판단한다.

에이전트가 `status: complete`를 반환해도, 다음 에이전트로 넘기기 전에 아래 항목을 검증한다.
**하나라도 실패하면 `blocked` 처리** 후 사용자에게 보고한다. 모두 통과하면 곧바로 Reviewer 검수(2단계)로 넘어간다.

### Researcher 아웃풋 검증

- [ ] `research_path` 파일이 실제로 존재하는가
- [ ] `key_insights`가 비어있지 않은가
- [ ] `competitor_findings`가 제공됐는가

### PM 아웃풋 검증

- [ ] `prd_path` 파일이 실제로 존재하는가
- [ ] `feature_list`가 비어있지 않은가
- [ ] `priority`에 Must Have 항목이 1개 이상인가
- [ ] `brand_direction`이 정의됐는가

### 기획자 아웃풋 검증

- [ ] `screen_plan` md 파일이 존재하는가
- [ ] `feature_spec` 파일이 존재하는가
- [ ] `platform`이 명시됐는가
- [ ] `open_items`(`open-items.md`)가 있는가 (남은 항목이 없으면 「없음」)

### 디자이너 아웃풋 검증

- [ ] `design_spec` 파일이 존재하는가 (필수)
- [ ] `component_spec` 파일이 존재하는가 (필수)
- [ ] `figma_link`를 받았다면 `figma_draw_plan` 파일이 존재하는가 → 메인 세션이 그린 뒤(5b) `figma_url`과 `designer/review-shots/` PNG가 있는가. `figma_url`이 받은 `figma_link`와 같은 문자열이기만 하면 통과가 아니다(실제로 그린 노드 링크여야 함). `figma_link`가 없으면(스킵/미연결) `figma_url: N/A (사유 명시)`로 두고 통과시킨다.

> 디자이너의 필수 산출물은 `design_spec`·`component_spec`(마크다운)이며 이 둘이 항상 정본이다. Figma는 `figma_link`를 받았을 때만 산출하는 시각화이지 마크다운 스펙의 대체가 아니다. `figma_link` 수령 여부는 「Figma 링크 수령」 정지 단계(디자이너 진입 직전)에서 결정된다.

### UX 라이터 아웃풋 검증

- [ ] `writing_guide` 파일이 존재하는가
- [ ] `copy_sheet` 파일이 존재하는가 (파일 1개, 화면별 절로 나눔)

### Engineer 아웃풋 검증

- [ ] `code_path` 디렉토리가 실제로 존재하는가
- [ ] `build_status`가 `pass`인가
- [ ] `implementation_notes`가 제공됐는가
- [ ] `run_command`가 있는가 (메인 세션이 이 명령으로 미리보기를 띄운다)

### QA 아웃풋 검증 (FULL)

- [ ] `test_cases` 파일이 존재하는가
- [ ] `qa_report` 파일이 존재하는가
- [ ] `qa_status`가 `pass` / `fail` 중 하나인가

### 검증 실패 처리

```
## 품질 검증 실패

에이전트: [에이전트명]
실패 항목:
  - [항목 1]
  - [항목 2]

해결 방법:
  1. 해당 에이전트에 누락 항목 보완 재요청
  2. 사용자가 직접 파일 제공 후 다음 단계 진행
```

---

## 모드별 검수 적용

Reviewer 검수(2단계)는 모드에 따라 아래처럼 적용한다.

| 모드 | 검수 적용 |
|------|----------|
| **FULL** | Researcher·PM·기획자·UX라이터·디자이너·Engineer·QA **각 단계마다** 검수 |
| **PLAN** | Researcher·PM·기획자 **각 단계마다** 검수 |
| **RESEARCH** | Researcher 단독이므로 그 산출물에 **1회** 검수 |
| **DESIGN** | 기획자·디자이너 **각 단계마다** 검수 |
| **BUILD** | Engineer 산출물(구현 코드)에 검수 (디자이너 포함 시 각 단계마다) |
| **WRITE** | UX라이터 단독이므로 그 산출물에 **1회** 검수 |
| **CUSTOM** | 사용자가 검수 on/off를 지정 (**기본 on**) |

- 어떤 모드든 검수 순서는 동일하다: 산출물 → 존재 검증 → Reviewer 검수 → (pass면) 다음 단계.
- CUSTOM 모드에서 사용자가 "검수 빼고", "검수 없이" 등으로 지정하면 Reviewer를 건너뛴다. 별도 지정이 없으면 검수를 켠 상태로 진행한다.

---

## 작업 시작 프로세스

사용자 요청을 받으면 아래 순서로 진행한다.

0. **설정 읽기** — `crew.config.md` (`projects_root` · `default_company` · `reviewer`)
1. **요청 분석** — 서비스명, 기능명, 작업 범위 파악
2. **회사 식별 및 기억층 로딩** — `company` 확인(없으면 `default_company`, 그것도 없으면 한 번 묻기). `workspace/_memory/designer-profile.md`·`companies/[회사]/decisions.md`·`conventions.md`를 있는 것만 로딩해 `memory_context`로 준비
3. **세션 확인** — `[프로젝트]/session.md` 확인. `in_progress` · `paused`이면 재개 여부 사용자에게 확인
4. **모드 결정** — RESEARCH / FULL / PLAN / DESIGN / BUILD / WRITE / CUSTOM 판단
5. **플랫폼 확정** — `platform`을 `mobile` / `web` / `both` 중 확정한다(사용자 미지정 시 묻는다). 이 값을 PM→기획자→디자이너→Engineer 인풋에 전달하며, 단계별 화면 설계·디자인(디바이스/브레이크포인트)·구현 기준이 분기된다.
6. **디자인 시스템 · 선행 조건 확인 (0단계)** — 「디자인 시스템 정하기」로 `design_system` 확정, 단계 계약표의 0단계 선행 조건 확인
7. **워크플로우 파일 참조** — `workflows/` 에서 해당 워크플로우 로드 (순서 · 필드는 단계 계약표가 우선)
8. **컨텍스트 준비** — 기존 산출물 경로 확인, 필요한 인풋 수집. `project_dir`·`persona_path`·`memory_context`·`platform`·`design_system`을 에이전트 호출에 주입
9. **에이전트 순차 호출** — 각 에이전트 CLAUDE.md를 참조하며 작업 지시
10. **아웃풋 검증 및 검수, 체크포인트 기록** — 완료 후 ① 존재 검증 게이트 통과 → ② Reviewer 검수(`pass`/`revise`/`rollback`/`escalate`). Reviewer verdict와 근거는 **항상 사용자에게 노출**하고 사용자 이의가 있으면 그 판단을 우선한다. `pass`면 session.md 업데이트 후 다음 에이전트 호출, `revise`면 같은 단계 재작업(최대 2회), `rollback`면 `rollback_to` 상류 재호출 후 하류로 재진행(같은 상류 최대 2회), `escalate`면 사용자 보고. 기억할 가치가 있는 결정·선호가 나오면 **기억 제안**(제안→승인) 수행
11. **작업 완료 보고** — 전체 결과 요약, 산출물 목록, 기억층 추가 항목, session.md `status: complete` 처리

---

## 작업 완료 보고 형식

모든 에이전트 작업이 완료되면 아래 형식으로 보고한다.

```
## 작업 완료 보고

실행 모드: [FULL / PLAN / RESEARCH / DESIGN / BUILD / WRITE / CUSTOM]
서비스/기능: [작업 대상]
실행 에이전트: [Researcher → PM → 기획자 → UX라이터 → 디자이너 → Engineer → QA]

### 산출물 목록

| 에이전트 | 산출물 | 저장 경로 |
|---------|-------|---------|
| Researcher | 리서치 종합, 경쟁 분석 | [프로젝트]/researcher/... |
| PM      | PRD   | [프로젝트]/pm/PRD/... |
| 기획자  | 화면 기획안, 기능 명세서 | [프로젝트]/planner/... |
| UX 라이터 | 라이팅 가이드, 문구 시트 | [프로젝트]/ux-writer/... |
| 디자이너 | 디자인 스펙, 컴포넌트 스펙 | [프로젝트]/designer/... |
| 가상 사용자 점검 | 페르소나별 반응, 오해 지점 · 수정 후보 | [프로젝트]/feedback-sim/... |
| Engineer | 동작하는 프론트엔드 코드, 빌드 결과 | [프로젝트]/engineer/... |
| QA | 테스트 케이스, QA 리포트 (버그 · 기획 확인 · 실행 못함) | [프로젝트]/qa/... |

### 기억층 추가
- 없음 / [이번 작업에서 승인되어 누적된 항목 — 예: [회사] decisions에 "soft/hard 3단계 채택" 추가]

### 이슈 사항
- 없음 / [이슈 내용]

### 최종 아웃풋

이 시스템의 범위는 디자인 → **프론트엔드 구현**까지다.
FULL 모드의 최종 산출물은 **Engineer의 구현 코드(동작하는 프론트엔드)**와 **QA의 테스트 케이스 · 리포트**다.
(백엔드·DB·API는 범위에 포함되지 않으며, 데이터는 mock/정적으로 처리한다.)
```

---

## 참조 워크플로우

| 워크플로우 | 파일 경로 | 사용 상황 |
|-----------|---------|---------|
| 리서치 | `workflows/research-process.md` | 리서치 / 경쟁사 분석만 |
| 전체 프로세스 | `workflows/full-process.md` | 신규 서비스 / 대형 기능 |
| 기획까지 | `workflows/plan-process.md` | 리서치 + PRD + 화면 기획까지 |
| 빠른 디자인 | `workflows/quick-design.md` | 기획안이 있을 때 디자인만 |
| 구현 | `workflows/build-process.md` | 디자인 스펙·문구가 있을 때 구현만 |
| UX 라이팅 | `workflows/ux-writing.md` | 문구 작업만 |
| 커스텀 | `workflows/custom-flow.md` | 에이전트 직접 조합 |

---

## 관련 문서

### 에이전트 가이드
- [[agents/researcher/CLAUDE|Researcher 가이드]] — 리서치 수집·종합, 경쟁 분석 (파이프라인 맨 앞)
- [[agents/pm/CLAUDE|PM 가이드]] — PRD·기능 목록·우선순위 작성
- [[agents/planner/CLAUDE|서비스 기획자 가이드]] — 화면 정의서·기능 명세·플로우 설계
- [[agents/designer/CLAUDE|프로덕트 디자이너 가이드]] — 컴포넌트 스펙·디자인 QA·피그마 작업
- [[agents/ux-writer/CLAUDE|UX 라이터 가이드]] — UI 문구 추출·검토·개선
- [[agents/engineer/CLAUDE|Engineer 가이드]] — 프론트엔드 구현·빌드 검증 (QA 직전, 최종 산출물)
- [[agents/qa/CLAUDE|QA 가이드]] — 구현 화면 실제 검증 · 테스트 케이스 · 버그 리포트 (FULL 마지막)
- [[agents/reviewer/CLAUDE|Reviewer 가이드]] — 산출물 내용 품질 비평 (존재 검증 위에 얹는 2단계 게이트)

### 템플릿·인프라
- [[workspace/persona-template|페르소나 템플릿]] — 서비스별 페르소나 작성용 범용 템플릿
- [[workspace/_memory/README|기억층 가이드]] — 프로젝트 간 누적 기억 (개인/회사 2층, 반자동 누적)
