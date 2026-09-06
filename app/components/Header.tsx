import { css } from 'hono/css'
import { labelBasePath } from '../lib/posts'
import { border, text, textMuted } from '../styles/color'
import { transition } from '../styles/transition'
import { fontSize } from '../styles/typography'

const headerCss = css`
  overflow: auto;
  border-bottom: 1px solid ${border};
`

const headerContainerCss = css`
  margin: 0.85rem auto;
  text-align: center;
`

const titleCss = css`
  margin: 0.425rem 0;

  ${transition('0.2s')}
  margin: 0.425rem 0;
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
  margin: 0.83em 0;
`

const navigationListCss = css`
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: center;

  & li {
    display: inline-block;
    padding: 0 1.5rem;
    margin: 0.2125rem 0 0.2125rem;
    
    @media (max-width: 600px) {
    padding: 0 0 .425rem 0;
    width: 100px;
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
