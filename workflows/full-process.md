# 전체 프로세스 워크플로우 (FULL)

## 개요

- **실행 모드**: FULL
- **호출 순서**: Researcher → PM → 기획자 → UX라이터 → (5a Figma 링크 · 디자인 시스템 확정) → 디자이너 → (5b Figma 그리기 · 캡처) → (5c 가상 사용자 점검) → Engineer → QA
- **사용 상황**: 신규 서비스 출시 또는 대형 기능 추가 (구현 · 검증까지)
- **오케스트레이터 참조**: `CLAUDE.md`

---

## 사용 예시

```
"[서비스명] 앱에 '[기능명]' 기능을 새로 만들려고 해. 전체 프로세스 진행해줘."
"신규 서비스 온보딩 플로우를 처음부터 끝까지 만들어줘."
"[서비스명] [기능명] 기획부터 UX 라이팅까지 전부 해줘."
```

---

## 단계별 실행 정의

### Step 1 — Researcher 에이전트

**역할 참조**: `agents/researcher/CLAUDE.md`
**활용 스킬**: `plugins/design/skills/user-research/SKILL.md`, `plugins/design/skills/research-synthesis/SKILL.md`

**인풋**

| 항목 | 설명 |
|------|------|
| 서비스명 | 작업 대상 서비스 이름 |
| 기능명 | 리서치 주제 또는 구현할 기능 |
| 리서치 자료 | 사용자 제공 자료 경로 (인터뷰·설문·티켓 등). 없으면 비움 |
| 페르소나 | `[프로젝트]/persona.md` (있을 때) |

**필수 아웃풋**

| 산출물 | 저장 경로 |
|-------|---------|
| 리서치 종합 | `[프로젝트]/researcher/research-synthesis-v1.0.md` |
| 핵심 인사이트 (key_insights) | 종합 문서 내 포함 |
| 경쟁사 분석 (competitor_findings) | 종합 문서 내 포함 |
| insight → opportunity 매핑 | 종합 문서 내 포함 |

**완료 조건**

- [ ] 리서치 종합 문서 작성 완료 (research-synthesis 형식)
- [ ] 경쟁사/기존 도구 분석 완료 (무엇을 하고 무엇이 비었는지)
- [ ] 관찰과 해석 분리, 추정·한계 명시
- [ ] PM이 인용할 수 있는 key_insights 정리됨

**Reviewer 검수**

- 산출물 완료 후 메인 세션이 `scripts/review.py`로 근거 품질 비평 (기준 `agents/reviewer/CLAUDE.md`)
- pass → 다음 Step / revise → 현재 Step 재작업 (최대 2회) / rollback → 해당 없음 (첫 단계) / escalate → 사용자 판단

**다음 에이전트로 전달**

- 리서치 종합 문서 경로 (`research_path`)
- 핵심 인사이트 (`key_insights`)
- 경쟁사 분석 요약 (`competitor_findings`)

---

### Step 2 — PM 에이전트

**역할 참조**: `agents/pm/CLAUDE.md`

**인풋** (Researcher 아웃풋 + 사용자 인풋)

| 항목 | 설명 |
|------|------|
| 리서치 종합 (research_path) | Researcher 아웃풋 |
| 핵심 인사이트 (key_insights) | Researcher 아웃풋 — 문제 정의·우선순위 근거 |
| 서비스명 | 작업 대상 서비스 이름 |
| 기능명 | 구현할 기능 또는 스프린트 주제 |
| 비즈니스 목표 | 이 기능이 해결하는 비즈니스 문제 |
| 타겟 사용자 | 페르소나 또는 사용자 유형 |

**필수 아웃풋**

| 산출물 | 저장 경로 |
|-------|---------|
| PRD | `[프로젝트]/pm/PRD/PRD-[서비스명]-[기능명]-v1.0.md` |
| 기능 목록 및 우선순위 | PRD 내 포함 |
| In Scope / Out of Scope | PRD 내 포함 |
| 브랜드 방향성 | PRD 내 포함 또는 별도 전달 |

**완료 조건**

- [ ] PRD 작성 완료
- [ ] 기능 목록 및 우선순위 확정 (Must Have / Should Have / Nice to Have)
- [ ] In Scope / Out of Scope 명확히 구분됨
- [ ] KPI/OKR 정의됨
- [ ] `[확인 필요]` 항목 목록 정리됨

**Reviewer 검수**

- 산출물 완료 후 메인 세션이 `scripts/review.py`로 내용 품질 비평 (기준 `agents/reviewer/CLAUDE.md`)
- pass → 다음 Step / revise → 현재 Step 재작업 (최대 2회) / rollback → 상류 Step 재호출 후 하류로 재진행 (같은 상류 최대 2회) / escalate → 사용자 판단

**다음 에이전트로 전달**

- PRD 파일 경로
- 기능 목록
- 우선순위
- 타겟 플랫폼
- 브랜드 방향성

---

### Step 3 — 기획자 에이전트

**역할 참조**: `agents/planner/CLAUDE.md`

**인풋** (PM 아웃풋)

| 항목 | 출처 |
|------|------|
| PRD | PM 아웃풋 |
| 기능 목록 | PM 아웃풋 |
| 우선순위 | PM 아웃풋 |
| 타겟 플랫폼 | 사용자 제공 또는 PRD 내 명시 |

**필수 아웃풋**

| 산출물 | 저장 위치 |
|-------|---------|
| 화면 기획안 | `[프로젝트]/planner/` (md) |
| 기능 명세서 | `[프로젝트]/planner/` |
| User Flow | `[프로젝트]/planner/` (md. Figma · FigJam으로 필요하면 메인 세션이 그림) |
| 와이어프레임 | `[프로젝트]/planner/` (md. Figma 와이어가 필요하면 메인 세션이 그림) |

**완료 조건**

- [ ] 모든 화면 기획안 작성 완료
- [ ] 기능 명세서 작성 완료 (예외 처리 포함)
- [ ] User Flow 시각화 완료
- [ ] Empty State 정의됨
- [ ] `[확인 필요]` 항목 해소 완료

**Reviewer 검수**

- 산출물 완료 후 메인 세션이 `scripts/review.py`로 내용 품질 비평 (기준 `agents/reviewer/CLAUDE.md`)
- pass → 다음 Step / revise → 현재 Step 재작업 (최대 2회) / rollback → 상류 Step 재호출 후 하류로 재진행 (같은 상류 최대 2회) / escalate → 사용자 판단

**다음 에이전트로 전달**

- 화면 기획안 경로
- 기능 명세서 경로
- 플랫폼별 예외 사항

---

### Step 4 — UX 라이터 에이전트

**역할 참조**: `agents/ux-writer/CLAUDE.md`

**인풋** (기획자 아웃풋 + PM 브랜드 방향성) — 디자인 전에 문구를 먼저 확정한다

| 항목 | 출처 |
|------|------|
| 화면 기획안 | 기획자 아웃풋 |
| 기능 명세서 (상태·예외 정의 포함) | 기획자 아웃풋 |
| 브랜드 방향성 및 톤앤매너 | PM 아웃풋 |
| 기존 보이스 가이드 | `[프로젝트]/ux-writer/writing-guide-v1.0.md` (있는 경우) |

**필수 아웃풋**

| 산출물 | 저장 위치 |
|-------|---------|
| UX 라이팅 가이드 | `[프로젝트]/ux-writer/writing-guide-v1.0.md` |
| 화면별 문구 시트 | `[프로젝트]/ux-writer/copy-sheet-v1.0.md` (파일 1개, 화면별 절) |

**완료 조건**

- [ ] 화면 기획안의 모든 화면·상태(빈 상태·에러·권한 거부 등) 문구 작성 완료
- [ ] 금지 표현 0건 확인
- [ ] 보이스 톤 일관성 확인 (`-해요` 체 통일)
- [ ] 컴포넌트별 문구 분류 완료 (`[버튼]`, `[에러]`, `[빈상태]` 등)
- [ ] 수정조사 유형(A~F) 표기 완료 (기준에 맞아 그대로 두는 문구는 `F. 유지`)

**Reviewer 검수**

- 산출물 완료 후 메인 세션이 `scripts/review.py`로 내용 품질 비평 (기준 `agents/reviewer/CLAUDE.md`)
- pass → 다음 Step / revise → 현재 Step 재작업 (최대 2회) / rollback → 상류 Step 재호출 후 하류로 재진행 (같은 상류 최대 2회) / escalate → 사용자 판단

**다음 에이전트로 전달**

- 화면별 문구 시트 경로 (`copy_sheet`) → 디자이너가 이 문구로 화면을 그린다
- UX 라이팅 가이드 경로

---

### Step 5a — Figma 링크 · 디자인 시스템 확정 (메인 세션)

디자이너 호출 직전에 메인 세션이 순서대로 정한다(오케스트레이터 CLAUDE.md 「Figma 링크 수령」 · 「디자인 스킬 선택 게이트」).

- **Figma 링크**: 사용자에게 디자인을 받을 Figma 페이지 링크를 받는다. '스킵'이거나 Figma MCP 미연결이면 `figma_link` 없이 진행한다.
- **디자인 시스템**: session.md `design_system`이 `none`이 아니면 그 스킬을 `design_skill`로 바로 쓴다. `none`이면 디자이너를 「추천만」 작업으로 먼저 호출해 `needs_input` 추천안을 받고, 사용자가 고른 스킬을 `design_skill`로 정해 session.md에 적는다.
- **기존 화면 캡처**: 참고 · 복제할 기존 Figma 화면이 있으면 `get_screenshot`으로 `[프로젝트]/_shots/designer/`에 저장해 `shots_dir`로 넘긴다.

---

### Step 5 — 디자이너 에이전트

**역할 참조**: `agents/designer/CLAUDE.md`

**인풋** (기획자 + UX라이터 아웃풋 + PM 브랜드 방향성)

| 항목 | 출처 |
|------|------|
| 화면 기획안 | 기획자 아웃풋 |
| 기능 명세서 | 기획자 아웃풋 |
| 타겟 플랫폼 | 기획자 아웃풋 |
| 화면별 문구 시트 (copy_sheet) | UX라이터 아웃풋 |
| 브랜드 방향성 | PM 아웃풋 또는 기존 디자인 시스템 |
| design_skill · figma_link · shots_dir | Step 5a (메인 세션) |

**필수 아웃풋**

| 산출물 | 저장 위치 |
|-------|---------|
| 디자인 스펙 | `[프로젝트]/designer/design-spec-v1.0.md` |
| 컴포넌트 스펙 | `[프로젝트]/designer/component-spec-v1.0.md` |
| Figma 드로잉 플랜 (figma_draw_plan) | `[프로젝트]/designer/` (figma_link 받았을 때. Figma에 그리는 건 Step 5b 메인 세션) |

**완료 조건**

- [ ] design_spec · component_spec 완료 (전 화면 · 전 컴포넌트), figma_link를 받았으면 figma_draw_plan 작성 후 Step 5b Figma 그리기까지
- [ ] 화면 문구는 문구 시트 문구 그대로 사용 (임시 문구 없음)
- [ ] 공간에 안 맞는 문구는 design_spec의 「문구 조정 요청」에 화면·위치·이유와 함께 표시
- [ ] 컴포넌트 상태 정의 완료 (default / active / disabled / error / loading)
- [ ] 디자인 QA 체크리스트 통과
- [ ] 디자인 스펙 문서 완료
- [ ] 반응형 처리 여부 확인 (웹인 경우)

**Reviewer 검수**

- Step 5b(그리기 · 캡처)가 끝난 뒤 메인 세션이 `scripts/review.py`로 내용 품질 비평 (기준 `agents/reviewer/CLAUDE.md`, 화면은 `--image designer/review-shots/*.png`). Figma를 스킵했으면 5b 없이 스펙만으로(`--image` 없이) 검수
- pass → 다음 Step / revise → 현재 Step 재작업 (최대 2회) / rollback → 상류 Step 재호출 후 하류로 재진행 (같은 상류 최대 2회) / escalate → 사용자 판단

**문구 조정 요청 처리**

- design_spec에 「문구 조정 요청」이 있으면 오케스트레이터가 UX라이터에게 **해당 줄만** 다시 다듬게 하고(전체 재작업 아님), 디자이너가 바뀐 문구를 반영한다. 문구 시트와 Figma 문구는 항상 같아야 한다.

**다음 에이전트로 전달**

- `figma_url` (Step 5b에서 메인 세션이 채움. Figma를 스킵했으면 `N/A (사유)`)
- 화면 캡처 `shots_dir` (Step 5b `designer/review-shots/`)
- 디자인 스펙 경로
- 컴포넌트 스펙 경로

---

### Step 5b — Figma 그리기 · 캡처 (메인 세션, figma_link 받았을 때만)

- 디자이너의 `figma_draw_plan`대로 메인 세션이 Figma에 그린다: Variables(토큰) → 컴포넌트+Variant → 전 화면 → 핸드오프 주석 (오케스트레이터 CLAUDE.md 「Figma 드로잉 위임」).
- 그린 노드 링크를 `figma_url`로 채운다(받은 `figma_link`를 그대로 옮기면 안 됨).
- 핵심 화면을 `get_screenshot`으로 받아 `[프로젝트]/designer/review-shots/`에 PNG로 저장한다. 디자이너 검수(`--image`) · Engineer(`shots_dir`)가 이 캡처를 쓴다.
- figma_link가 없으면(스킵/미연결) 이 단계를 생략하고 `figma_url: N/A (사유)`.

---

### Step 5c — 가상 사용자 점검 (오케스트레이터 수행, 판정 없음)

**활용 스킬**: `user-voice-sim` (별도 설치 스킬, `~/.claude/skills/user-voice-sim` — 없으면 이 단계는 건너뛰고 사유만 보고)

디자이너 시안이 Reviewer를 통과하면(Step 5b 그리기 이후), 디자인을 모르는 사용자 눈으로 핵심 화면을 한 번 본다. Reviewer(전문가 시선)와 겹치지 않는 **사용자 시선** 점검이다. 통과 / 반려 권한은 없고 참고 자료만 낸다.

**실행 조건**

- `figma_url`이 있을 때만 실행한다(화면 이미지가 필요). Figma를 스킵했으면 이 단계도 건너뛰고 보고에 "가상 사용자 점검 생략 (화면 없음)"을 남긴다.
- 스킬이 설치돼 있지 않으면 건너뛰고 설치 안내(`user-voice-sim` 레포의 `install.sh`)를 보고에 남긴다.
- 네이티브 서브에이전트는 Figma에 접근하지 못하므로 **메인 세션(오케스트레이터)이 스킬을 실행**한다. 스킬이 화면을 캡처해 페르소나별 서브에이전트에 넘긴다.

**인풋**

| 항목 | 출처 |
|------|------|
| 핵심 과업 흐름 화면 3~5장 | 디자이너 Figma (화면 기획안의 핵심 과업 흐름 순서) — 전 화면을 넣지 않는다(비용) |
| 페르소나 | `persona_path` (크루와 같은 파일) |
| 과업 | PRD 핵심 유저 스토리 1~2개 (예: "증상 입력 후 상담 신청하기") |
| 서비스 맥락 | 앱 이름 · 한 줄 설명만 (기획 의도 · 화면 설명 전달 금지) |
| 모드 | 고객용 앱 = 일반 서비스 / 관리자 · 운영 도구 = 업무 도구 |
| A/B | 디자이너가 두 안을 냈으면 A/B 비교로 실행 |

**아웃풋**

| 산출물 | 저장 위치 |
|-------|---------|
| 가상 사용자 인터뷰 결과 | `[프로젝트]/feedback-sim/YYYY-MM-DD-[화면].md` |

**결과 처리**

- 스킬 기본대로 **Claude · Codex 두 모델**이 각각 실행한다(사용자가 모델을 지정하면 그 모델만).
- 신뢰도 **높음**(두 모델 모두 같은 곳에서 막힘)만 수정 제안으로 사용자에게 보여 준다. 원인별로 넘길 곳을 붙인다. Codex가 실패해 한 모델 결과만 있으면 보고에 "단일 모델 — 교차 확인 없음"을 남긴다.
  - 문구 때문에 오해 → UX라이터가 해당 줄만 다시 다듬음 → 디자이너가 반영 (Step 5 「문구 조정 요청 처리」와 같은 방식, Figma 반영은 메인 세션)
  - 배치 · 위계 · 숨은 조작 때문에 막힘 → 디자이너가 해당 화면 수정
- **사용자가 승인한 것만** 넘기고, 이 왕복은 1회로 끝낸다. 중간 · 낮음은 보고에 메모로만 남긴다.
- 실제 UT를 대신하지 않는다. 결과의 「실제 UT로 확인할 질문」은 보고에 그대로 포함한다.

---

### Step 6 — Engineer 에이전트

**역할 참조**: `agents/engineer/CLAUDE.md`
**활용 스킬**: `skills/frontend-design/SKILL.md`, `skills/react-components/SKILL.md`, `skills/shadcn-ui/SKILL.md`, `skills/impeccable/`

**인풋** (디자이너 + UX라이터 아웃풋)

| 항목 | 출처 |
|------|------|
| 디자인 스펙 (design_spec) | 디자이너 아웃풋 |
| 컴포넌트 스펙 (component_spec) | 디자이너 아웃풋 |
| 화면 캡처 (shots_dir) | Step 5b에서 메인 세션이 저장한 캡처 (Figma를 스킵했으면 없음. Engineer는 Figma를 직접 보지 않음) |
| 화면 문구 (copy_sheet) | UX라이터 아웃풋 |
| platform | 0단계 확정값 (`mobile` / `web` / `both`) |
| 기술 스택 (tech_stack) | 사용자 지정 또는 기본 React+Vite+TS |
| bug_report | QA 재작업일 때만. QA 리포트 경로 + 고칠 버그 ID (ID별 재현 절차 · 기대 결과) |

**필수 아웃풋**

| 산출물 | 저장 위치 |
|-------|---------|
| 구현 코드 | `[프로젝트]/engineer/` (빌드/실행 가능) |
| 빌드 결과 (build_status) | pass (fail이면 blocked로 반환) |
| 실행 명령 (run_command) | 미리보기를 띄울 명령 (Engineer는 서버를 띄우지 않고, 메인 세션이 띄움) |
| 구현 노트 (implementation_notes) | 스펙 대비 차이·결정 사항 |

**완료 조건**

- [ ] 빌드 통과 (타입 · 린트 에러 0)
- [ ] 디자인 스펙·컴포넌트 스펙 반영
- [ ] UX라이터 문구 반영
- [ ] 접근성 반영 (색 외 단서·대비·키보드 접근)
- [ ] design_spec · 캡처와 대조해 스펙 일치 자가 확인 (스크린샷은 Playwright 등 도구가 있을 때만)
- [ ] 백엔드 없이 mock/정적 데이터로 동작

**Reviewer 검수**

- 산출물 완료 후 메인 세션이 `scripts/review.py`로 구현 품질 비평 (기준 `agents/reviewer/CLAUDE.md`)
- pass → Step 7 QA / revise → 현재 Step 재작업 (최대 2회) / rollback → 상류 Step 재호출 후 하류로 재진행 (같은 상류 최대 2회) / escalate → 사용자 판단

**다음 에이전트로 전달**

- `code_path` · `run_command` · `implementation_notes` (메인 세션이 `run_command`로 미리보기를 띄우고 그 주소를 `preview_url`로 QA에 넘김)

---

### Step 7 — QA 에이전트

**역할 참조**: `agents/qa/CLAUDE.md`
**활용 스킬**: `skills/practice-notes/checklists/qa.md`

**인풋** (기획자 + UX라이터 + 디자이너 + Engineer 아웃풋)

| 항목 | 출처 |
|------|------|
| 기능 명세서 · 화면 기획안 | 기획자 아웃풋 (기대 결과의 근거) |
| 문구 시트 (copy_sheet) | UX라이터 아웃풋 |
| 디자인 스펙 (design_spec) | 디자이너 아웃풋 |
| code_path · run_command | Engineer 아웃풋 |
| preview_url | 메인 세션이 띄운 미리보기 주소 (없으면 QA가 자기 실행 안에서 띄우고 끝날 때 종료) |
| implementation_notes | Engineer 아웃풋 (스펙과 다르게 정한 것 — 버그로 오판 방지) |
| platform | 0단계 확정값 |

**필수 아웃풋**

| 산출물 | 저장 위치 |
|-------|---------|
| 테스트 케이스 | `[프로젝트]/qa/test-cases-v1.0.md` |
| QA 리포트 | `[프로젝트]/qa/qa-report-v1.0.md` |
| 증거 · 스크립트 | `[프로젝트]/qa/evidence/`, `qa/scripts/` (Playwright는 `qa/runner/`에 따로 설치) |
| qa_status | pass (치명 · 주요 0건) / fail |

**완료 조건**

- [ ] 테스트 케이스마다 기대 결과의 근거 문서 표시
- [ ] 비정상 상황(연타 · 권한 우회 · 없는 대상 · 입력값 · 중단 복귀 · 네트워크 · 화면 크기 · 반영) 해당하는 만큼 실행
- [ ] 탐색적 테스트 세션 1회 이상 (차터 + 메모)
- [ ] 버그와 「기획 확인」 분리, 버그마다 재현 절차 · 기대 / 실제 · 증거 · 심각도
- [ ] 실행 못 한 케이스는 `실행 못함 (이유)` 표시

**Engineer와 왕복**

- `qa_status: fail` → 구현 버그를 Engineer에 `bug_report`(QA 리포트 경로 + 버그 ID, ID별 재현 절차 · 기대 결과)로 넘겨 수정 → QA 재테스트(`retest_of`, 고친 버그 + 연관 기능 + 핵심 흐름). **최대 2회**(session.md 「횟수」 표에 기록), 그래도 치명 · 주요가 남으면 사용자 판단
- 「기획 확인」은 Engineer에게 넘기지 않고 사용자에게 보고

**Reviewer 검수**

- 위 「Engineer와 왕복」(fail 루프)을 먼저 끝내고, **마지막 QA 산출물에만** 메인 세션이 `scripts/review.py`로 품질 비평 1회 (기준 `agents/reviewer/CLAUDE.md`)
- pass → 파이프라인 종료 / revise → 현재 Step 재작업 (최대 2회) / rollback → 상류 Step 재호출 후 하류로 재진행 (같은 상류 최대 2회) / escalate → 사용자 판단

**파이프라인 종료**

- 동작하는 프론트엔드 코드 + 테스트 케이스 · QA 리포트 → 오케스트레이터에 최종 보고
- **구현 코드와 QA 테스트 케이스 · 리포트가 FULL 모드의 최종 산출물이다.** 테스트 케이스는 개발 전달 때 개발팀에 함께 넘길 수 있다.

---

## 전체 완료 조건

- [ ] Researcher 리서치 종합 완료 및 저장
- [ ] PM PRD 완료 및 저장 (리서치 insights 인용)
- [ ] 기획자 화면 기획안 + 기능 명세서 완료
- [ ] UX 라이터 문구 + 가이드 완료
- [ ] 디자이너 스펙 문서 완료 (문구 시트 문구 반영), figma_link를 받았으면 Step 5b Figma 그리기 · 캡처까지
- [ ] 가상 사용자 점검 결과 저장 및 신뢰도 높음 항목 처리 (또는 생략 사유 기록)
- [ ] Engineer 구현 완료 (빌드 통과, 스펙·문구·접근성 반영)
- [ ] QA 검증 완료 (qa_status pass 또는 사용자 판단, 테스트 케이스 · 리포트 저장)
- [ ] 각 단계 Reviewer 검수 `pass` (또는 escalate 시 사용자 판단 완료)
- [ ] 오케스트레이터 작업 완료 보고 전달
