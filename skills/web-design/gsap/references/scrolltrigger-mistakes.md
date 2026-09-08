# ScrollTrigger — 흔한 실수 11가지와 수정

출처: https://gsap.com/resources/st-mistakes

## 1. 타임라인 내부 tween마다 ScrollTrigger를 붙임
부모 타임라인의 playhead와 ScrollTrigger가 같은 playhead를 두고 충돌한다.
→ tween들을 독립시키거나, **부모 타임라인에 ScrollTrigger 하나만** 붙인다.

## 2. 같은 대상에 `.to()`를 여러 개 걸어 시작값이 캐시됨
```js
gsap.to("h1", { x: 100, scrollTrigger: {...} });
gsap.to("h1", { x: 200, scrollTrigger: {...} }); // 0으로 튄 뒤 200으로 감
```
→ `immediateRender: false`, 또는 뒤쪽 tween을 `.fromTo()`로, 또는 하나의 타임라인 + 단일 ScrollTrigger.

## 3. 여러 섹션을 tween 하나로 처리
전체가 동시에 움직인다. → 엘리먼트를 루프 돌며 **각각 tween 생성**.

## 4. 값을 하드코딩
```js
end: `+=${elem.offsetHeight}`      // 리사이즈 시 갱신 안 됨
end: () => `+=${elem.offsetHeight}` // 함수로 → 갱신됨
```
애니메이션 값도 갱신하려면 `invalidateOnRefresh: true`.

## 5. 재생 시점과 리셋 시점이 다름
화면 중앙에서 시작하되 화면 밖에서 리셋해야 한다면 → **ScrollTrigger 2개**(재생용/리셋용).

## 6. 스크롤 순서와 다른 생성 순서
`pinSpacing: true` 핀이 있으면 뒤 ScrollTrigger 위치 계산이 틀어진다.
→ 스크롤 순서대로 생성하거나 `refreshPriority`(값이 클수록 먼저 계산).

## 7. 콘텐츠 로드 후 refresh 누락
AJAX 콘텐츠·크기 없는 이미지 → 레이아웃 계산이 깨진다.
→ 로드 콜백에서 `ScrollTrigger.refresh()`.

## 8. scrub 애니메이션이 로드 시 점프
`start: "top bottom"`인데 페이지 최상단이면 시작점이 이미 지나 있다.
→ start를 스크롤 0 이후로 옮기거나 `start: "clamp(top bottom)"` (v3.12+).

## 9. 리사이즈 시 마커 어긋남
CSS `scroll-behavior: smooth`가 refresh 중 스크롤 복원을 지연시킨다.
→ `html { scroll-behavior: auto !important; }`

## 10. scrub의 duration을 늘려도 안 늘어남
scrub은 start~end 구간에 맞춰진다. → `duration`이 아니라 **`end` 값을 늘린다** (`end: "+=600"`).

## 11. SPA 이동 시 ScrollTrigger가 남음
언마운트에서 kill, 마운트에서 재생성. 필요하면 `ScrollTrigger.refresh()`.
```js
ScrollTrigger.getAll().forEach(t => t.kill());
```
