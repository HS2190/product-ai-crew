# 기획 프로세스 워크플로우 (PLAN)

- **순서**: 0 → 1 Researcher → 2 PM → 3 기획자. 순서 · 필드 · 검수 처리 · 상한은 `CLAUDE.md` 단계 계약표가 정본이다.
- **언제**: 리서치 + PRD + 화면 기획까지 필요할 때 (디자인 전 단계)

```
"PRD랑 화면 기획서까지만 만들어줘."
"[기능명] 요구사항 정리하고 화면 기획까지 진행해줘."
"디자인은 나중에, 지금은 기획 문서만 필요해."
```

## 0. 시작 점검

- 서비스명 · 기능명 · platform을 정하고, 사용자가 가진 리서치 자료(인터뷰 · 설문 · 티켓)를 물어 `research_input`으로 넘긴다.

## 1. Researcher

역할 정본: `agents/researcher/CLAUDE.md`

**입력**: `task` · 서비스명 · 기능명 · `research_input` · 공통 입력

| 산출물 | 경로 |
|-------|------|
| 리서치 종합 | `[프로젝트]/researcher/research-synthesis-v1.0.md` |
| key_insights · competitor_findings | 종합 문서 안 |

**완료 조건**
- [ ] research-synthesis 형식으로 종합 완료
- [ ] 경쟁사 / 기존 도구 분석 완료
- [ ] 관찰과 해석 분리, 추정 · 한계 명시
- [ ] PM이 인용할 수 있는 key_insights 정리

**검수**: `review.py --stage researcher`. rollback 대상 없음 (입력 자료 문제면 escalate).

## 2. PM

역할 정본: `agents/pm/CLAUDE.md`

**입력**: `research_path` · `key_insights` · 서비스명 · 기능명 · `business_goal` · `target_user` · `platform`

| 산출물 | 경로 |
|-------|------|
| PRD (기능 목록 · 우선순위 · In/Out of Scope · KPI · brand_direction 포함) | `[프로젝트]/pm/PRD/PRD-[서비스명]-[기능명]-v1.0.md` |
| 확인 필요 | `[프로젝트]/open-items.md` |

**완료 조건**
- [ ] 기능 목록 · 우선순위 확정 (Must Have / Should Have / Nice to Have, Must 1개 이상)
- [ ] In Scope / Out of Scope 구분 (제외 사유 포함)
- [ ] KPI/OKR 정의
- [ ] `[확인 필요]`가 `open-items.md`에 ID로 정리

**검수**: `review.py --stage pm`. rollback 대상: researcher.

## 3. 기획자

역할 정본: `agents/planner/CLAUDE.md`

**입력**: `prd_path` · `feature_list` · `priority` · `platform` · `brand_direction`

| 산출물 | 경로 |
|-------|------|
| 화면 기획안 (화면 목록 · 화면별 목적 · 텍스트 와이어 · 흐름 Mermaid, 정상 · 예외 갈래) | `[프로젝트]/planner/screen-plan-v1.0.md` |
| 기능 명세서 (기능 ID · 상태 정의 · 예외 처리 · 공통 규칙 · 설정값 CFG) | `[프로젝트]/planner/feature-spec-v1.0.md` |
| 확인 필요 | `[프로젝트]/open-items.md` (없으면 「없음」) |

**완료 조건**
- [ ] PRD In Scope 기능이 모두 화면 · 기능 ID로 잡힘
- [ ] 흐름에 정상 · 예외 갈래와 화면 간 전이(트리거 · 조건 · 뒤로가기)
- [ ] feature-spec에 모든 상태(empty / loading / error / disabled / 성공, 해당 없으면 사유)와 예외 처리. 예외 · 상태 표는 여기에만
- [ ] 기준값은 CFG 표에만
- [ ] `[확인 필요]`는 근거 없이 임의 확정하지 않고 `open-items.md`에 ID로 (`agents/planner/CLAUDE.md` 「확인 필요 모으기」)

**검수**: `review.py --stage planner`. rollback 대상: pm · researcher.

## 이어서

- 디자인이 필요하면 DESIGN 모드를 이어 붙인다. 처음부터 구현까지 필요하면 FULL이 낫다.
