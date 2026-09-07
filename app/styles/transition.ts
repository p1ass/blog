import { css } from 'hono/css'
import { type DurationToken, duration, easing } from './motion'

// アニメーションさせるプロパティを名指しで書くための関数。
//
// 以前は transition: all だった。all は将来足したプロパティまで巻き込むので、色を変えるつもりの hover で padding や width まで動くことがある。
// ベンダープレフィックスも 3 行ぶん付いていたが、transition は主要ブラウザが 10 年以上前から無印で解釈するので落とした。
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
