# 외부 스킬 (이 레포에 넣지 않은 것)

크루가 참고하는 외부 스킬 중 **폴더에 라이선스 전문이 없는 것**은 파일을 넣지 않고 출처만 적었다. 필요한 것만 원 저장소에서 받아 `skills/` 아래에 같은 폴더 이름으로 넣으면 된다. 넣은 뒤 Claude Code를 다시 열면 스킬 인덱스(`skills/INDEX.md`)에 자동으로 잡힌다.

```bash
# 예: emilkowalski/skills의 emil-design-eng
git clone --depth 1 https://github.com/emilkowalski/skills /tmp/emil-skills
cp -R /tmp/emil-skills/skills/emil-design-eng skills/emil-design-eng
./install.sh   # ~/.claude/skills 연결
```

**먼저 설치할 것**: Researcher가 리서치 방법론 · 종합 형식으로 `plugins/design`(아래 「플러그인」)을 쓴다. FULL · PLAN · RESEARCH 모드를 쓰려면 이것부터 넣는다.

각 저장소의 라이선스 조건은 원 저장소에서 확인한다. 아래 라이선스 칸은 2026-11 조사 기준이다.

## 디자인 · 모션

| 스킬 (넣을 폴더 이름) | 원 저장소 | 저장소 안 경로 | 라이선스 |
|---|---|---|---|
| emil-design-eng · apple-design · improve-animations · review-animations · animation-vocabulary · animate · animate-expo · ask-sonner · find-animation-opportunities · pick-ui-library · prototype · write-swift | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `skills/<이름>/` | MIT |
| design-taste-frontend · high-end-visual-design · industrial-brutalist-ui · minimalist-ui · full-output-enforcement · redesign-existing-projects | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 저장소에서 같은 이름의 스킬 (구성이 바뀌어 합쳐진 것이 있음) | MIT |
| ui (폴더째) · web-design (폴더째) | [MengTo/Skills](https://github.com/MengTo/Skills) | `agent-skills/ui/` · `agent-skills/web-design/` | MIT |
| frontend-design | [anthropics/skills](https://github.com/anthropics/skills) | `skills/frontend-design/` | Apache-2.0 |
| impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `.claude/skills/impeccable/` | Apache-2.0 |
| scroll-experience | [sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills) | `skills/scroll-experience/` | MIT (문서는 CC-BY-4.0) |

## Stitch · 구현

| 스킬 | 원 저장소 | 저장소 안 경로 | 라이선스 |
|---|---|---|---|
| design-md · enhance-prompt · stitch-loop · taste-design | [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) | `plugins/stitch-utilities/skills/<이름>/` | Apache-2.0 |
| react-components · shadcn-ui · remotion | 위와 같음 | `plugins/stitch-build/skills/<이름>/` | Apache-2.0 |
| stitch-design | 위와 같음 | `plugins/stitch-design/` (구성이 바뀜) | Apache-2.0 |

## 프레젠테이션 · 포트폴리오

| 스킬 | 원 저장소 | 저장소 안 경로 | 라이선스 |
|---|---|---|---|
| deck-critique · deck-rescue · slide-transform | [ai-analyst-lab/ai-analyst-plugin](https://github.com/ai-analyst-lab/ai-analyst-plugin) | `ai-analyst-plus/skills/<이름>/` | MIT |
| revealjs | [ryanbbrown/revealjs-skill](https://github.com/ryanbbrown/revealjs-skill) | `skills/revealjs/` | MIT |
| presentation-design | [rhuss/cc-slidev](https://github.com/rhuss/cc-slidev) | `slidev/skills/presentation-design/` | MIT |
| visualize | [careerhackeralex/visualize](https://github.com/careerhackeralex/visualize) | `skills/visualize/` | MIT |
| portfolio-review | [wonjyou/portfolio-review-skill](https://github.com/wonjyou/portfolio-review-skill) | 루트 `SKILL.md` | MIT |

## 플러그인 (`plugins/` 아래에 넣음)

| 플러그인 | 원 저장소 | 저장소 안 경로 | 라이선스 |
|---|---|---|---|
| design | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) | `design/` | Apache-2.0 |
| figma | [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) | 저장소 루트 | Figma Developer Terms |

## 재배포가 금지된 것

| 스킬 | 원 저장소 | 비고 |
|---|---|---|
| figma-variables-tokens-generator | [Shanmus4/figma-variables-tokens-generator](https://github.com/Shanmus4/figma-variables-tokens-generator) | 개인 · 조직 내부 사용만 허용. 각자 원 저장소에서 받아 쓴다 |
