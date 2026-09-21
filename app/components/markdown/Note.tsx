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

    .note-body {
      flex: 1;
      min-width: 0;
    }

    .note-body > * + * {
      margin-top: ${space.sm};
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
      <div class='note-body'>{children}</div>
    </aside>
  )
}
