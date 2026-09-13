// 減衰比 1 のばねを linear() で近似する。response は Apple の定義で、ばねの固有周期 (秒)。
function criticallyDampedSpring(response: number, durationMs: number) {
  const steps = 30
  const omega = (2 * Math.PI) / response
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    if (i === steps) {
      return 1
    }
    const t = ((i / steps) * durationMs) / 1000
    return Number((1 - (1 + omega * t) * Math.exp(-omega * t)).toFixed(4))
  })
  return `linear(${points.join(', ')})`
}

const springResponse = 0.35
const springDurationMs = 450

export const duration = {
  press: '100ms',
  exit: '100ms',
  fast: '150ms',
  base: '250ms',
  spring: `${springDurationMs}ms`,
} as const

// 組み込みの ease-out は出だしが弱く、押した直後に動いて見えないので、押したときの反応には強い曲線を当てる。
export const easing = {
  standard: 'ease',
  out: 'cubic-bezier(0.23, 1, 0.32, 1)',
  spring: criticallyDampedSpring(springResponse, springDurationMs),
} as const

export const pressScale = '0.97'

export const enterScale = '0.97'

export const reducedMotion = '@media (prefers-reduced-motion: reduce)'

// タッチ端末はタップで :hover が付いたまま残るので、hover の見た目はカーソルを持つ端末に限る。
export const canHover = '@media (hover: hover) and (pointer: fine)'

export type DurationToken = keyof typeof duration
export type EasingToken = keyof typeof easing
