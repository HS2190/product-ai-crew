# tokens — ahn.

## 현행: 스펙 시트 라인 (홈 v3 · 케이스 6개 · 프로토타입) — 2026-10-25 확정

| 토큰 | 값 | 용도 |
|---|---|---|
| `--paper` | `#EAE8E3` | 페이지 배경 (회색 종이) |
| `--panel` | `#F2F1EC` | 카드 · 표 바탕 |
| `--ink` | `#111111` | 본문 · 제목 · **모든 선** |
| `--accent` | `#D2FF3D` (라임) | 포인트. **면으로만 쓴다** |
| `--muted` | `#3A3936` | 보조 설명 |

- 포인트 색을 주황 `#FF5A1F`에서 라임 `#D2FF3D`로 바꿨다 (2026-10-25, 사용자 결정).
- 대비: ink/lime **16.29:1**, ink/paper **15.42:1**, lime/paper **1.06:1**.
- **규칙: 라임은 면으로만.** 라임 선 · 라임 글자는 종이 위에서 보이지 않는다(1.06:1). 강조 테두리는 검정 4px, 강조 머리줄은 라임 바탕에 검정 글자. 연표 NOW 선도 검정. **예외: I won't 취소선은 라임 8px** — 검정 글자 위를 지나가서 보인다(사용자 결정 2026-10-25).
- 글꼴: Archivo Black(영문 대제목) · Noto Sans KR(본문) · Space Mono(라벨).

---

## 이전: 콘셉트 A2 (참고용)

> 콘셉트 A2 (Figma 191:2) 기준값. 구현 시 CSS 변수 이름 그대로 쓴다. 이 값 밖의 하드코딩은 critique-brand-consistency에서 이탈로 본다.

## Color

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-bg` | `#F5F5F2` | 페이지 배경 (차가운 오프화이트) |
| `--color-ink` | `#0A0A0A` | 본문·제목·선 |
| `--color-muted` | `#555550` | 보조 설명, 라벨 값 |
| `--color-line` | `#0A0A0A` | 구획 선 (1.5px) |
| `--color-accent` | `#1D3FBF` | 포인트 — 마침표, 상태 점, 링크 hover. **넓은 면 금지** |
| `--color-inverse-bg` | `#0A0A0A` | 반전 블록 (Since의 Now 칸) |
| `--color-inverse-ink` | `#F5F5F2` | 반전 블록 글자 |

대비 (WCAG 상대휘도 공식으로 계산, 2026-10-25): ink/bg **18.13:1**, muted/bg **6.86:1**, accent/bg **7.64:1** — 셋 다 AA(4.5:1) 이상, muted는 AAA(7:1) 미달

## Typography

| 토큰 | 값 |
|---|---|
| `--font-display` | Inter Bold (700) — 영문 디스플레이·제목 |
| `--font-kr` | Noto Sans KR (400 / 700) — 한글 |
| `--font-mono` | IBM Plex Mono 400 — 라벨·메타 |

| 스케일 | size / line-height / letter-spacing | 용도 |
|---|---|---|
| `display` | 200 / 0.86 / -0.065em | 히어로 · Built to last. · Keep this for later. (한 단계로 통일, v2) |
| `display-m` | 120 / 0.85 / -0.06em | 만든 것 이름 (Crew · Iris · GitMate) |
| `display-s` | 88 / 0.9 / -0.06em | 관점 선언 |
| `title` | 44–56 / 1.0 / -0.05em | 작업 이름, 이메일 |
| `lead-kr` | 40 / 1.3 / -0.05em, 700 | 히어로 한글 부제 |
| `body-kr-strong` | 22 / 1.45 / -0.04em, 700 | 관점 한글 한 줄 |
| `body` | 17–18 / 1.5 | 설명 |
| `meta` | 13 / mono / 0.02em | 라벨, 번호, 연도 |

### Mobile (390) 스케일

| 데스크톱 | 모바일 |
|---|---|
| display 200 | 76 (히어로, 단어마다 줄바꿈) / 72 (Built to last.) / 64 (Keep this for later.) |
| display-m 120 | 56 |
| display-s 88 | 40 |
| title 44–56 | 30–44 |
| body 17–18 | 15 (최소) |
| page-gutter 48 | 20 |

## Space & Layout

| 토큰 | 값 |
|---|---|
| `--page-width` | 1440 (기준), 콘텐츠 1344 |
| `--page-gutter` | 48 |
| `--grid` | 12 columns, column-gap 24 |
| `--section-gap` | 120 (섹션 사이), 140–160 (선언 밴드 상하) |
| `--row-pad` | 28 / 36 (목록 행 상/하) |
| `--line-weight` | 1.5px |

## Radius · Shadow

- radius: **0** (상태 점만 원형)
- shadow: **없음**

## Evidence tag

`border 1.5px currentColor · padding 1px 7px · mono 12px` — 텍스트 색은 본문색. 종류 4: `실측`(잰 값) `관찰`(직접 본 것) `출처`(링크로 확인 가능) `본인`(본인 진술) — 2026-10-25 실측 추가
