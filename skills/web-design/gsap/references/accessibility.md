# GSAP 접근성

출처: https://gsap.com/resources/a11y

## prefers-reduced-motion — `gsap.matchMedia()`

```js
let mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  gsap.to(".box", { rotation: 360, repeat: -1 });
});

mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.from(".box", { opacity: 0 });   // 축소된 대안
});
```

## 줄일 것인가, 없앨 것인가
1. **유발 위험**: 번쩍임·빠른 컷·큰 축 이동은 발작·멀미 위험. 마이크로 인터랙션과 opacity 변화는 상대적으로 안전.
2. **목적**: 장식적 애니메이션은 **제거**, 기능적 애니메이션(진행률 표시 등)은 **단순화**.

OS 설정과 별개로 **UI 안에 모션 토글**을 제공하면 사용자가 직접 통제할 수 있다.

## SplitText와 스크린리더
v3.13.0부터 SplitText가 부모에 `aria-label`을, 쪼갠 자식에 `aria-hidden="true"`를 자동 부여한다 — 글자 단위로 읽히지 않게 한다.
링크·태그 등 중첩 인터랙티브 요소가 있으면 `aria: false`로 기본 ARIA를 끄고 스크린리더 전용 복제본을 따로 만든다.
