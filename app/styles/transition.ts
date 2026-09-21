import { css } from 'hono/css'
import {
  type DurationToken,
  duration,
  easing,
  pressScale,
  reducedMotion,
} from './motion'

const movingProperties = new Set(['transform', 'scale', 'width'])

// 動きを減らす設定で後ろの動くプロパティだけを外しても、長さと曲線の並びがずれないよう、動くものを後ろに並べる。
function ordered(properties: string[]) {
  return [
    ...properties.filter(property => !movingProperties.has(property)),
    ...properties.filter(property => movingProperties.has(property)),
  ]
}

function timing(properties: string[], token: DurationToken, pressing = false) {
  const picked = properties.map(property => {
    if (pressing && property === 'scale') {
      return [duration.press, easing.out]
    }
    if (movingProperties.has(property)) {
      return [duration.spring, easing.spring]
    }
    return [duration[token], easing.standard]
  })

  return css`
    transition-duration: ${picked.map(([d]) => d).join(', ')};
    transition-timing-function: ${picked.map(([, e]) => e).join(', ')};
  `
}

// 位置と大きさはばねで動かし、長さは token によらない。動きを減らす設定ではそれを外し、色の補間は状態の変化を伝えるので残す。
export function transition(
  properties: string[],
  token: DurationToken = 'fast',
) {
  const all = ordered(properties)
  const still = all.filter(property => !movingProperties.has(property))

  return css`
    transition-property: ${all.join(', ')};
    ${timing(all, token)}

    ${reducedMotion} {
      transition-property: ${still.length > 0 ? still.join(', ') : 'none'};
    }
  `
}

type HoverTransitionOptions = {
  token?: DurationToken
  pressable?: boolean
}

// 読者が選んでいる途中の変化より、離れたときの戻りを速くする。
// 押したときは即座に縮め、離したときはばねで戻す。
export function hoverTransition(
  properties: string[],
  { token = 'fast', pressable = false }: HoverTransitionOptions = {},
) {
  const all = ordered(pressable ? [...properties, 'scale'] : properties)

  return css`
    ${transition(all, 'exit')}

    &:hover,
    &:focus-visible {
      ${timing(all, token)}
    }

    ${
      pressable
        ? css`
          &:active {
            scale: ${pressScale};
            ${timing(all, token, true)}
          }
        `
        : ''
    }
  `
}
