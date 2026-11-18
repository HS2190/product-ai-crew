---
name: crew-status
description: Product AI Crew의 프로젝트 진행 상태판을 보여 준다 — 끝나지 않은 세션(in_progress · paused)의 모드 · 다음 단계 · 기다리는 것. "크루 상태", "크루 뭐 남았어", "/crew-status", "진행 중인 크루 작업 보여줘" 요청에 사용. 읽기만 하고 아무것도 바꾸지 않는다.
---

# /crew-status — 크루 상태판

```bash
CREW="$(cd "$(dirname "$(readlink -f ~/.claude/skills/crew-status/SKILL.md)")/../.." && pwd)"
python3 "$CREW/scripts/status.py"          # 끝나지 않은 것만
python3 "$CREW/scripts/status.py" --all    # complete · handed_off까지
```

- 결과 표를 그대로 보여 주고, `paused`면 기다리는 것(사용자 결정 · 외부 준비물)을 한 줄로 짚는다.
- `in_progress`인데 갱신일이 오래됐으면(7일 넘음) "멈춘 세션일 수 있어요. 이어서 할지, paused · handed_off로 닫을지" 묻는다. 닫는 건 사용자가 정한 뒤에만 한다.
- 이어서 하려면 `/crew [서비스명] 이어서`.
- 보고는 한국어로.
