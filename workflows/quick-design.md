# 빠른 디자인 워크플로우 (DESIGN)

## 개요

- **실행 모드**: DESIGN
- **호출 순서**: 기획자 → (Figma 링크 · 디자인 시스템 확정) → 디자이너 → (Figma 그리기 · 캡처)
- **사용 상황**: PRD와 기획 방향이 이미 존재할 때 디자인 작업만 진행
- **오케스트레이터 참조**: `CLAUDE.md`

---

## 사용 예시

```
"기획안은 이미 있어. 디자인만 해줘."
"이 PRD로 화면 기획이랑 디자인까지만 해줘."
"[Figma URL] 기획안 기반으로 디자인 완성해줘."
"기능 명세서 있어, 화면 디자인만 해줘."
```

---

## 사전 준비 조건

오케스트레이터가 DESIGN 모드를 실행하기 전 아래 항목이 준비되어 있어야 한다.

- [ ] 기존 PRD 또는 기능 요구사항 문서 존재
- [ ] 화면 기획안 또는 와이어프레임 존재 (없으면 기획자가 먼저 작성)
- [ ] 대상 플랫폼 확정 (`mobile` / `web` / `both`)

준비되지 않은 항목이 있으면 오케스트레이터가 사용자에게 확인 후 진행한다.

---

## 단계별 실행 정의

### Step 1 — 기획자 에이전트 (기획안 검토 및 보완)

**역할 참조**: `agents/planner/CLAUDE.md`

**인풋**

| 항목 | 설명 |
|------|------|
| 기존 PRD 또는 요구사항 | 파일 경로 또는 텍스트 |
| 기존 화면 기획안 | 파일 경로 또는 Figma URL (있는 경우) |
| 대상 플랫폼 | `mobile` / `web` / `both` |
| 브랜드 방향성 | `[프로젝트]/pm/` 내 PRD 참조 또는 사용자가 직접 제공 |

**수행 작업**

- 기존 기획안 검토 및 누락 항목 보완
- 기능 명세서 업데이트 또는 신규 작성
- 디자이너 전달용 산출물 정리

**필수 아웃풋**

| 산출물 | 저장 위치 |
|-------|---------|
| 화면 기획안 | `[프로젝트]/planner/` (md. Figma 정리가 필요하면 메인 세션이 그림) |
| 기능 명세서 | `[프로젝트]/planner/` |

**완료 조건**

- [ ] 화면 기획안 디자이너 전달 가능 상태 확인
- [ ] 기능 명세서 예외 처리 포함 완료
- [ ] `[확인 필요]` 항목 해소 완료

**Reviewer 검수**

- 산출물 완료 후 메인 세션이 `scripts/review.py`로 내용 품질 비평 (기준 `agents/reviewer/CLAUDE.md`)
- pass → 다음 Step / revise → 현재 Step 재작업 (최대 2회) / rollback → 해당 없음 (첫 단계, 기존 PRD 문제면 escalate) / escalate → 사용자 판단

**다음 에이전트로 전달**

- 화면 기획안 경로
- 기능 명세서 경로

---

### Step 1a — Figma 링크 · 디자인 시스템 확정 (메인 세션)

디자이너 호출 직전에 메인 세션이 순서대로 정한다(오케스트레이터 CLAUDE.md 「Figma 링크 수령」 · 「디자인 스킬 선택 게이트」).

- **Figma 링크**: 디자인을 받을 Figma 페이지 링크를 받는다. '스킵'이거나 Figma MCP 미연결이면 `figma_link` 없이 진행한다.
- **디자인 시스템**: session.md `design_system`이 `none`이 아니면 그 스킬을 `design_skill`로 바로 쓴다. `none`이면 디자이너를 「추천만」 작업으로 먼저 호출해 `needs_input` 추천안을 받고, 사용자가 고른 스킬을 `design_skill`로 정한다.
- **기존 화면 캡처**: 참고 · 복제할 기존 Figma 화면이 있으면 `get_screenshot`으로 `[프로젝트]/_shots/designer/`에 저장해 `shots_dir`로 넘긴다.
- **문구 출처**: DESIGN 모드에는 UX라이터 단계가 없다. `copy_sheet`가 있으면 넘기고, 없으면 디자이너는 기획안 문구를 쓰고 없는 문구는 `[문구 필요]`로 표시한다(임시 문구를 지어내지 않음). 문구가 많이 비면 라이터 단계(WRITE)를 디자이너 앞에 붙일지 사용자에게 묻는다.

---

### Step 2 — 디자이너 에이전트

**역할 참조**: `agents/designer/CLAUDE.md`

**인풋** (기획자 아웃풋)

| 항목 | 출처 |
|------|------|
| 화면 기획안 | 기획자 아웃풋 |
| 기능 명세서 | 기획자 아웃풋 |
| 타겟 플랫폼 | 사전 준비 항목 |
| 브랜드 방향성 | `[프로젝트]/pm/` 내 PRD 참조 또는 사용자가 직접 제공 |
| 문구 (copy_sheet) | 있을 때만. 없으면 기획안 문구, 없는 문구는 `[문구 필요]` (Step 1a) |
| design_skill · figma_link · shots_dir | Step 1a (메인 세션) |

**필수 아웃풋**

| 산출물 | 저장 위치 |
|-------|---------|
| 디자인 스펙 | `[프로젝트]/designer/design-spec-v1.0.md` |
| 컴포넌트 스펙 | `[프로젝트]/designer/component-spec-v1.0.md` |
| Figma 드로잉 플랜 (figma_draw_plan) | `[프로젝트]/designer/` (figma_link 받았을 때. Figma에 그리는 건 Step 2b 메인 세션) |

**완료 조건**

- [ ] design_spec · component_spec 완료 (전 화면 · 전 컴포넌트), figma_link를 받았으면 figma_draw_plan 작성 후 Step 2b Figma 그리기까지
- [ ] 임시 문구 없음 (문구 출처가 없는 곳은 `[문구 필요]` 표시)
- [ ] 컴포넌트 상태 정의 완료 (default / active / disabled / error / loading)
- [ ] 디자인 QA 체크리스트 통과
- [ ] 디자인 스펙 문서 완료

**Reviewer 검수**

- Step 2b(그리기 · 캡처)가 끝난 뒤 메인 세션이 `scripts/review.py`로 내용 품질 비평 (기준 `agents/reviewer/CLAUDE.md`, 화면은 `--image designer/review-shots/*.png`). Figma를 스킵했으면 2b 없이 스펙만으로(`--image` 없이) 검수
- pass → 파이프라인 종료 / revise → 현재 Step 재작업 (최대 2회) / rollback → 상류 Step 재호출 후 하류로 재진행 (같은 상류 최대 2회) / escalate → 사용자 판단

---

### Step 2b — Figma 그리기 · 캡처 (메인 세션, figma_link 받았을 때만)

- 디자이너의 `figma_draw_plan`대로 메인 세션이 Figma에 그리고, 그린 노드 링크를 `figma_url`로 채운다 (오케스트레이터 CLAUDE.md 「Figma 드로잉 위임」).
- 핵심 화면을 `get_screenshot`으로 `[프로젝트]/designer/review-shots/`에 PNG로 저장한다(검수 `--image`용).
- figma_link가 없으면 생략하고 `figma_url: N/A (사유)`.

**파이프라인 종료**

- 디자인 스펙 · 컴포넌트 스펙 (+ figma_url, 그렸을 때) 완료 → 오케스트레이터에 최종 보고

---

## 전체 완료 조건

- [ ] 기획자 산출물 준비 완료 (화면 기획안, 기능 명세서)
- [ ] 디자이너 스펙 문서 완료, figma_link를 받았으면 Step 2b Figma 그리기 · 캡처까지
- [ ] 각 단계 Reviewer 검수 `pass` (또는 escalate 시 사용자 판단 완료)
- [ ] 오케스트레이터 작업 완료 보고 전달

---

## 참고

디자인 결과물에 UX 문구 작업이 필요하면
오케스트레이터에게 `WRITE` 모드 추가 실행을 요청한다.

디자인 스펙을 **동작하는 코드로 구현**까지 원하면 `BUILD` 모드(또는 `디자이너 → Engineer` 연결)를 이어서 실행한다.
