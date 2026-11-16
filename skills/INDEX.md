# 스킬 인덱스

> 이 파일은 `scripts/build-skill-index.py`가 생성한다. 직접 수정하지 말 것.

> 스킬 24개 · 플러그인 스킬 2개


스킬을 고를 때는 이 인덱스에서 후보를 좁힌 뒤 **선택한 스킬의 SKILL.md만** 연다.

`자동`은 `~/.claude/skills`에 등록되어 설명 매칭으로 저절로 뜨는 스킬이다. 나머지는 경로를 열어 직접 적용한다.


## 최상위 (17개)

| 스킬 | 설명 | 자동 | 경로 |
|---|---|:--:|---|
| **banana** | AI image generation Creative Director powered by Google Gemini Nano Banana models. | ● | `skills/banana` |
| **case-study** | Craft portfolio-ready case studies that tell the story of a design project. | ● | `skills/case-study` |
| **critique-affordance** | Critique a screen's interactive affordances — what looks clickable, state visibility, CTA clarity, and action discoverability. | ● | `skills/critique-affordance` |
| **critique-brand-consistency** | Critique a screen's brand consistency against mood.md, voice.md, and tokens.md. | ● | `skills/critique-brand-consistency` |
| **critique-color** | Critique a screen's colour usage — contrast ratios, palette coherence, semantic meaning, and colour accessibility. | ● | `skills/critique-color` |
| **critique-composition** | Critique a screen's composition — balance, whitespace, rhythm, and gestalt principles. | ● | `skills/critique-composition` |
| **critique-information-density** | Critique a screen's information density — cognitive load, content prioritisation, scanning patterns, and progressive disclosure. | ● | `skills/critique-information-density` |
| **critique-typography** | Critique a screen's typography — scale usage, readability, consistency, and token compliance. | ● | `skills/critique-typography` |
| **critique-visual-hierarchy** | Critique a screen's visual hierarchy — entry point, eye flow, weight distribution, and emphasis. | ● | `skills/critique-visual-hierarchy` |
| **design-compare** | Figma 시안 비교 → 채택 → 정리. | ● | `skills/design-compare` |
| **design-rationale** | Write clear design rationale connecting decisions to user needs, business goals, and principles. | ● | `skills/design-rationale` |
| **figma-qa** | Figma 시안 자동 점검 — 잘림 · 텍스트 넘침 · 겹침 · 섹션 밖 배치 · 변수에 연결 안 된 색 · 직접 그린 컴포넌트 · 한쪽 색 띠 · 옛 컴포넌트 · 임시 문구를 스크립트로 찾아 고친 뒤 보고. | ● | `skills/figma-qa` |
| **frontend-slides** | Create stunning, animation-rich HTML presentations from scratch or by converting PowerPoint files. | ● | `skills/frontend-slides` |
| **guizang-ppt** ⚠️`name: guizang-ppt-skill` | 生成横向翻页网页 PPT（单 HTML 文件），含 WebGL 背景、章节幕封、数据大字报、图片网格等模板。提供两种风格：① "电子杂志 × 电子墨水"（衬线 + 流体背景 + 暖色） ② "瑞士国际主义"（无衬线 + 网格点阵 + IKB/柠檬黄/柠檬绿/安全橙高亮）。当用户需要制作分享 / 演讲 / 发布会风格的… | ● | `skills/guizang-ppt` |
| **ppt-master** | AI-driven multi-format SVG content generation system. | ● | `skills/ppt-master` |
| **presentation-deck** | Structure compelling design presentations for stakeholders, reviews, and showcases. | ● | `skills/presentation-deck` |
| **qa-practice** | QA 실무 체크리스트 모음 — 기획 · 디자인 · 구현 · QA 단계에서 실제로 자주 깨지는 지점(권한 우회 · 연타 중복 · 경계값 · 앱 밖 복귀 · 긴 텍스트 · 오류 코드별 화면 · 캐시)과 테스트 케이스 · 탐색적 테스트 · 버그 리포트 방법. |  | `skills/qa-practice` |

## 다른 스킬에 포함된 하위 스킬 (7개)

> 다른 스킬 패키지 안에 들어 있어 단독으로 등록되지 않는다. 부모 스킬을 통해 쓰거나 경로를 직접 연다.

| 스킬 | 부모 | 설명 | 경로 |
|---|---|---|---|
| **banner-design** | `ui-ux-pro-max-skill` | Design banners for social media, ads, website heroes, creative assets, and print. | `skills/ui-ux-pro-max-skill/.claude/skills/banner-design` |
| **brand** | `ui-ux-pro-max-skill` | Brand voice, visual identity, messaging frameworks, asset management, brand consistency. | `skills/ui-ux-pro-max-skill/.claude/skills/brand` |
| **design** | `ui-ux-pro-max-skill` | Comprehensive design skill: brand identity, design tokens, UI styling, logo generation (55 styles, Gemini AI), corporate identity program (50 deliverables, CIP… | `skills/ui-ux-pro-max-skill/.claude/skills/design` |
| **design-system** | `ui-ux-pro-max-skill` | Token architecture, component specifications, and slide generation. | `skills/ui-ux-pro-max-skill/.claude/skills/design-system` |
| **slides** | `ui-ux-pro-max-skill` | Create strategic HTML presentations with Chart.js, design tokens, responsive layouts, copywriting formulas, and contextual slide strategies. | `skills/ui-ux-pro-max-skill/.claude/skills/slides` |
| **ui-styling** | `ui-ux-pro-max-skill` | Create beautiful, accessible user interfaces with shadcn/ui components (built on Radix UI + Tailwind), Tailwind CSS utility-first styling, and canvas-based vis… | `skills/ui-ux-pro-max-skill/.claude/skills/ui-styling` |
| **ui-ux-pro-max** | `ui-ux-pro-max-skill` | UI/UX design intelligence for web and mobile. | `skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max` |

## 플러그인 스킬 (2개)

| 스킬 | 플러그인 | 설명 |
|---|---|---|
| **frontend-design** | `frontend-design` | Create distinctive, production-grade frontend interfaces with high design quality. |
| **frontend-design-audit** | `frontend-design-audit` | Evaluate and improve the usability of existing front-end interfaces — either local source code or live websites by URL. |
