# 리서치 워크플로우 (RESEARCH)

- **순서**: 0 → 1 (Researcher 단독). 순서 · 필드 · 검수 처리 · 상한은 `CLAUDE.md` 단계 계약표가 정본이다.
- **언제**: 리서치 · 경쟁사 분석 · 사용자 니즈 종합만 필요할 때 (PRD · 기획 전 단계 또는 독립 리서치)

```
"[기능명] 관련 경쟁사 분석해줘."
"기존 사용자 피드백 종합해서 인사이트 뽑아줘."
"인터뷰 전사 정리해서 themes/insights로 종합해줘. [자료 경로]"
```

## 0. 시작 점검

- [ ] 리서치 주제(서비스명 · 기능명 또는 질문)가 명확한가
- [ ] 사용자 제공 리서치 자료(인터뷰 · 설문 · 티켓)가 있는가. 없으면 가용 범위(경쟁사 분석 · 웹 검색 · 페르소나)에서 하고 한계를 적는다
- [ ] `[프로젝트]/persona.md`가 있는가 (있으면 출발 가설로 넘긴다)

## 1. Researcher

역할 정본: `agents/researcher/CLAUDE.md` · 스킬: `user-research` · `research-synthesis`

**입력**: `task` · `service_name` / `feature_name` · `research_input`(없으면 비움) · 공통 입력(`persona_path` · `memory_context` 등)

**산출물**

| 산출물 | 경로 |
|-------|------|
| 리서치 종합 (research-synthesis 형식) | `[프로젝트]/researcher/research-synthesis-v1.0.md` |
| key_insights · competitor_findings · insight → opportunity | 종합 문서 안 |

**완료 조건**

- [ ] research-synthesis 형식으로 종합 완료
- [ ] 경쟁사 / 기존 도구 분석 (무엇을 하는가 + 무엇이 비었는가)
- [ ] 관찰과 해석 분리, 추정 · 한계 명시
- [ ] key_insights · opportunities 정리

**검수**: `review.py --stage researcher` 1회. rollback 대상 없음 (맨 앞 단계. 입력 자료 문제면 escalate).

## 이어서

- 제품까지 만들려면 PLAN(리서치 + 기획) 또는 FULL로 이어 간다. 이미 만든 `research_path`는 PM 입력으로 그대로 쓴다.
