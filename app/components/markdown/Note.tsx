import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import { blue, blueLight, textOnBlueLight } from '../../styles/color'
import { verticalRhythmUnit } from '../../styles/variables'

const noteCss = css`
  background-color: ${blueLight};
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
    color: ${blue};
    padding-right: ${verticalRhythmUnit}rem;
  }

  p {
    margin: 0;
    color: ${textOnBlueLight};
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
