---
name: crew-review
description: 산출물 하나를 크루 검수 기준으로 Codex(다른 모델)에게 따로 검수받는다 — 크루 파이프라인 밖에서 메인 세션이 직접 쓴 기획서 · 정책 · 문구 시트 · 디자인 스펙 · 구현도 가능. "코덱스한테 검수받아줘", "이거 리뷰어로 봐줘", "/crew-review [파일]", "다른 모델로 점검해줘" 요청에 사용. 판정(pass/revise/rollback/escalate)과 근거를 파일로 남긴다.
---

# /crew-review — 검수만 따로

## 1. 정하기

- **대상 파일**: 사용자가 말한 파일(여러 개 가능). 없으면 묻는다.
- **단계(기준)**: 내용에 맞는 하나 — `researcher`(리서치) · `pm`(PRD · 정책) · `planner`(화면 기획 · 기능 명세) · `ux-writer`(문구) · `designer`(디자인 스펙 · 화면) · `engineer`(코드) · `qa`(테스트). 애매하면 가장 가까운 것을 고르고 보고에 적는다.
- **근거 자료(--ref)**: 대상이 지켜야 할 상류 문서(PRD · 기획 · 결정 로그 · 회사 conventions · persona). 알면 넣고, 모르면 대상만으로 한다.
- **프로젝트 폴더(--project)**: 결과를 쌓을 곳. 대상이 크루 프로젝트 안이면 그 `[프로젝트]`, 아니면 대상 파일이 있는 폴더.
- **화면**: Figma 화면이면 메인 세션이 `get_screenshot`으로 받아 PNG로 저장하고 `--image`로 넘긴다.

## 2. 실행 (Bash `timeout: 600000`)

```bash
CREW="$(cd "$(dirname "$(readlink -f ~/.claude/skills/crew-review/SKILL.md)")/../.." && pwd)"
python3 "$CREW/scripts/review.py" --project "[프로젝트 폴더]" --stage [단계] \
  --target [파일 ...] --ref [근거 ...] --image [PNG ...] \
  --revision [이 대상을 고쳐서 다시 보는 횟수, 처음 0] --prev [직전 검수 파일, 재검수일 때]
```

- 사용자가 특별히 볼 점을 말했으면 `--note "…"`로 넘긴다.
- 종료 코드 3(Codex 없음)이면 `$CREW/agents/reviewer/CLAUDE.md` 기준으로 직접 검수하고 "같은 모델 검수"라고 밝힌다. 4(실패)면 1회 다시, 5(형식 깨짐)면 1회 다시.

## 3. 보고

- 판정 · 잘된 점 · 미달 기준(무엇이 왜 약한지 · 어떻게 고칠지)을 Codex 원문 그대로 옮기지 말고 **한국어로 짧게 다시 정리**한다.
- 결과 파일 경로(`reviews/[단계]-[NN].md`)를 남긴다.
- 고치는 건 사용자가 정한 뒤에. 고친 뒤 다시 보려면 `--revision`을 1 올리고 `--prev`에 이번 파일을 넣는다.
