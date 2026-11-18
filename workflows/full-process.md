# 전체 프로세스 워크플로우 (FULL)

- **순서**: 0 → 1 Researcher → 2 PM → 3 기획자 → 4 UX라이터 → 5a → 5 디자이너 → 5b → 5c → 6 Engineer → 7 QA
- **사용 상황**: 신규 서비스 출시 또는 대형 기능 추가 (구현 · 검증까지)
- 순서 · 필드 · 게이트 · 상한 · 검수 처리(판정별 처리 · `--revision` · `--rollbacks`)는 `CLAUDE.md` 「단계 계약표」 · 「검수」가 정본이다. 이 문서는 단계별 산출물과 완료 조건만 적는다.
- 검수는 단계마다 `python3 scripts/review.py --project "[프로젝트]" --stage [단계] --target … --ref …`. 아래 「검수」 줄은 단계 이름 · 대상 · 되돌릴 수 있는 상류만 적는다.

### 1 Researcher (`agents/researcher/CLAUDE.md`)

**입력**: 서비스명 · 기능명 · `research_input`(사용자 자료: 인터뷰 · 설문 · 티켓, 없으면 비움) · `persona_path`
**활용 스킬**: `plugins/design/skills/user-research` · `research-synthesis` (설치돼 있으면, THIRD_PARTY.md)

| 산출물 | 경로 |
|-------|------|
| 리서치 종합 (key_insights · competitor_findings · insight → opportunity 매핑 포함) | `researcher/research-synthesis-v1.0.md` |

**완료 조건**
- [ ] 리서치 종합 (research-synthesis 형식) · 경쟁사/기존 도구 분석 (무엇을 하고 무엇이 비었는지)
- [ ] 관찰과 해석 분리, 추정 · 한계 명시
- [ ] PM이 인용할 수 있는 key_insights 정리

**검수**: `--stage researcher` · rollback 대상 없음(첫 단계, 입력 자료 문제면 escalate)

### 2 PM (`agents/pm/CLAUDE.md`)

**입력**: `research_path` · `key_insights` · `platform` · 비즈니스 목표 · 타겟 사용자

| 산출물 | 경로 |
|-------|------|
| PRD (기능 목록 · 우선순위 · In/Out of Scope · 브랜드 방향 포함) | `pm/PRD/PRD-[서비스명]-[기능명]-v1.0.md` |

**완료 조건**
- [ ] 기능 목록 및 우선순위 확정 (Must Have 1개 이상 / Should Have / Nice to Have)
- [ ] In Scope / Out of Scope 구분 · KPI/OKR 정의
- [ ] 확인 필요 항목은 `open-items.md`에 ID로 정리

**검수**: `--stage pm` · rollback → researcher

### 3 기획자 (`agents/planner/CLAUDE.md`)

**입력**: `prd_path` · `feature_list` · `platform`

| 산출물 | 경로 |
|-------|------|
| 화면 기획: 화면 목록 + 화면별 구성(텍스트 와이어) + 흐름(텍스트 다이어그램) | `planner/screen-plan-v1.0.md` |
| 기능 명세: 기능 · 상태 · 예외 · 공통 규칙 · 설정값(CFG) | `planner/feature-spec-v1.0.md` |
| 확인 필요 · 미정 | `open-items.md` (없으면 「없음」) |

Figma · FigJam 그림이 필요하면 메인 세션이 md를 보고 그린다(정본은 md).

**완료 조건**
- [ ] 모든 화면의 목록 · 구성과 흐름(정상 · 예외)이 screen-plan에 있음
- [ ] 기능 명세에 상태 · 예외 처리 · Empty State 포함
- [ ] 미정 항목은 open-items ID로만 가리킴

**검수**: `--stage planner` · rollback → pm, researcher

### 4 UX 라이터 (`agents/ux-writer/CLAUDE.md`)

**입력**: `screen_plan` · `feature_spec`(상태 · 예외) · `brand_direction` · 기존 보이스 가이드(있으면). 디자인 전에 문구를 먼저 확정한다.

| 산출물 | 경로 |
|-------|------|
| UX 라이팅 가이드 | `ux-writer/writing-guide-v1.0.md` |
| 화면별 문구 시트 (파일 1개, 화면별 절) | `ux-writer/copy-sheet-v1.0.md` |

**완료 조건**
- [ ] screen-plan의 모든 화면 · feature-spec의 상태(빈 상태 · 에러 · 권한 거부 등) 문구 작성
- [ ] 금지 표현 0건 · 보이스 톤 일관성 (`-해요` 체 통일)
- [ ] 컴포넌트별 문구 분류 (`[버튼]`, `[에러]`, `[빈상태]` 등)
- [ ] 수정조사 유형(A~F) 표기 (기준에 맞아 그대로 두는 문구는 `F. 유지`)

**검수**: `--stage ux-writer` · rollback → planner, pm

### 5a Figma 링크 · 디자인 시스템 확정 (메인)

`CLAUDE.md` 5a. 산출: `figma_link` 또는 '스킵', `design_skill`(none이면 디자이너 「추천만」 호출 → 사용자 선택). 참고할 기존 Figma 화면이 있으면 `[프로젝트]/_shots/designer/`에 캡처해 `shots_dir`로 넘긴다.

### 5 디자이너 (`agents/designer/CLAUDE.md`)

**입력**: `screen_plan` · `feature_spec` · `copy_sheet` · `platform` · `brand_direction` · `design_skill` · `figma_link` · `shots_dir`

| 산출물 | 경로 |
|-------|------|
| 디자인 스펙 | `designer/design-spec-v1.0.md` |
| 컴포넌트 스펙 | `designer/component-spec-v1.0.md` |
| 디자인 QA | `designer/design-qa-v1.0.md` |
| Figma 드로잉 플랜 (figma_link 받았을 때) | `designer/figma-draw-plan-v1.0.md` |

**완료 조건**
- [ ] design_spec · component_spec 완료 (전 화면 · 전 컴포넌트)
- [ ] 화면 문구는 문구 시트 그대로 (임시 문구 없음), 안 맞는 문구는 「문구 조정 요청」에 화면 · 위치 · 이유
- [ ] 컴포넌트 상태 정의 (default / active / disabled / error / loading) · 디자인 QA 체크리스트 통과 · 반응형 처리 (웹인 경우)
- [ ] figma_link를 받았으면 figma_draw_plan 작성 후 5b까지

**문구 조정 요청**이 있으면 UX라이터가 그 줄만 다시 다듬고 디자이너가 반영한다(`CLAUDE.md` 「메인 세션 단계」 끝 줄). 문구 시트와 Figma 문구는 항상 같아야 한다.

**검수**: 5b가 끝난 뒤 `--stage designer --image designer/review-shots/*.png` (Figma 스킵이면 `--image` 없이) · rollback → ux-writer, planner, pm

### 5b Figma 그리기 · 캡처 (메인, figma_link 받았을 때만)

`CLAUDE.md` 5b. 산출: `figma_url`(실제 그린 노드 링크) · `designer/review-shots/*.png`(디자이너 검수 `--image`와 Engineer `shots_dir`가 씀). figma_link가 없으면 생략하고 `figma_url: N/A (사유)`.

### 5c 가상 사용자 점검 (메인, 판정 없음)

`CLAUDE.md` 5c. 스킬 `user-voice-sim`(별도 설치, 없으면 생략 · 설치 안내만 보고). `figma_url`이 없으면 생략하고 "가상 사용자 점검 생략 (화면 없음)".

| 입력 | 출처 |
|------|------|
| 핵심 과업 흐름 화면 3~5장 | screen-plan 핵심 흐름 순서 (전 화면 넣지 않음, 비용) |
| 페르소나 · 과업 | `persona_path` · PRD 핵심 유저 스토리 1~2개 |
| 서비스 맥락 | 앱 이름 · 한 줄 설명만 (기획 의도 · 화면 설명 전달 금지) |
| 모드 · A/B | 고객용 = 일반 서비스 / 관리자 · 운영 = 업무 도구 · 디자이너가 두 안을 냈으면 A/B |

**산출물**: `feedback-sim/YYYY-MM-DD-[화면].md`

**완료 조건**
- [ ] 신뢰도 높음(두 모델 모두 같은 곳에서 막힘)만 수정 제안으로 보여 줌. 한 모델 결과만 있으면 "단일 모델, 교차 확인 없음"
- [ ] 사용자가 승인한 것만 원인별로 넘김 (문구 → UX라이터 그 줄 → 디자이너 / 배치 · 위계 → 디자이너), 1회로 끝
- [ ] 중간 · 낮음은 메모로, 「실제 UT로 확인할 질문」은 보고에 그대로 포함 (실제 UT를 대신하지 않음)

### 6 Engineer (`agents/engineer/CLAUDE.md`)

**입력**: `design_spec` · `component_spec` · `copy_sheet` · `platform` · `shots_dir`(5b 캡처, 스킵이면 없음) · `tech_stack`(없으면 React + Vite + TS) · (재작업 시) `bug_report`

| 산출물 | 경로 |
|-------|------|
| 구현 코드 (빌드/실행 가능) | `engineer/` |
| build_status · run_command · implementation_notes | 반환 필드 (fail이면 blocked) |

**완료 조건**
- [ ] 빌드 통과 (타입 · 린트 에러 0)
- [ ] 디자인 스펙 · 컴포넌트 스펙 · 문구 · 접근성(색 외 단서 · 대비 · 키보드 접근) 반영, 전 화면 구현
- [ ] design_spec · 캡처와 대조해 스펙 일치 자가 확인 (스크린샷은 도구가 있을 때만)
- [ ] 백엔드 없이 mock/정적 데이터로 동작, `run_command` 제출

메인 세션이 `run_command`로 미리보기를 띄우고 주소를 `preview_url`로 QA에 넘긴다.

**검수**: `--stage engineer` (대상 `code_path` + 빌드 로그) · rollback → designer, ux-writer, planner

### 7 QA (`agents/qa/CLAUDE.md`)

**입력**: `feature_spec` · `screen_plan` · `copy_sheet` · `design_spec` · `code_path` · `run_command` · `preview_url` · `implementation_notes` · `platform` · (재테스트 시) `retest_of`

| 산출물 | 경로 |
|-------|------|
| 테스트 케이스 | `qa/test-cases-v1.0.md` |
| QA 리포트 (회차마다 새 파일, `retest_of`로 연결) | `qa/qa-report-r1.md` · `qa-report-r2.md` … |
| 증거 · 스크립트 | `qa/evidence/` · `qa/scripts/` (Playwright는 `qa/runner/`) |

**완료 조건**
- [ ] 테스트 케이스마다 기대 결과의 근거 문서 표시
- [ ] 비정상 상황(연타 · 권한 우회 · 없는 대상 · 입력값 · 중단 복귀 · 네트워크 · 화면 크기 · 반영) 해당하는 만큼 실행
- [ ] 탐색적 테스트 세션 1회 이상 (차터 + 메모)
- [ ] 버그와 「기획 확인」 분리, 버그마다 재현 절차 · 기대 / 실제 · 증거 · 심각도
- [ ] 실행 못 한 케이스는 `실행 못함 (이유)`

`qa_status` pass = 치명 · 주요 0건. fail이면 `CLAUDE.md` 「QA ↔ Engineer」대로 왕복한다(최대 2회).

**검수**: fail 루프가 끝난 마지막 산출물에만 `--stage qa` (대상 test_cases · qa_report · `qa/evidence/`) · rollback → engineer, designer, planner

## 전체 완료 조건

- [ ] 1~4 산출물 저장 · 검수 통과 (PRD는 리서치 insights 인용)
- [ ] 디자이너 스펙 완료, figma_link를 받았으면 5b 그리기 · 캡처까지
- [ ] 가상 사용자 점검 결과 저장 및 신뢰도 높음 항목 처리 (또는 생략 사유)
- [ ] Engineer 구현 완료 · QA 검증 완료 (qa_status pass 또는 사용자 판단)
- [ ] 각 단계 검수 `pass` (또는 escalate 시 사용자 판단 완료) → `CLAUDE.md` 「완료 보고」

최종 산출물은 동작하는 프론트엔드 코드와 QA 테스트 케이스 · 리포트다. 테스트 케이스는 개발 전달 때 개발팀에 함께 넘길 수 있다.
