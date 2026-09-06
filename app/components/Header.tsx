import { css } from 'hono/css'
import { labelBasePath } from '../lib/posts'
import { mediaUp } from '../styles/breakpoint'
import { border, text, textMuted } from '../styles/color'
import { borderWidth } from '../styles/shape'
import { space } from '../styles/spacing'
import { transition } from '../styles/transition'
import { fontSize } from '../styles/typography'

const headerCss = css`
  overflow: auto;
  border-bottom: ${borderWidth.thin} solid ${border};
`

const headerContainerCss = css`
  margin: ${space.sm} auto;
  text-align: center;
`

const titleCss = css`
  ${transition('0.2s')}
  margin: ${space.xs} 0;
  color: ${text};
  text-decoration: none;
  
  
  &:hover,
  &:focus {
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
  margin: ${space.sm} 0;
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
      ${transition('0.2s')}
      text-decoration: none;

      &:hover,
      &:focus {
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
        <a href='/' class={titleCss}>
          <SiteTitle class={siteTitleCss}>ぷらすのブログ</SiteTitle>
        </a>
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
