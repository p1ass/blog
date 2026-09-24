import { css } from 'hono/css'
import { textOnWarningSurface, warningSurface } from '../styles/color'
import { radius } from '../styles/shape'
import { space } from '../styles/spacing'
import { fontSize, lineHeight } from '../styles/typography'

const draftBadgeCss = css`
  display: inline-block;
  margin-left: ${space.xs};
  padding: ${space['2xs']} ${space.xs};
  border-radius: ${radius.sm};
  background-color: ${warningSurface};
  color: ${textOnWarningSurface};
  font-size: ${fontSize.caption};
  line-height: ${lineHeight.tight};
  letter-spacing: normal;
  vertical-align: middle;
`

export function DraftBadge() {
  return <span class={draftBadgeCss}>下書き</span>
}
