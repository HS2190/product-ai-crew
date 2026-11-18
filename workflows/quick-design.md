# 빠른 디자인 워크플로우 (DESIGN)

- **순서**: 0 → (3 기획자, 기획안 보완이 필요할 때) → 5a → 5 디자이너 → 5b
- **사용 상황**: PRD와 기획 방향이 이미 있고 디자인 작업만 할 때
- 순서 · 필드 · 게이트 · 상한 · 검수 처리는 `CLAUDE.md` 「단계 계약표」 · 「검수」가 정본이다. 이 문서는 단계별 산출물과 완료 조건만 적는다.

```
"기획안은 이미 있어. 디자인만 해줘."
"기능 명세서 있어, 화면 디자인만 해줘."
```

**선행 조건** (0단계에서 확인, 없으면 사용자에게 확인 후 진행)
- [ ] 기존 PRD 또는 기능 요구사항 문서
- [ ] 화면 기획(`planner/screen-plan-v1.0.md`) 또는 그에 해당하는 기획안 (없으면 기획자가 먼저 작성)
- [ ] 대상 플랫폼 확정 (`mobile` / `web` / `both`)

### 3 기획자: 기획안 검토 · 보완 (`agents/planner/CLAUDE.md`)

**입력**: 기존 PRD 또는 요구사항 · 기존 기획안(파일 경로, Figma면 메인 세션이 `_shots/planner/`에 캡처) · `platform` · 브랜드 방향(`pm/` PRD 또는 사용자 제공)

| 산출물 | 경로 |
|-------|------|
| 화면 기획: 화면 목록 + 화면별 구성(텍스트 와이어) + 흐름(텍스트 다이어그램) | `planner/screen-plan-v1.0.md` |
| 기능 명세: 기능 · 상태 · 예외 · 공통 규칙 · 설정값(CFG) | `planner/feature-spec-v1.0.md` |
| 확인 필요 · 미정 | `open-items.md` (없으면 「없음」) |

**완료 조건**
- [ ] 기존 기획안의 누락 항목 보완, 디자이너 전달 가능 상태
- [ ] 기능 명세에 상태 · 예외 처리 포함
- [ ] 미정 항목은 open-items ID로만 가리킴

**검수**: `--stage planner` · rollback 대상 없음(기존 PRD 문제면 escalate)

### 5a Figma 링크 · 디자인 시스템 확정 (메인)

`CLAUDE.md` 5a. 산출: `figma_link` 또는 '스킵', `design_skill`. 참고할 기존 Figma 화면은 `[프로젝트]/_shots/designer/`에 캡처해 `shots_dir`로 넘긴다.

**문구 출처**: DESIGN에는 UX라이터 단계가 없다. `copy_sheet`가 있으면 넘기고, 없으면 디자이너가 기획안 문구를 쓰고 없는 문구는 `[문구 필요]`로 둔다(임시 문구 금지). 많이 비면 WRITE(4)를 디자이너 앞에 붙일지 묻는다(`CLAUDE.md` 「실행 모드」).

### 5 디자이너 (`agents/designer/CLAUDE.md`)

**입력**: `screen_plan` · `feature_spec` · `platform` · `brand_direction` · `copy_sheet`(있을 때) · `design_skill` · `figma_link` · `shots_dir`

| 산출물 | 경로 |
|-------|------|
| 디자인 스펙 | `designer/design-spec-v1.0.md` |
| 컴포넌트 스펙 | `designer/component-spec-v1.0.md` |
| 디자인 QA | `designer/design-qa-v1.0.md` |
| Figma 드로잉 플랜 (figma_link 받았을 때) | `designer/figma-draw-plan-v1.0.md` |

**완료 조건**
- [ ] design_spec · component_spec 완료 (전 화면 · 전 컴포넌트)
- [ ] 임시 문구 없음 (문구 출처가 없는 곳은 `[문구 필요]`)
- [ ] 컴포넌트 상태 정의 (default · hover(web) · pressed/active · focus · disabled · loading · error) · 디자인 QA 체크리스트 통과
- [ ] figma_link를 받았으면 figma_draw_plan 작성 후 5b까지

**검수**: 5b가 끝난 뒤 `--stage designer --image designer/review-shots/*.png` (Figma 스킵이면 `--image` 없이) · rollback → planner(3을 돌렸을 때만. 건너뛰었으면 기획안 문제를 escalate)

### 5b Figma 그리기 · 캡처 (메인, figma_link 받았을 때만)

`CLAUDE.md` 5b. 산출: `figma_url`(실제 그린 노드 링크) · `designer/review-shots/*.png`. figma_link가 없으면 생략하고 `figma_url: N/A (사유)`.

## 전체 완료 조건

- [ ] 기획 산출물(screen-plan · feature-spec) 준비
- [ ] 디자이너 스펙 완료, figma_link를 받았으면 5b 그리기 · 캡처까지
- [ ] 각 단계 검수 `pass` (또는 escalate 시 사용자 판단 완료) → `CLAUDE.md` 「완료 보고」

구현까지 원하면 확인 후 6 Engineer를 이어 붙인다(`workflows/build-process.md`). 문구 작업이 더 필요하면 WRITE 모드를 추가한다.
