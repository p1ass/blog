import { css } from 'hono/css'
import { githubBlack, xBlack } from '../styles/brand'
import { mediaUp } from '../styles/breakpoint'
import { border, text, textMuted } from '../styles/color'
import { borderWidth, radius } from '../styles/shape'
import { blockGap, space } from '../styles/spacing'
import { transition } from '../styles/transition'
import { fontSize } from '../styles/typography'
import { GitHubIcon, XIcon } from './Icons'

const authorWrapperCss = css`
  border: solid ${borderWidth.thin} ${border};
  padding: ${space.sm};
  border-radius: ${radius.md};
  display: flex;
  margin-bottom: ${blockGap};
`

const authorImageWrapper = css`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  margin: 0 ${space.md} 0 0;
  width: 80px;

  ${mediaUp('sm')} {
    width: 100px;
  }
`

const authorImageCss = css`
  border-radius: ${radius.full};
  border: ${borderWidth.thin} solid ${border};
  margin: 0;
  width: 100%;
  height: auto;
`

const authorNameCss = css`
  font-size: ${fontSize.h4};
  margin-bottom: ${space['2xs']};
  font-weight: bold;
`

const authorDescriptionCss = css`
  margin: 0;
  font-size: ${fontSize.bodySmall};
`

const authorSNSLinkCss = css`
  color: ${text};
  margin-right: ${space.md};
  text-decoration: none;

  ${transition(['color'])}

  &:hover {
      color: ${textMuted};
  }
`

const authorSNSGitHubCss = css`
  & svg {
    color: ${githubBlack};
    margin-right: ${space['2xs']};
  }
  ${authorSNSLinkCss}
`

const authorSNSXCss = css`
  & svg {
    color: ${xBlack};
    margin-right: ${space['2xs']};
  }
  ${authorSNSLinkCss}
`

export function Author() {
  return (
    <aside class={authorWrapperCss}>
      <div class={authorImageWrapper}>
        <img src={'/static/icon.png'} class={authorImageCss} alt='筆者画像' />
      </div>
      <div>
        <div class={authorNameCss}>ぷらす (p1ass)</div>
        <p class={authorDescriptionCss}>
          サーバーサイドエンジニア。GoやISUCONが好きです。
        </p>
        <a
          href='https://github.com/p1ass'
          class={authorSNSGitHubCss}
          target='_blank'
          rel='noopener noreferrer'
        >
          <GitHubIcon />
          p1ass
        </a>
        <a
          href='https://twitter.com/p1ass'
          class={authorSNSXCss}
          target='_blank'
          rel='noopener noreferrer'
        >
          <XIcon />
          p1ass
        </a>
      </div>
    </aside>
  )
}
