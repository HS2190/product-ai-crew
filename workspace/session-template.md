# session.md 양식

오케스트레이터가 `[프로젝트]/session.md`를 만들 때 이 양식을 복사한다. **상태판이다. 길게 쓰지 않는다.** 대화 · 결정 · 시행착오는 `[프로젝트]/log.md`에 날짜별로.

```markdown
# 작업 세션

service: [서비스명]
company: [회사명]   # 기억층 회사 식별용 (workspace/_memory/companies/[회사명]/). 개인 작업이면 personal
design_system: [스킬 경로 또는 none]   # 「디자인 시스템 정하기」
platform: mobile / web / both
tech_stack: [Engineer 단계가 있으면 0단계에서 확인한 값]
figma: [5a에서 받은 링크 또는 스킵]
feature: [기능명]
mode: RESEARCH / FULL / PLAN / DESIGN / BUILD / WRITE / CUSTOM
status: in_progress / paused / handed_off / complete   # paused · handed_off면 뒤에 사유
started_at: YYYY-MM-DD
updated_at: YYYY-MM-DD

## 진행 상태

| # | 단계 | 상태 | 검수 결과 | 검수 파일 | 완료일 |
|---|------|------|----------|----------|-------|
| 1 | Researcher | pending | - | - | - |
| 2 | PM | pending | - | - | - |
| 3 | 기획자 | pending | - | - | - |
| 4 | UX 라이터 | pending | - | - | - |
| 5 | 디자이너 | pending | - | - | - |
| 5c | 가상 사용자 점검 | pending | (판정 없음) | - | - |
| 6 | Engineer | pending | - | - | - |
| 7 | QA | pending | - | - | - |

> 모드에 없는 단계는 행을 지우거나 `skipped (사유)`. 적는 예: `complete · revise→pass · reviews/researcher-02.md · 2026-05-04`.
> 검수 결과 표기: `pass` / `revise(N)` / `rollback(N)` / `escalate`. 반복되면 `revise→pass`처럼 최종까지 남기고, 사용자가 뒤집었으면 `pass(사용자 revise 지시)`처럼 적는다.

## 횟수 (상한 2 — 대화가 끊겨도 이 값으로 이어 간다)

| 종류 | 대상 | 횟수 |
|------|-----|-----|
| revise | (단계) | 0 |
| rollback (되돌린 대상별) | (상류 역할) | 0 |
| QA 재테스트 | qa | 0 |

> 단계 · 대상마다 한 줄씩 추가한다. 예: `revise · planner · 1`.

## 산출물 경로

| 단계 | 산출물 | 경로 |
|------|-------|------|
| PM | PRD | [프로젝트]/pm/PRD/PRD-...-v1.0.md |
| 기획자 | 화면 기획안 | [프로젝트]/planner/screen-plan-v1.0.md |
| 기획자 | 기능 명세서 | [프로젝트]/planner/feature-spec-v1.0.md |

## 다음

next_step: 3
next_agent: planner
waiting_for: (멈춰 있으면 무엇을 기다리는지 — 사용자 결정 · 외부 준비물)

## 컨텍스트 요약 (30줄 이내)

다음 에이전트가 이것만 읽고 이어갈 수 있게: 범위 · 확정된 결정 · 열린 질문 ID(`open-items.md`) · 브랜드 방향.
자세한 경위는 log.md에.
```
```
