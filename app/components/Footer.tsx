import { css } from 'hono/css'
import { formatDate } from '../lib/time'
import { accent } from '../styles/color'
import { blockGap, space } from '../styles/spacing'
import { fontSize } from '../styles/typography'

const footerCss = css`
  padding: ${blockGap} 0;
  text-align: center;

  & span {
    display: inline-block;
    padding-top: ${space.sm};
    font-size: ${fontSize.caption};
  }

  & a {
    color: ${accent};
    text-decoration: none;
  }
`

export function Footer() {
  const now = new Date()
  return (
    <footer class={footerCss}>
      <script
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      />
      <ins
        class='adsbygoogle'
        style='display: block'
        data-ad-client='ca-pub-4978327687969784'
        data-ad-slot='2402861623'
        data-ad-format='auto'
        data-full-width-responsive='true'
      />
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      <span>
        このサイトではアクセス解析のためにCookieを利用した
        <a href='https://policies.google.com/technologies/partner-sites'>
          Google Analytics
        </a>
        を使用しています。
      </span>
      <br />
      <span>
        &copy;
        <time datetime={formatDate(now, 'YYYY-MM-DD')}>
          {formatDate(now, 'YYYY')}
        </time>
        &nbsp;p1ass. Powered By{' '}
        <a href='https://hono.dev/' target='_blank' rel='noopener noreferrer'>
          Hono
        </a>
        .
      </span>
    </footer>
  )
}
