---
name: antigravity-motion-ui
description: Spatial, weightless interfaces — glassmorphism, Z-axis depth, isometric grids, and scroll-linked GSAP motion. Use for immersive landing pages, product showcases, portfolios, and hero surfaces that should feel like floating glass. Covers elevation/blur/easing tokens, ScrollTrigger and stagger recipes, compositor-only performance budgets, reduced-motion fallbacks, and the contrast trap that breaks most glass UI.
---

# Antigravity — Spatial & Motion UI

Build interfaces that feel weightless: elements float in Z-space, surfaces are translucent glass, and everything moves with momentum instead of snapping.

## When to use

- Landing pages, hero sections, product showcases, portfolios, marketing surfaces.
- Dashboards or data visualizations that want an immersive, premium presentation layer.
- Any brief asking for "depth", "3D", "glassy", "premium", "floating", "spatial".

## When NOT to use

Refuse the aesthetic — or contain it to one hero surface — when:

- **Dense data work**: tables, admin CRUD, forms, settings. Translucency destroys row scanning; motion delays task completion.
- **Text-heavy reading surfaces**: docs, articles. Blur behind body copy is a readability tax with no payoff.
- **Accessibility-critical or regulated flows**: checkout, auth, medical, government. Glass fails contrast far more often than it passes.
- **Low-power targets**: `backdrop-filter` is the single most expensive common CSS property on mid-range Android and older Safari.

Correct move on a mixed product: antigravity on the marketing/hero layer, flat and opaque inside the app. Say this out loud rather than quietly styling a data table in glass.

## Stack

- **Framework**: React / Next.js
- **Styling**: Tailwind for layout + utility, hand-written CSS for 3D transforms and glass surfaces
- **Motion**: GSAP + ScrollTrigger for scroll-linked motion; Framer Motion is acceptable for component-level enter/exit
- **3D**: CSS 3D transforms (`perspective`, `rotateX/Y/Z`) first. Reach for React Three Fiber only when the scene needs real geometry, lighting, or camera — R3F for a tilted card grid is overkill and costs ~500KB.

## Design tokens

Do not improvise these values per component. Define once, reference everywhere.

### Elevation (floating shadows)

Weightlessness comes from **large, soft, low-opacity** shadows — never a tight dark drop shadow.

| Level | Use | Value |
|---|---|---|
| `float-sm` | resting card | `0 4px 12px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)` |
| `float-md` | primary surface | `0 12px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)` |
| `float-lg` | hover / raised | `0 24px 60px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05)` |
| `float-xl` | modal / hero | `0 40px 100px rgba(0,0,0,0.14), 0 8px 24px rgba(0,0,0,0.06)` |

Two-layer shadows (one tight contact shadow + one wide ambient) read as physical. A single shadow reads as a sticker.

### Glass surfaces

| Token | Value |
|---|---|
| `glass-bg` (light) | `rgba(255,255,255,0.66)` |
| `glass-bg` (dark) | `rgba(20,20,24,0.62)` |
| `glass-blur` | `blur(12px) saturate(160%)` |
| `glass-border` | `1px solid rgba(255,255,255,0.28)` (light) / `rgba(255,255,255,0.10)` (dark) |

`saturate()` alongside `blur()` is what separates real glass from gray fog — without it, blurred backdrops desaturate and look muddy.

### Motion

| Token | Value | Use |
|---|---|---|
| `dur-instant` | `120ms` | color/opacity feedback |
| `dur-fast` | `200ms` | hover, focus, small state change |
| `dur-base` | `320ms` | transform, elevation change, expand |
| `dur-slow` | `600ms` | entrance, page transition |
| `ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | anything the user triggered |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | continuous / looping |
| `stagger` | `0.08s` | grid and list entrances |

**Never snap.** Every hover, focus, and active state gets a transition of at least `dur-fast`. A 0ms state change is the loudest tell of an unfinished interface.

## Recipes

### Glass panel

```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--float-md);
}

/* Fallback: no backdrop-filter support → go opaque, never transparent-and-unreadable */
@supports not (backdrop-filter: blur(12px)) {
  .glass { background: var(--surface-solid); }
}
```

### Scroll float-in (GSAP ScrollTrigger)

```js
gsap.from('.float-in', {
  y: 48,
  rotateX: 6,
  opacity: 0,
  duration: 0.6,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.float-in', start: 'top 85%', once: true },
});
```

`once: true` unless the replay is the point — re-animating on every scroll-back is nausea, not delight.

### Staggered grid entrance

```js
gsap.from('.card', {
  y: 32, opacity: 0, duration: 0.5, ease: 'power3.out',
  stagger: { each: 0.08, from: 'start' },
  scrollTrigger: { trigger: '.grid', start: 'top 80%', once: true },
});
```

Cap total stagger at ~600ms. A 30-card grid at 0.08s each means the last card lands 2.4s late — use `stagger: { each: 0.08, amount: 0.6 }` so the window stays fixed regardless of count.

### Isometric tilt

```css
.iso-scene { perspective: 1600px; perspective-origin: 50% 30%; }
.iso-grid {
  transform: rotateX(48deg) rotateZ(-32deg);
  transform-style: preserve-3d;
  transition: transform var(--dur-slow) var(--ease-out);
}
.iso-scene:hover .iso-grid { transform: rotateX(38deg) rotateZ(-24deg); }
```

Tilt is presentational only. Never put a primary CTA, form field, or anything requiring a precise click inside a rotated plane — hit targets shear and pointer accuracy collapses.

### Parallax depth

```js
gsap.to('.layer-bg', {
  yPercent: -12, ease: 'none',
  scrollTrigger: { trigger: '.section', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
});
```

Background moves less than foreground. Use `scrub` with a small number (0.5–1) so motion has weight rather than being pinned rigidly to the scrollbar.

## Performance budget

- **Animate only `transform` and `opacity`.** These run on the compositor. Animating `box-shadow`, `filter`, `backdrop-filter`, `width`, `height`, or `top/left` forces paint or layout every frame.
- Need a shadow to grow on hover? Cross-fade two stacked pseudo-elements' `opacity` instead of animating the shadow.
- **`will-change` is a loan, not a gift.** Add it on interaction start, remove it on completion. A permanent `will-change: transform` on every card promotes dozens of layers and exhausts GPU memory.
- **Cap `backdrop-filter` at ~3 simultaneous surfaces** in the viewport. It forces a backdrop re-render per element; a glass nav over a glass sidebar over a glass grid drops frame rate on mid-tier hardware.
- Kill ScrollTriggers on unmount (`ScrollTrigger.getAll().forEach(t => t.kill())`) or you leak listeners across route changes.
- Target 60fps on a mid-range Android, not on your laptop. Verify in DevTools Performance with 4x CPU throttling.

## Accessibility — the two things that actually break

### 1. Contrast on glass (the failure nobody catches)

Translucent surfaces have **no fixed contrast ratio** — the effective background changes with whatever scrolls behind it. Text that reads 7:1 over a light section can drop to 1.8:1 over a photo two scroll-positions later.

Rules:
- Never place body text directly on a glass surface with a variable backdrop.
- Composite an opaque scrim under the text layer: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55))` beneath the blur, then verify contrast against the *scrim*, not the blur.
- Verify against the **worst-case** backdrop the surface can travel over — brightest and darkest — not a screenshot of one state.
- Floor: **4.5:1** body text, **3:1** large text (≥24px or ≥19px bold) and UI/icon boundaries.

### 2. Reduced motion

`prefers-reduced-motion: reduce` is not optional. Do not merely shorten durations — remove the movement.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```js
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduced) { /* register GSAP scroll animations */ }
else { gsap.set('.float-in', { opacity: 1, y: 0, rotateX: 0 }); }
```

Critical: entrance animations that start at `opacity: 0` must be **set to their end state** under reduced motion — a skipped animation that leaves content invisible is a blank page for that user.

Also hold: visible focus rings (a blurred surface hides a subtle outline — use a 2px solid ring with 2px offset), parallax and tilt disabled under reduced motion, and no motion-only state signaling.

## Ship checklist

- [ ] Every hover/focus/active state has a transition ≥ 200ms; nothing snaps
- [ ] Only `transform` / `opacity` animate; no shadow or filter animation in a loop
- [ ] `will-change` is added and removed, not permanent
- [ ] ≤ 3 `backdrop-filter` surfaces in viewport; `@supports` fallback goes opaque
- [ ] Text contrast verified against worst-case backdrop (4.5:1 / 3:1), not one screenshot
- [ ] `prefers-reduced-motion` removes motion AND leaves content visible
- [ ] Focus rings visible on every glass surface
- [ ] No interactive target inside a rotated/tilted plane
- [ ] Stagger window capped (~600ms total) regardless of item count
- [ ] 60fps at 4x CPU throttle; ScrollTriggers cleaned up on unmount

## 이 시스템과의 연결

- 디자이너 에이전트가 이 스킬을 적용하면 `design_spec`에 위 토큰 표(elevation·glass·motion)를 **실제 값으로 채워** 넘긴다. "부드럽게", "떠 있는 느낌" 같은 서술로 넘기지 않는다.
- 컴포넌트 스펙에는 상태별 transition duration·easing을 명시한다 (기본/호버/포커스/활성/비활성).
- 접근성 판단 기준(WCAG)은 위 「Contrast on glass」 절차를 따른다 — glass 표면은 단일 배경 대비 측정이 무효다.
