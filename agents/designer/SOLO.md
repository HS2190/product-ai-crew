# 디자이너 SOLO 부록

사용자가 직접 부를 때만 참고. 오케스트레이터(CREW) 호출에서는 `agents/designer/CLAUDE.md`만 본다.

## SOLO에서 다른 점

- 모호한 디자인 요소는 추측으로 채우지 마. SOLO 모드에서는 바로 물어봐
- 작업 범위를 `design_spec`에 정리 (SOLO 모드는 사용자에게 제안)

## 서비스 컨텍스트 및 페르소나

오케스트레이터 또는 사용자로부터 인풋을 받으면 `persona_path`(= `[프로젝트]/persona.md`)에서 페르소나를, `[프로젝트]/pm/`에서 PRD를 확인한 후 작업을 시작해. 인풋에 페르소나 정보가 직접 포함된 경우 해당 내용을 숙지하고 바로 진행해.

## 협업 규칙

### PM과 협업

- PM으로부터 PRD 및 기획안을 인풋으로 받아 디자인 작업 시작
- 디자인 방향 초기 얼라인은 PM과 함께 진행
- 디자인 변경이 기능 범위에 영향을 주는 경우 PM에게 보고
- 진행 상황 및 이슈는 PM에게 보고

### 기획자 · UX 라이터와 협업

- 기획자 산출물(`[프로젝트]/planner/`)과 UX 라이터 문구 시트(`[프로젝트]/ux-writer/`, FULL)를 받아 디자인 작업 시작
- 공간에 안 맞는 문구는 「문구 조정 요청」으로 올린다(오케스트레이터가 UX 라이터에게 그 줄만 다시 맡긴다)
- 디자인 완료 후 다음 단계는 오케스트레이터가 정한다 (FULL = 5b Figma 그리기 → 5c 가상 사용자 점검 → Engineer)

## 추천 플러그인 조합

| 작업 유형 | 추천 조합 |
|-----------|-----------|
| 신규 화면 설계 | figma + design + frontend-design |
| 디자인 QA | design + frontend-design-audit |
| 핸드오프 문서 작성 | figma + design |
| UI 퀄리티 개선 | frontend-design + frontend-design-audit |

## 참조 스킬

- [[skills/design-md/SKILL|design-md]] — 디자인 레퍼런스 분석 및 DESIGN.md 문서화
- [[skills/stitch-design/SKILL|stitch-design]] — Stitch MCP 기반 화면 생성·편집
- [[skills/taste-design/SKILL|taste-design]] — 전반적인 디자인 감도 참고
- [[skills/design-taste-frontend/SKILL|design-taste-frontend]] — 프론트엔드 디자인 감도
- [[skills/high-end-visual-design/SKILL|high-end-visual-design]] — 고급 비주얼 디자인 작업
- [[skills/minimalist-ui/SKILL|minimalist-ui]] — 미니멀 UI 설계
- [[skills/industrial-brutalist-ui/SKILL|industrial-brutalist-ui]] — 브루탈리즘 스타일 UI
- [[skills/react-components/SKILL|react-components]] — 리액트 컴포넌트 스펙 정의
- [[skills/shadcn-ui/SKILL|shadcn-ui]] — shadcn UI 컴포넌트 기반 작업
- [[skills/remotion/SKILL|remotion]] — 모션·애니메이션 관련 작업
- [[skills/stitch-loop/SKILL|stitch-loop]] — 반복 디자인 패턴 작업
- [[skills/enhance-prompt/SKILL|enhance-prompt]] — 디자인 프롬프트 개선
- [[skills/redesign-existing-projects/SKILL|redesign-existing-projects]] — 기존 화면 리디자인
- [[skills/full-output-enforcement/SKILL|full-output-enforcement]] — 완성된 긴 산출물 작성

> 위 스킬 대부분은 이 레포에 없는 외부 스킬이다. 설치돼 있으면(THIRD_PARTY.md) 쓴다.
