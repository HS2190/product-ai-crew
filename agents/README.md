# 에이전트 목록 · 흐름

Researcher → PM → 기획자 → UX라이터 → 디자이너 → Engineer → QA 7개 에이전트를 오케스트레이터(`../CLAUDE.md`)가 차례로 부른다. 단계마다 존재 검증 → 검수(Reviewer 기준, 메인 세션이 `scripts/review.py`로 Codex 실행)를 거친다. 범위는 리서치부터 프론트엔드 구현 · 검증(QA)까지.

- 순서 · 주고받는 필드 · 게이트 · 상한의 정본은 `../CLAUDE.md` 「단계 계약표」다. 이 문서와 다르면 그쪽을 따른다.
- 모든 에이전트 공통 규칙은 `_common.md`, 사용자가 직접 부를 때 보는 부록은 `[역할]/SOLO.md`(있는 역할만).
- 설치 · 호출 예시 · 기억층 · 폴더 구조는 레포 루트 `README.md`.

## 에이전트

| 에이전트 | 파일 | 하는 일 | 주요 산출물 |
|---------|------|--------|-----------|
| 오케스트레이터 | `../CLAUDE.md` | 모드 판단 · 단계 호출 · 게이트 · 검수 · Figma 읽기/그리기 (메인 세션) | session.md · 완료 보고 |
| Researcher | `researcher/CLAUDE.md` | 리서치 수집 · 종합, 경쟁 분석, insights 도출 | `researcher/research-synthesis-v1.0.md` |
| PM | `pm/CLAUDE.md` | 비즈니스 목표, PRD, 기능 우선순위, 브랜드 방향 | `pm/PRD/PRD-[서비스명]-[기능명]-v1.0.md` |
| 기획자 | `planner/CLAUDE.md` | 화면 기획(화면 목록 · 구성 · 흐름), 기능 명세(기능 · 상태 · 예외 · 공통 규칙 · CFG) | `planner/screen-plan-v1.0.md` · `planner/feature-spec-v1.0.md` |
| UX 라이터 | `ux-writer/CLAUDE.md` | 화면별 문구, 라이팅 가이드, 금지 표현 관리 | `ux-writer/copy-sheet-v1.0.md` · `writing-guide-v1.0.md` |
| 디자이너 | `designer/CLAUDE.md` | 디자인 스펙, 컴포넌트 스펙, Figma 드로잉 플랜 (그리기는 메인 세션) | `designer/design-spec-v1.0.md` · `component-spec-v1.0.md` · `figma-draw-plan-v1.0.md` |
| Engineer | `engineer/CLAUDE.md` | 프론트엔드 구현, 빌드 검증 (최종 산출물) | `engineer/` 코드 · `run_command` |
| QA | `qa/CLAUDE.md` | 구현 화면 실제 검증, 테스트 케이스 · 버그 리포트 (FULL 마지막) | `qa/test-cases-v1.0.md` · `qa-report-r1.md` |
| Reviewer | `reviewer/CLAUDE.md` | 단계별 검수 기준 (pass / revise / rollback / escalate). 서브에이전트가 아니라 Codex가 읽는 기준 문서 | `reviews/[단계]-[NN].md` |

## 흐름 (FULL)

```
0 시작 점검 (메인)
1 Researcher ─ 검수
2 PM ─ 검수
3 기획자 ─ 검수              screen-plan · feature-spec · open-items
4 UX 라이터 ─ 검수           copy-sheet
5a Figma 링크 · 디자인 시스템 확정 (메인)
5  디자이너                   design-spec · component-spec · figma-draw-plan
5b Figma 그리기 · 캡처 (메인) ─ 디자이너 검수 (review-shots 포함)
5c 가상 사용자 점검 (메인, 판정 없음)
6  Engineer ─ 검수            build pass · run_command
7  QA ↔ Engineer (fail이면 최대 2회 왕복) ─ 마지막 산출물만 검수
완료 보고
```

다른 모드(PLAN · RESEARCH · DESIGN · BUILD · WRITE · CUSTOM)의 순서는 `../CLAUDE.md` 「실행 모드」, 단계별 산출물 · 완료 조건은 `../workflows/`.

## 순서가 필요한 조합 (CUSTOM에서 병렬로 부르지 않기)

| 순서 | 이유 |
|------|------|
| PM → 기획자 | 기획자는 PRD를 인풋으로 받아야 함 |
| 기획자 → UX라이터 | UX라이터는 화면 기획 · 기능 명세(상태 · 예외)를 인풋으로 받아야 함 |
| 기획자 → 디자이너 | 디자이너는 화면 기획 · 기능 명세를 인풋으로 받아야 함 |
| UX라이터 → 디자이너 | 디자이너는 문구 시트 문구로 화면을 그려야 함 (FULL) |
| 디자이너 → Engineer → QA | 스펙이 부실하면 구현 품질도 떨어지고, QA는 동작하는 미리보기가 있어야 함 |

병렬 가능: PM + UX라이터(기존 화면 문구 검토), 기획자 + UX라이터(기존 화면 정비)처럼 서로의 산출물을 쓰지 않을 때만. 병렬 호출은 서브에이전트마다 인풋을 모두 넘긴다(대화 이력 공유 없음).
