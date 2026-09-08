# GSAP + React (`useGSAP`)

출처: https://gsap.com/resources/React

`useGSAP()`는 `useEffect`/`useLayoutEffect`의 대체품으로, `gsap.context()`를 이용해 **정리(cleanup)를 자동 처리**한다.

```bash
npm install @gsap/react
```

```js
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const container = useRef();
useGSAP(() => {
  gsap.to('.box', { x: 360 });
}, { scope: container });
```

React 18 Strict Mode는 로컬에서 Effect를 **두 번** 실행하므로, 정리가 없으면 애니메이션이 충돌한다.

## 옵션

| 속성 | 역할 |
|---|---|
| `scope` | 셀렉터 문자열을 해당 컨테이너 하위로 한정 |
| `dependencies` | 재실행을 제어하는 의존성 배열 |
| `revertOnUpdate` | true면 의존성 변경 시 context를 revert |

## 이벤트 핸들러 안의 애니메이션
훅 실행 *이후*(클릭 핸들러·setTimeout 등)에 만든 애니메이션은 자동 추적되지 않는다. `contextSafe()`로 감싼다.

```js
const { contextSafe } = useGSAP({ scope: container });

const onClick = contextSafe(() => {
  gsap.to('.good', { rotation: 180 });
});
```
