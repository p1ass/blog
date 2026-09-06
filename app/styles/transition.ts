import { css } from 'hono/css'

// ベンダープレフィックス付きの transition。同じ 3 行が各所にコピペされていた。
export function transition(duration: string, easing = 'ease-out') {
  return css`
    -webkit-transition: all ${duration} ${easing};
    -moz-transition: all ${duration} ${easing};
    -o-transition: all ${duration} ${easing};
    transition: all ${duration} ${easing};
  `
}
