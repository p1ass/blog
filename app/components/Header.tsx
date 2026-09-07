import { css } from 'hono/css'
import ThemePicker from '../islands/ThemePicker'
import { labelBasePath } from '../lib/posts'
import { mediaUp } from '../styles/breakpoint'
import { border, text, textMuted } from '../styles/color'
import { borderWidth } from '../styles/shape'
import { space } from '../styles/spacing'
import { transition } from '../styles/transition'
import { fontSize } from '../styles/typography'

// overflow: auto ではなく display: flow-root にするのは、開いた一覧がヘッダーの外へ出るため。
// どちらも中の余白がヘッダーの外へ相殺されるのを止めるが、overflow は同時にはみ出しも切り落とす。
const headerCss = css`
  display: flow-root;
  border-bottom: ${borderWidth.thin} solid ${border};
`

const headerContainerCss = css`
  margin: ${space.sm} auto;
  text-align: center;
`

// タイトルの行。テーマの選択はこの行を基準に上下の中央へ置く。
// ヘッダー全体を基準にすると、案内の並びのぶんだけ中心が下がり、タイトルより下にずれる。
//
// 行の余白はこの div が持ち、中の見出しは margin を持たない。
// 見出し側に残すと、余白が親をすり抜けて相殺され、行の高さがタイトルの高さと合わなくなる。
const titleRowCss = css`
  position: relative;
  margin-bottom: ${space.sm};
`

const titleCss = css`
  ${transition(['color'])}
  margin: 0;
  color: ${text};
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: ${textMuted};
  }

  &:after {
    display: none;
  }
`

// h2 に付いていた既定のスタイルを、要素を変えても保つ
const siteTitleCss = css`
  font-size: ${fontSize.h3};
  font-weight: bold;
  margin: 0;
`

const navigationListCss = css`
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: center;

  & li {
    display: inline-block;
    /* 狭い画面を既定にして、広がったときだけ横並びの余白にする */
    padding: 0 0 ${space.xs} 0;
    width: 100px;

    ${mediaUp('sm')} {
      padding: 0 ${space.lg};
      margin: ${space['2xs']} 0;
      width: auto;
    }

    & a {
      color: ${textMuted};
      ${transition(['color'])}
      text-decoration: none;

      &:hover,
      &:focus-visible {
        color: ${text};
      }
    }
  }
`

type Props = {
  // 記事一覧のページでは、サイト名がそのページの見出しになる。
  // 記事ページやカテゴリページには別の見出しがあるため、ここでは見出しにしない。
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
