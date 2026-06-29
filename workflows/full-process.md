# 전체 프로세스 워크플로우 (FULL)

## 개요

- **실행 모드**: FULL
- **호출 순서**: Researcher → PM → 기획자 → 디자이너 → UX라이터 → Engineer
- **사용 상황**: 신규 서비스 출시 또는 대형 기능 추가 (구현까지)
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
| 페르소나 | `workspace/[서비스명]/persona.md` (있을 때) |

**필수 아웃풋**

| 산출물 | 저장 경로 |
|-------|---------|
| 리서치 종합 | `workspace/[서비스명]/researcher/research-synthesis-v1.0.md` |
| 핵심 인사이트 (key_insights) | 종합 문서 내 포함 |
| 경쟁사 분석 (competitor_findings) | 종합 문서 내 포함 |
| insight → opportunity 매핑 | 종합 문서 내 포함 |

**완료 조건**

- [ ] 리서치 종합 문서 작성 완료 (research-synthesis 형식)
- [ ] 경쟁사/기존 도구 분석 완료 (무엇을 하고 무엇이 비었는지)
- [ ] 관찰과 해석 분리, 추정·한계 명시
- [ ] PM이 인용할 수 있는 key_insights 정리됨

**Reviewer 검수**

- 산출물 완료 후 Reviewer가 근거 품질 비평 (`agents/reviewer/CLAUDE.md`)
- pass → 다음 Step / revise → 현재 Step 재작업 (최대 2회) / escalate → 사용자 판단

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
| PRD | `workspace/[서비스명]/pm/PRD/PRD-[서비스명]-[기능명]-v1.0.md` |
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

- 산출물 완료 후 Reviewer가 내용 품질 비평 (`agents/reviewer/CLAUDE.md`)
- pass → 다음 Step / revise → 현재 Step 재작업 (최대 2회) / escalate → 사용자 판단

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
| 화면 기획안 | Figma |
| 기능 명세서 | `workspace/[서비스명]/planner/` |
| User Flow | Figma / FigJam |
| 와이어프레임 | Figma |

**완료 조건**

- [ ] 모든 화면 기획안 작성 완료
- [ ] 기능 명세서 작성 완료 (예외 처리 포함)
- [ ] User Flow 시각화 완료
- [ ] Empty State 정의됨
- [ ] `[확인 필요]` 항목 해소 완료

**Reviewer 검수**

- 산출물 완료 후 Reviewer가 내용 품질 비평 (`agents/reviewer/CLAUDE.md`)
- pass → 다음 Step / revise → 현재 Step 재작업 (최대 2회) / escalate → 사용자 판단

**다음 에이전트로 전달**

- 화면 기획안 경로 또는 Figma URL
- 기능 명세서 경로
- 플랫폼별 예외 사항

---

### Step 4 — 디자이너 에이전트

**역할 참조**: `agents/designer/CLAUDE.md`

**인풋** (기획자 아웃풋 + PM 브랜드 방향성)

| 항목 | 출처 |
|------|------|
| 화면 기획안 | 기획자 아웃풋 |
| 기능 명세서 | 기획자 아웃풋 |
| 타겟 플랫폼 | 기획자 아웃풋 |
| 브랜드 방향성 | PM 아웃풋 또는 기존 디자인 시스템 |

**필수 아웃풋**

| 산출물 | 저장 위치 |
|-------|---------|
| 디자인 스펙 | `workspace/[서비스명]/designer/design-spec-v1.0.md` |
| 컴포넌트 스펙 | `workspace/[서비스명]/designer/component-spec-v1.0.md` |
| Figma 화면 | Figma 파일 직접 반영 |

**완료 조건**

- [ ] 모든 화면 디자인 완료 (Figma)
- [ ] 컴포넌트 상태 정의 완료 (default / active / disabled / error / loading)
- [ ] 디자인 QA 체크리스트 통과
- [ ] 디자인 스펙 문서 완료
- [ ] 반응형 처리 여부 확인 (웹인 경우)

**Reviewer 검수**

- 산출물 완료 후 Reviewer가 내용 품질 비평 (`agents/reviewer/CLAUDE.md`)
- pass → 다음 Step / revise → 현재 Step 재작업 (최대 2회) / escalate → 사용자 판단

**다음 에이전트로 전달**

- Figma 화면 URL
- 디자인 스펙 경로
- 컴포넌트 스펙 경로

---

### Step 5 — UX 라이터 에이전트

**역할 참조**: `agents/ux-writer/CLAUDE.md`

**인풋** (기획자 + 디자이너 아웃풋 + PM 브랜드 방향성)

| 항목 | 출처 |
|------|------|
| 화면 기획안 | 기획자 아웃풋 |
| Figma 디자인 화면 URL | 디자이너 아웃풋 |
| 브랜드 방향성 및 톤앤매너 | PM 아웃풋 |
| 기존 보이스 가이드 | `workspace/[서비스명]/ux-writer/writing-guide-v1.0.md` (있는 경우) |

**필수 아웃풋**

| 산출물 | 저장 위치 |
|-------|---------|
| UX 라이팅 가이드 | `workspace/[서비스명]/ux-writer/writing-guide-v1.0.md` |
| 화면별 문구 시트 | `workspace/[서비스명]/ux-writer/copy-sheet-[화면명]-v1.0.md` |

**완료 조건**

- [ ] 모든 화면 UX 문구 작성 완료
- [ ] 금지 표현 0건 확인
- [ ] 보이스 톤 일관성 확인 (`-해요` 체 통일)
- [ ] 컴포넌트별 문구 분류 완료 (`[버튼]`, `[에러]`, `[빈상태]` 등)
- [ ] 수정 필요 문구 `F. 유지` 표기 완료

**Reviewer 검수**

- 산출물 완료 후 Reviewer가 내용 품질 비평 (`agents/reviewer/CLAUDE.md`)
- pass → 다음 Step / revise → 현재 Step 재작업 (최대 2회) / escalate → 사용자 판단

**다음 에이전트로 전달**

- 화면별 문구 시트 경로 (`copy_sheet`)
- UX 라이팅 가이드 경로

---

### Step 6 — Engineer 에이전트

**역할 참조**: `agents/engineer/CLAUDE.md`
**활용 스킬**: `skills/frontend-design/SKILL.md`, `skills/react-components/SKILL.md`, `skills/shadcn-ui/SKILL.md`, `skills/impeccable/`

**인풋** (디자이너 + UX라이터 아웃풋)

| 항목 | 출처 |
|------|------|
| 디자인 스펙 (design_spec) | 디자이너 아웃풋 |
| 컴포넌트 스펙 (component_spec) | 디자이너 아웃풋 |
| Figma URL | 디자이너 아웃풋 (있으면 MCP로 직접 참조) |
| 화면 문구 (copy_sheet) | UX라이터 아웃풋 |
| 기술 스택 (tech_stack) | 사용자 지정 또는 기본 React+Vite+TS |

**필수 아웃풋**

| 산출물 | 저장 위치 |
|-------|---------|
| 구현 코드 | `workspace/[서비스명]/engineer/` (빌드/실행 가능) |
| 빌드 결과 (build_status) | pass / fail |
| 미리보기 URL (preview_url) | 가능 시 |
| 구현 노트 (implementation_notes) | 스펙 대비 차이·결정 사항 |

**완료 조건**

- [ ] 빌드 통과 (콘솔 에러 0)
- [ ] 디자인 스펙·컴포넌트 스펙 반영
- [ ] UX라이터 문구 반영
- [ ] 접근성 반영 (색 외 단서·대비·키보드 접근)
- [ ] 미리보기·스크린샷으로 스펙 일치 자가 확인
- [ ] 백엔드 없이 mock/정적 데이터로 동작

**Reviewer 검수**

- 산출물 완료 후 Reviewer가 구현 품질 비평 (`agents/reviewer/CLAUDE.md`)
- pass → 파이프라인 종료 / revise → 현재 Step 재작업 (최대 2회) / escalate → 사용자 판단

**파이프라인 종료**

- 동작하는 프론트엔드 코드 완료 → 오케스트레이터에 최종 보고
- **이 구현 코드가 FULL 모드의 최종 산출물이다.**

---

## 전체 완료 조건

- [ ] Researcher 리서치 종합 완료 및 저장
- [ ] PM PRD 완료 및 저장 (리서치 insights 인용)
- [ ] 기획자 화면 기획안 + 기능 명세서 완료
- [ ] 디자이너 화면 디자인 + 스펙 문서 완료
- [ ] UX 라이터 문구 + 가이드 완료
- [ ] Engineer 구현 완료 (빌드 통과, 스펙·문구·접근성 반영)
- [ ] 각 단계 Reviewer 검수 `pass` (또는 escalate 시 사용자 판단 완료)
- [ ] 오케스트레이터 작업 완료 보고 전달
