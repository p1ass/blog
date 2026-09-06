import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import { mediaUp } from '../../styles/breakpoint'
import { accent, accentSurface, textOnAccentSurface } from '../../styles/color'
import { radius } from '../../styles/shape'
import { blockGap, space } from '../../styles/spacing'

const noteCss = css`
  background-color: ${accentSurface};
  border-radius: ${radius.md};
  padding: ${space.md};
  margin-bottom: ${blockGap};
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
    padding-right: ${space.md};
  }

  & p {
    margin: 0;
    color: ${textOnAccentSurface};
  }

  ${mediaUp('sm')} {
    padding: ${space.lg};

    .fa-circle-info {
      padding-right: ${space.lg};
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
