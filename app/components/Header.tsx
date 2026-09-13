import { css } from 'hono/css'
import ThemePicker from '../islands/ThemePicker'
import { labelBasePath } from '../lib/posts'
import { mediaUp } from '../styles/breakpoint'
import { border, text, textMuted } from '../styles/color'
import { canHover } from '../styles/motion'
import { borderWidth } from '../styles/shape'
import { space } from '../styles/spacing'
import { hoverTransition } from '../styles/transition'
import { fontSize, lineHeight } from '../styles/typography'

// overflow: auto だとテーマの一覧がヘッダーの外で切れるので、display: flow-root で余白の相殺だけを止める。
const headerCss = css`
  display: flow-root;
  border-bottom: ${borderWidth.thin} solid ${border};
`

const headerContainerCss = css`
  margin: ${space.sm} auto;
  text-align: center;
`

// 見出しに margin を残すと余白が親をすり抜け、テーマの選択を上下の中央に置く基準の高さがずれる。
const titleRowCss = css`
  position: relative;
  margin-bottom: ${space.sm};
`

const titleCss = css`
  ${hoverTransition(['color'])}
  margin: 0;
  color: ${text};
  text-decoration: none;

  ${canHover} {
    &:hover {
      color: ${textMuted};
    }
  }
  &:focus-visible {
    color: ${textMuted};
  }

  &:after {
    display: none;
  }
`

// 記事一覧では h1、それ以外では div になる。行間を指定しないと div だけ本文の行間を継承してヘッダーが高くなり、ページを移るときにヘッダーが伸び縮みする。
const siteTitleCss = css`
  font-size: ${fontSize.h3};
  font-weight: bold;
  line-height: ${lineHeight.heading};
  margin: 0;
`

const navigationListCss = css`
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: center;

  & li {
    display: inline-block;
    padding: 0 0 ${space.xs} 0;
    width: 100px;

    ${mediaUp('sm')} {
      padding: 0 ${space.lg};
      margin: ${space['2xs']} 0;
      width: auto;
    }

    & a {
      color: ${textMuted};
      ${hoverTransition(['color'])}
      text-decoration: none;

      ${canHover} {
        &:hover {
          color: ${text};
        }
      }
      &:focus-visible {
        color: ${text};
      }
    }
  }
`

type Props = {
  // 記事一覧のページでだけ、サイト名をそのページの見出しにする。
  asHeading: boolean
}

export const Header = ({ asHeading }: Props) => {
  const SiteTitle = asHeading ? 'h1' : 'div'

  return (
    <header class={headerCss}>
      <div class={headerContainerCss}>
        <div class={titleRowCss}>
          <a href='/' class={titleCss}>
            <SiteTitle class={siteTitleCss}>ぷらすのブログ</SiteTitle>
          </a>
          <ThemePicker />
        </div>
        <ul class={navigationListCss}>
          <li>
            <a href={`${labelBasePath.category}/`}>Categories</a>
          </li>
          <li>
            <a href={`${labelBasePath.tag}/`}>Tags</a>
          </li>
          <li>
            <a href='/index.xml'>RSS</a>
          </li>
          <li>
            <a
              href='https://p1ass.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              Portfolio
            </a>
          </li>
          <li>
            <a
              href='https://github.com/p1ass'
              target='_blank'
              rel='noopener noreferrer'
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href='https://twitter.com/p1ass'
              target='_blank'
              rel='noopener noreferrer'
            >
              Twitter
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
