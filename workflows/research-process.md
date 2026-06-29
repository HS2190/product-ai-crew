# 리서치 워크플로우 (RESEARCH)

## 개요

- **실행 모드**: RESEARCH
- **호출 순서**: Researcher 단독 실행
- **사용 상황**: 리서치·경쟁사 분석·사용자 니즈 종합만 필요할 때 (PRD/기획 전 단계 또는 독립 리서치)
- **오케스트레이터 참조**: `CLAUDE.md`

---

## 사용 예시

```
"[기능명] 관련 경쟁사 분석해줘."
"기존 사용자 피드백 종합해서 인사이트 뽑아줘."
"이 시장에서 유사 서비스들이 이 문제를 어떻게 푸는지 리서치해줘."
"인터뷰 전사 정리해서 themes/insights로 종합해줘. [자료 경로]"
```

---

## 사전 준비 조건

오케스트레이터가 RESEARCH 모드를 실행하기 전 아래를 확인한다.

- [ ] 리서치 주제(서비스명·기능명 또는 질문)가 명확한가
- [ ] 사용자 제공 리서치 자료(인터뷰·설문·티켓 등)가 있는가 — 없으면 가용 범위(경쟁사 분석·웹 검색·페르소나)에서 수행하고 한계를 명시
- [ ] 페르소나 파일(`workspace/[서비스명]/persona.md`)이 있는가 (있으면 출발 가설로 전달)

---

## 단계별 실행 정의

### Step 1 — Researcher 에이전트

**역할 참조**: `agents/researcher/CLAUDE.md`
**활용 스킬**: `plugins/design/skills/user-research/SKILL.md`, `plugins/design/skills/research-synthesis/SKILL.md`

**인풋**

| 항목 | 설명 |
|------|------|
| `task` | 리서치 주제 (예: "[기능명] 경쟁사 분석 및 사용자 니즈 종합") |
| `service_name` / `feature_name` | 서비스명 / 리서치 주제 |
| `research_input` | 사용자 제공 자료 경로 (인터뷰·설문·티켓 등). 없으면 비움 |
| `persona_path` | 페르소나 파일 경로 (있을 때) |

**수행 작업**

- 경쟁사·유사 서비스 분석 (무엇을 하고 무엇이 비었는지)
- 가용 데이터 수집 (웹검색/커넥터 활용 가능 시)
- research-synthesis 형식으로 themes → insights → opportunities 종합
- 관찰/해석 분리, 추정·한계 명시

**필수 아웃풋**

| 산출물 | 저장 경로 |
|-------|---------|
| 리서치 종합 | `workspace/[서비스명]/researcher/research-synthesis-v1.0.md` |
| 핵심 인사이트 (key_insights) | 종합 문서 내 포함 |
| 경쟁사 분석 (competitor_findings) | 종합 문서 내 포함 |
| insight → opportunity 매핑 | 종합 문서 내 포함 |

**완료 조건**

- [ ] 리서치 종합 문서 작성 완료 (research-synthesis 형식)
- [ ] 경쟁사/기존 도구 분석 완료
- [ ] 관찰과 해석 분리, 추정·한계 명시
- [ ] key_insights / opportunities 정리됨

**Reviewer 검수**

- 산출물 완료 후 Reviewer가 근거 품질 비평 1회 (`agents/reviewer/CLAUDE.md`)
- pass → 파이프라인 종료 / revise → 재작업 (최대 2회) / escalate → 사용자 판단

**파이프라인 종료**

- 리서치 종합 완료 → 오케스트레이터에 최종 보고

---

## 전체 완료 조건

- [ ] Researcher 리서치 종합 완료 및 저장
- [ ] Reviewer 검수 `pass` (또는 escalate 시 사용자 판단 완료)
- [ ] 오케스트레이터 작업 완료 보고 전달

---

## 참고

리서치 결과로 제품을 만들어야 하면 오케스트레이터에게 `PLAN`(리서치+기획) 또는 `FULL`(전체) 모드 실행을 요청한다.
이미 RESEARCH로 종합한 산출물이 있으면 PM이 그 `research_path`를 인풋으로 받아 이어서 진행할 수 있다.
