import { css } from 'hono/css'
import { type DurationToken, duration, easing } from './motion'

// transition: all は色を変えるつもりの hover で padding や width まで動かすので、プロパティを名指しする。
export function transition(
  properties: string[],
  token: DurationToken = 'fast',
) {
  return css`
    transition-property: ${properties.join(', ')};
    transition-duration: ${duration[token]};
    transition-timing-function: ${easing};
  `
}
