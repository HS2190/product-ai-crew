---
name: crew
description: Product AI Crew(리서치 → PM → 기획 → UX 라이팅 → 디자인 → 구현 → QA 멀티 에이전트 제품팀)를 어느 폴더에서든 불러 작업을 시작하거나 이어 간다. "크루 불러줘", "크루로 진행해줘", "/crew [요청]", "[서비스] 전체 프로세스 진행해줘", "기획까지만 크루로", "크루 이어서 해줘" 요청에 사용. 상태만 볼 때는 crew-status, 검수만 돌릴 때는 crew-review.
---

# /crew — 크루 오케스트레이터 부르기

## 1. 크루 위치 찾기 (어느 폴더에서 불러도 같은 크루)

```bash
CREW="$(cd "$(dirname "$(readlink -f ~/.claude/skills/crew/SKILL.md)")/../.." && pwd)"; echo "$CREW"
```

- 이 스킬은 크루 레포의 `skills/crew/`에 있고 `install.sh`가 `~/.claude/skills/crew`로 연결한다. 위 명령은 그 실제 위치에서 레포 루트를 찾는다.
- 이후 모든 상대경로(`crew.config.md` · `agents/` · `scripts/` · `workspace/`)는 `$CREW` 기준이다. 크루 문서에 나오는 명령 · 경로는 **절대경로로 바꿔 쓴다**(예: `python3 "$CREW/scripts/review.py" …`, 서브에이전트에 넘기는 모든 경로).
- 시험 등으로 스킬이 `~/.claude/skills`에 연결돼 있지 않으면 사용자가 알려 준 크루 경로를 `CREW`로 쓴다.

## 2. 오케스트레이터 읽기

`$CREW/CLAUDE.md`를 읽고 **그 문서대로** 오케스트레이터 역할을 한다(설정 → 회사 · 기억층 → 세션 → 모드 → 디자인 시스템 → 선행 조건 → 단계 실행). 이 스킬은 진입점일 뿐이고 규칙은 모두 그 문서에 있다.

- 사용자 요청(`args`)이 비어 있으면 먼저 상태판을 보여 주고 무엇을 할지 묻는다: `python3 "$CREW/scripts/status.py"`
- 요청에 서비스명이 있으면 그 `[프로젝트]/session.md`부터 본다(재개 판단).

## 3. 서브에이전트 부르기

- 지금 작업 폴더가 `$CREW`이면 `.claude/agents/`에 등록된 역할(`researcher` · `pm` · `planner` · `ux-writer` · `designer` · `engineer` · `qa`)을 Agent 도구의 `subagent_type`으로 부른다.
- 다른 폴더에서 불렀으면 등록 역할이 안 보일 수 있다. 그때는 `general-purpose`로 부르고 프롬프트 맨 앞에 이렇게 넣는다:
  `너는 Product AI Crew의 [역할]이다. 먼저 $CREW/.claude/agents/[역할].md, $CREW/agents/_common.md, $CREW/agents/[역할]/CLAUDE.md를 읽고 그대로 따른다. Figma · 사용자 질문 · 남는 서버는 하지 않는다. 최종 보고는 한국어로.`
  그 뒤에 CLAUDE.md 「서브에이전트 호출 형식」 블록을 절대경로로 채워 붙인다.

## 4. 끝낼 때

- 단계를 마칠 때마다 session.md를 갱신하고, 대화를 끝내기 전에 `in_progress`로 남기지 않는다(`paused` · `handed_off` · `complete`).
- 사용자 보고 · 질문은 한국어로.
