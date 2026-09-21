import { css } from 'hono/css'
import {
  type DurationToken,
  duration,
  easing,
  pressScale,
  reducedMotion,
} from './motion'

const movingProperties = new Set(['transform', 'scale', 'width'])

function movingPropertiesLast(properties: string[]) {
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

export function transition(
  properties: string[],
  token: DurationToken = 'fast',
) {
  const all = movingPropertiesLast(properties)
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

export function hoverTransition(
  properties: string[],
  { token = 'fast', pressable = false }: HoverTransitionOptions = {},
) {
  const all = movingPropertiesLast(
    pressable ? [...properties, 'scale'] : properties,
  )

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
