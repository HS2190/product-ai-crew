# SETUP.md — AI 멀티 에이전트 제품 조직

## 1. 프로젝트 개요

이 레포는 **Claude Code 기반 AI 멀티 에이전트 제품 조직**이다.
PM, 서비스 기획자, 디자이너, UX 라이터 4개의 롤을 각각 독립된 에이전트로 구성하고,
오케스트레이터가 작업 요청을 받아 적합한 에이전트를 자동으로 호출한다.

### 구성된 에이전트 목록

| 에이전트 | 역할 | CLAUDE.md 경로 |
| --------- | ------ | --------------- |
| **오케스트레이터** | 요청 분석 → 모드 판단 → 에이전트 순차 호출 | `project/CLAUDE.md` |
| **PM** | 제품 전략 수립, PRD 작성, 기능 우선순위 결정 | `project/_roles/PM/CLAUDE.md` |
| **서비스 기획자** | 화면 기획, 기능 명세서, User Flow 설계 | `project/_roles/planner/CLAUDE.md` |
| **UI/UX 디자이너** | 화면 디자인, 컴포넌트 스펙, 디자인 시스템 | `project/_roles/designer/CLAUDE.md` |
| **UX 라이터** | UX 문구 작성, 라이팅 가이드, 금지 표현 관리 | `project/_roles/ux-writer/CLAUDE.md` |

---

## 2. 전체 폴더 구조

```text
project/
├── CLAUDE.md                    ← 오케스트레이터 (진입점)
├── SETUP.md                     ← 전체 구조 설명 (이 파일)
│
├── _roles/                      ← 에이전트 롤 정의
│   ├── PM/
│   │   └── CLAUDE.md            ← PM 에이전트
│   ├── planner/
│   │   └── CLAUDE.md            ← 서비스 기획자 에이전트
│   ├── designer/
│   │   └── CLAUDE.md            ← UI/UX 디자이너 에이전트
│   └── ux-writer/
│       └── CLAUDE.md            ← UX 라이터 에이전트
│
├── _workflows/                  ← 워크플로우 정의
│   ├── full-process.md          ← FULL 모드 (PM → 기획 → 디자인 → UX라이팅)
│   ├── quick-design.md          ← DESIGN 모드 (기획 → 디자인)
│   ├── ux-writing.md            ← WRITE 모드 (UX라이터 단독)
│   └── custom-flow.md           ← CUSTOM 모드 (사용자 정의 조합)
│
└── wepair/                      ← 프로젝트 산출물 (서비스명별 폴더)
    ├── persona.md               ← 서비스 페르소나
    ├── PM/PRD/                  ← PM 산출물
    ├── planner/                 ← 기획자 산출물
    ├── designer/                ← 디자이너 산출물
    └── ux-writer/               ← UX 라이터 산출물
```

---

## 3. 워크플로우 실행 방법

Claude Code에서 `project/` 폴더를 열면 오케스트레이터(`CLAUDE.md`)가 자동으로 로드된다.
아래 예시 문장을 입력하면 오케스트레이터가 모드를 판단하고 에이전트를 호출한다.

### FULL 모드 — 전체 프로세스 (PM → 기획 → 디자인 → UX라이팅)

```text
"위페어 파트너스 앱에 '차량 입고 등록' 기능을 새로 만들려고 해. 전체 프로세스 진행해줘."
"[서비스명] [기능명] 기획부터 UX 라이팅까지 전부 해줘."
```

참조 워크플로우: `project/_workflows/full-process.md`

### PLAN 모드 — 기획까지만 (PM → 기획자)

```text
"PRD랑 화면 기획서까지만 만들어줘."
"[기능명] 기획서 만들어줘. 디자인은 아직 안 해도 돼."
```

### DESIGN 모드 — 디자인만 (기획자 → 디자이너)

```text
"기획안 있어. [Figma URL] 이걸로 디자인 완성해줘."
"기획안은 이미 있어. 화면 기획 검토하고 디자인만 해줘."
```

참조 워크플로우: `project/_workflows/quick-design.md`

### WRITE 모드 — 문구 작업만 (UX라이터 단독)

```text
"로그인 화면 UX 문구 전체 검토해줘."
"[Figma URL] 이 화면 문구 작성해줘."
"에러 메시지 가이드에 맞게 전부 수정해줘."
```

참조 워크플로우: `project/_workflows/ux-writing.md`

### CUSTOM 모드 — 사용자 정의 조합

```text
"CUSTOM 모드로 PM과 UX라이터를 병렬로 실행해줘. PM은 브랜드 방향성, UX라이터는 보이스 가이드 초안 작성해줘."
"CUSTOM 모드로 기획자 → 디자이너를 3회 반복 실행해줘."
```

참조 워크플로우: `project/_workflows/custom-flow.md`

---

## 4. 에이전트별 인풋/아웃풋 흐름

```text
[사용자 요청]
        ↓
[오케스트레이터] — project/CLAUDE.md
  역할: 모드 판단 → 에이전트 호출 → 결과 수집 → 완료 보고
        ↓
[PM 에이전트] — project/_roles/PM/CLAUDE.md
  인풋:  서비스명, 기능명, 비즈니스 목표, 타겟 사용자
  아웃풋: PRD, 기능 목록, 우선순위, In/Out Scope
        ↓
[기획자 에이전트] — project/_roles/planner/CLAUDE.md
  인풋:  PRD, 기능 목록, 우선순위, 플랫폼
  아웃풋: 화면 기획안, 기능 명세서, User Flow, 와이어프레임
        ↓
[디자이너 에이전트] — project/_roles/designer/CLAUDE.md
  인풋:  화면 기획안, 기능 명세서, 플랫폼, 브랜드 방향성
  아웃풋: 디자인 스펙, 컴포넌트 스펙, Figma URL
        ↓
[UX라이터 에이전트] — project/_roles/ux-writer/CLAUDE.md
  인풋:  화면 기획안, 디자인 화면, 브랜드 방향성, 보이스 가이드
  아웃풋: UX 라이팅 가이드, 화면별 문구 시트
        ↓
[오케스트레이터] — 최종 완료 보고
```

---

## 5. 새로운 롤 추가 방법

신규 에이전트를 추가할 때 아래 절차를 따른다.

1. **롤 파일 생성**
   `project/_roles/[롤명]/CLAUDE.md` 파일을 생성한다.

2. **SOLO/CREW 모드 섹션 포함 필수**
   다른 롤 파일의 `## 실행 모드` 및 `## 오케스트레이터 연동 (CREW 모드)` 섹션을
   동일한 형식으로 작성한다.
   인풋/아웃풋 항목을 정확히 정의해야 오케스트레이터가 올바르게 호출할 수 있다.

3. **오케스트레이터에 롤 등록**
   `project/CLAUDE.md`의 에이전트 목록 및 파이프라인 흐름에 신규 롤을 추가한다.

4. **워크플로우 파일 추가 (필요시)**
   신규 롤이 포함된 새로운 워크플로우 시나리오가 있으면
   `project/_workflows/[워크플로우명].md` 파일을 추가한다.

5. **SETUP.md 업데이트**
   이 파일의 에이전트 목록, 폴더 구조, 인풋/아웃풋 흐름을 최신 상태로 유지한다.

---

## 6. 주의사항 및 운영 팁

### 롤 파일 수정 시

- 롤 파일의 인풋/아웃풋 형식을 변경하면 오케스트레이터(`project/CLAUDE.md`)의 전달 규칙도 함께 수정한다.
- 연결된 이전/다음 롤 파일의 인풋/아웃풋 항목도 함께 확인한다.

### 산출물 저장 경로 규칙 준수

모든 산출물은 아래 경로에 저장한다. 경로를 임의로 변경하지 않는다.

```text
project/wepair/PM/PRD/       ← PM 산출물
project/wepair/planner/      ← 기획자 산출물
project/wepair/designer/     ← 디자이너 산출물
project/wepair/ux-writer/    ← UX 라이터 산출물
```

### CREW 모드에서 blocked 발생 시

에이전트가 `blocked`를 반환하면 오케스트레이터가 사용자에게 원인을 보고한다.
사용자 확인 없이 다음 에이전트를 자동으로 실행하지 않는다.

### CUSTOM 모드 사용 시

에이전트 간 인풋/아웃풋 의존성을 반드시 확인한 후 병렬 실행 여부를 결정한다.
의존성이 있는 에이전트는 반드시 순서를 보장한다.
자세한 내용은 `project/_workflows/custom-flow.md` 참조.

---

최종 업데이트: 2026.04
