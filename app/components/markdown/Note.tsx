import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import { accent, accentSurface, textOnAccentSurface } from '../../styles/color'
import { verticalRhythmUnit } from '../../styles/variables'

const noteCss = css`
  background-color: ${accentSurface};
  border-radius: ${verticalRhythmUnit * 0.5}rem;
  padding: ${verticalRhythmUnit * 0.75}rem ${verticalRhythmUnit}rem;
  margin-bottom: ${verticalRhythmUnit}rem;
  display: flex;
  align-items: stretch;

  .icon-wrapper {
    height: auto;
    display: flex;
    align-items: center;
  }

  .fa-circle-info {
    font-size: 1.5rem;
    color: ${accent};
    padding-right: ${verticalRhythmUnit}rem;
  }

  & p {
    margin: 0;
    color: ${textOnAccentSurface};
  }

  @media (max-width: 600px) {
    padding: ${verticalRhythmUnit * 0.5}rem;

    .fa-circle-info {
      padding-right: ${verticalRhythmUnit * 0.5}rem;
    }
  }
`

export function Note({ children }: PropsWithChildren) {
  return (
    <aside class={noteCss}>
      <div class='icon-wrapper'>
        <i class='fa-solid fa-circle-info' />
      </div>
      {children}
    </aside>
  )
}
