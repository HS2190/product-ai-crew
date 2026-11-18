# 커스텀 워크플로우 (CUSTOM)

- **순서**: 사용자가 정한다. 각 단계의 입력 · 내는 것 · 검수는 `CLAUDE.md` 단계 계약표를 그대로 쓴다(검수는 기본 on, "검수 빼고"면 off).
- **언제**: 중간 단계를 건너뛸 때(예: 기획자 없이 PM → 디자이너), 특정 에이전트를 반복할 때, 여러 에이전트로 아이디어를 동시에 탐색할 때, 표준 파이프라인 밖의 실험

```
"CUSTOM 모드로 [에이전트A] → [에이전트B] 순서로 실행해줘."
"[에이전트A]와 [에이전트B]를 병렬로 실행해줘."
"[에이전트A]만 호출해줘. 인풋은 [내용]이야."
```

## 에이전트 키워드

| 키워드 | 에이전트 (`subagent_type`) | 역할 정본 | 내는 것 |
|-------|---------------------------|----------|--------|
| `researcher` / `리서처` | researcher | `agents/researcher/CLAUDE.md` | 리서치 종합 |
| `pm` | pm | `agents/pm/CLAUDE.md` | PRD |
| `planner` / `기획자` | planner | `agents/planner/CLAUDE.md` | `screen-plan-v1.0.md` · `feature-spec-v1.0.md` · `open-items.md` |
| `ux-writer` / `UX라이터` | ux-writer | `agents/ux-writer/CLAUDE.md` | 라이팅 가이드 · 문구 시트 |
| `designer` / `디자이너` | designer | `agents/designer/CLAUDE.md` | 디자인 · 컴포넌트 스펙 |
| `engineer` / `엔지니어` | engineer | `agents/engineer/CLAUDE.md` | 코드 · 실행 명령 |
| `qa` | qa | `agents/qa/CLAUDE.md` | 테스트 케이스 · 리포트 |

> 검수는 서브에이전트가 아니다. 메인 세션이 `scripts/review.py --stage [역할]`을 직접 돌린다. 건너뛴 상류는 rollback 대상에서 빠지고, 그 단계 문제면 escalate한다.

## 병렬 규칙

병렬 = Agent 도구로 서브에이전트(`.claude/agents/`)를 한 번에 여러 개 호출. 호출 간에 대화가 이어지지 않으므로 필요한 입력은 모두 넘긴다(공통 필드는 `CLAUDE.md` 「서브에이전트 호출 형식」).

**병렬 가능**: 서로의 산출물을 입력으로 쓰지 않고, 같은 파일을 고치지 않을 때

| 조합 | 설명 |
|------|------|
| PM + UX라이터 | PM은 PRD 작성, UX라이터는 기존 화면 문구 검토 |
| 기획자 + UX라이터 | 기획자는 신규 화면 기획, UX라이터는 기존 화면 문구 정비 |
| 디자이너 + UX라이터 | 디자이너는 화면 디자인, UX라이터는 별도 화면 문구 작성 |

**순서 필수**: 앞 산출물이 뒤의 입력이거나 같은 파일을 고칠 때 (파일 경로가 겹치면 순차로 바꾼다)

| 순서 | 이유 |
|------|------|
| PM → 기획자 | 기획자는 PRD를 입력으로 받음 |
| 기획자 → UX라이터 | UX라이터는 screen-plan · feature-spec(상태 · 예외)을 입력으로 받음 |
| 기획자 → 디자이너 | 디자이너는 screen-plan · feature-spec을 입력으로 받음 |
| UX라이터 → 디자이너 | 디자이너는 문구 시트 문구로 화면을 그림 (FULL) |

- 병렬 결과는 호출마다 끝나는 대로(존재 게이트 · 검수까지) `session.md`에 적는다.
- 하나가 `blocked` · `needs_input`이면 그 호출만 멈추고 사용자에게 보고한다. 의존이 없는 나머지는 계속, 그 결과를 기다리는 호출은 함께 멈춘다.

## 조합 예시

**1. PM → UX라이터 (문구 방향 먼저)**: 기획 · 디자인 전에 브랜드 톤앤매너와 보이스 가이드 초안을 먼저 잡을 때.

```
PM          입력: 서비스명 · 비즈니스 목표 · 타겟 사용자 · platform   →  brand_direction (PRD 안)
  ↓ brand_direction
UX라이터     입력: brand_direction · 기존 보이스 가이드(있으면) · PRD  →  writing-guide 초안
             (screen_plan · feature_spec은 `해당 없음 (기획 전)`, copy_sheet는 내지 않음 → 게이트는 writing_guide만)
```
UX라이터가 PM 결과를 쓰므로 순차로 실행한다.

**2. 기획자 → 디자이너 반복 (빠른 프로토타이핑)**: PRD가 있고 기획과 디자인을 빠르게 돌릴 때.

```
사이클 N:  기획자 (screen-plan · feature-spec 수정)  →  디자이너 (화면 디자인 수정)  →  피드백
```
- 사이클마다 기획 → 디자인 순서를 지킨다. 반복 횟수는 사용자가 정한다.
- 같은 파일을 고친다(버전 번호는 그대로, 맨 위 `수정:` 줄). 사이클 사이 피드백은 `review_notes`로 넘긴다.

**3. 전체 롤 동시 브레인스토밍 (초기 탐색)**: PM · 기획자 · 디자이너 · UX라이터를 병렬로, 각자 관점의 초기 제안(우선순위 초안 · 화면 흐름 초안 · UI 방향 · 보이스 방향)을 받는다.

- 결정이 아닌 탐색이다. 오케스트레이터가 제안을 모아 정리해 보고하고, 사용자가 방향을 정한 뒤 정식 모드(FULL / PLAN 등)를 실행한다.
