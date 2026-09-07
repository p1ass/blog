import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import { mediaUp } from '../../styles/breakpoint'
import {
  accent,
  accentSurface,
  textOnAccentSurface,
  textOnTipSurface,
  textOnWarningSurface,
  tip,
  tipSurface,
  warning,
  warningSurface,
} from '../../styles/color'
import { radius } from '../../styles/shape'
import { blockGap, space } from '../../styles/spacing'
import { NoteIcon, type NoteKind } from '../Icons'

// 3 種別。既定は info。
//
// warning と tip だけは accent と別の色相を持つ。同じ色相の濃淡で分けると、
// 記事を流し読みしたときに「いつもと違う」が伝わらない。
const kindColors = {
  info: {
    surface: accentSurface,
    icon: accent,
    text: textOnAccentSurface,
  },
  warning: {
    surface: warningSurface,
    icon: warning,
    text: textOnWarningSurface,
  },
  tip: {
    surface: tipSurface,
    icon: tip,
    text: textOnTipSurface,
  },
} as const

// 種別ごとに違うのは 3 色だけなので、共通の形を 1 つ書いて色を差し込む。
function noteCss(kind: NoteKind) {
  const colors = kindColors[kind]
  return css`
    background-color: ${colors.surface};
    border-radius: ${radius.md};
    padding: ${space.md};
    margin-bottom: ${blockGap};
    display: flex;
    align-items: stretch;

    .icon-wrapper {
      height: auto;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      color: ${colors.icon};
      padding-right: ${space.md};
    }

    & p {
      margin: 0;
      color: ${colors.text};
    }

    ${mediaUp('sm')} {
      padding: ${space.lg};

      .icon-wrapper {
        padding-right: ${space.lg};
      }
    }
  `
}

const css_ = {
  info: noteCss('info'),
  warning: noteCss('warning'),
  tip: noteCss('tip'),
} as const

type Props = PropsWithChildren<{
  kind?: NoteKind
}>

export function Note({ kind = 'info', children }: Props) {
  return (
    <aside class={css_[kind]}>
      <div class='icon-wrapper'>
        <NoteIcon kind={kind} />
      </div>
      {children}
    </aside>
  )
}
