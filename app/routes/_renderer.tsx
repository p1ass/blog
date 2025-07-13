import { css, Style } from 'hono/css'
import { html } from 'hono/html'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { backgroundDark, border, gray } from '../styles/color'
import { verticalRhythmUnit } from '../styles/variables'

const codeBlockFontSize = 14

const bodyCss = css`
:-hono-global {
  body {
    color: ${gray};
    font-size: 16px;
    font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Segoe UI",
      "Roboto", "Noto Sans CJK JP", sans-serif, "Apple Color Emoji", "Segoe UI",
      "Emoji,Segoe UI", Symbol, "Noto Sans Emoji";
  
    margin: 0 1rem;
    padding: 0;
    
    /* https://alpacat.com/posts/unexpected-font-size-change */
    -webkit-text-size-adjust: 100%;
  }

  * {
    line-height: 1.7rem;
  }

  h2 {
    line-height: 2.55rem;
    font-size: 1.75rem
  }

  h3 {
    font-size: 1.3rem;
    line-height: 2.55rem;
    border-bottom: 1px solid #dde0e4;
  }

  p {
    margin: 0 0 1.7rem;
    line-height: ${verticalRhythmUnit * 1.25}rem;
    
    @media (max-width: 600px) {
      line-height: 2rem;
    }
  }

  code {
    background-color: ${backgroundDark};
    border: 1px solid ${border};
    border-radius: ${verticalRhythmUnit * 0.125}rem;
    font-family: monospace;
    font-size: 85%;
    padding: ${verticalRhythmUnit * 0.125}rem 0.5em;
  }
  
  .hljs {
    color: #abb2bf;
    background: #282c34;
  }
  .hljs-comment,
  .hljs-quote {
    color: #5c6370;
    font-style: italic;
  }
  .hljs-doctag,
  .hljs-keyword,
  .hljs-formula {
    color: #c678dd;
  }
  .hljs-section,
  .hljs-name,
  .hljs-selector-tag,
  .hljs-deletion,
  .hljs-subst {
    color: #e06c75;
  }
  .hljs-literal {
    color: #56b6c2;
  }
  .hljs-string,
  .hljs-regexp,
  .hljs-addition,
  .hljs-attribute,
  .hljs-meta .hljs-string {
    color: #98c379;
  }
  .hljs-attr,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-type,
  .hljs-selector-class,
  .hljs-selector-attr,
  .hljs-selector-pseudo,
  .hljs-number {
    color: #d19a66;
  }
  .hljs-symbol,
  .hljs-bullet,
  .hljs-link,
  .hljs-meta,
  .hljs-selector-id,
  .hljs-title {
    color: #61aeee;
  }
  .hljs-built_in,
  .hljs-title.class_,
  .hljs-class .hljs-title {
    color: #e6c07b;
  }
  .hljs-emphasis {
    font-style: italic;
  }
  .hljs-strong {
    font-weight: bold;
  }
  .hljs-link {
    text-decoration: underline;
  }
  
  code.hljs {
    display: block;
    overflow-x: auto;
    padding: ${verticalRhythmUnit * 0.5}rem;
  
    /* グローバルのcodeスタイルを上書き */
    font-size: ${codeBlockFontSize}px;
    font-family: monospace;
    border: none;
  }
  
  /* emgithub用 */
  .emgithub-file .code-area td.hljs-ln-line {
    font-size: ${codeBlockFontSize}px !important;
    font-family: monospace !important;
  }
}
`

const mainCss = css`
  margin: 0 auto;
  max-width: 800px;
`

export default jsxRenderer(
  ({ children, title: propsTitle, frontmatter }, c) => {
    const description =
      frontmatter?.description ||
      'Webエンジニアリングについて学んだことや考えたことをまとめるブログです'

    const title = propsTitle
      ? `${propsTitle} - ぷらすのブログ`
      : 'ぷらすのブログ'

    const ogImage = frontmatter?.ogImage
      ? `https://blog.p1ass.com${frontmatter.ogImage}`
      : frontmatter?.title
        ? `https://og-image.p1ass.com/apiv2/${encodeURIComponent(
            frontmatter?.title,
          )}.png`
        : 'https://blog.p1ass.com/static/ogp.png'
    return (
      <html lang='ja'>
        <head>
          <meta charset='utf-8' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0'
          />
          <title>{title}</title>

          <meta name='description' content={description} />
          <meta property='og:type' content='website' />
          <meta property='og:description' content={description} />
          <meta property='og:image' content={ogImage} />
          <meta
            property='og:url'
            content={`https://blog.p1ass.com${c.req.path}`}
          />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:site' content='@p1ass' />
          <meta name='twitter:creator' content='@p1ass' />
          <meta property='og:title' content={title} />

          {import.meta.env.PROD ? <GoogleAnalytics /> : null}

          <script
            src='https://kit.fontawesome.com/ea66b8338f.js'
            crossorigin='anonymous'
            async
          />
          <script
            async
            src='https://platform.twitter.com/widgets.js'
            charset='utf-8'
          />

          <link rel='icon' sizes='48x48' href='/static/favicon.ico' />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/static/apple-touch-icon.png'
          />
          <link
            href='/index.xml'
            rel='alternate'
            type='application/rss+xml'
            title='TODO'
          />
          <Script src='/app/client.ts' async />
          <Style />
        </head>
        <body class={bodyCss}>
          <Header />
          <main class={mainCss}>{children}</main>
          <Footer />
        </body>
      </html>
    )
  },
)

const GoogleAnalytics = () => {
  return (
    <>
      <script
        async
        src='https://www.googletagmanager.com/gtag/js?id=G-L66BDEDS3J'
      />
      {html`
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-L66BDEDS3J');
        </script>
      `}
    </>
  )
}
