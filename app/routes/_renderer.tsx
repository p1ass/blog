import { css, Style } from 'hono/css'
import { html } from 'hono/html'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { contentWidth } from '../styles/breakpoint'
import {
  accent,
  border,
  surface,
  surfaceSubtle,
  text,
  textMuted,
} from '../styles/color'
import { highlightTheme } from '../styles/highlight'
import { reducedMotion } from '../styles/motion'
import { borderWidth, focusRing, radius } from '../styles/shape'
import { blockGap, space } from '../styles/spacing'
import { themeVariables } from '../styles/theme'
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} from '../styles/typography'

// 全ページ共通のスタイル。
//
// 説明はこの外に書く。hono/css の :-hono-global は
// /^:-hono-global{(.*)}$/ で判定していて、`.` は改行に一致しない。
// テンプレートの中に複数行のコメントを入れると最小化後も改行が残り、
// 判定に外れてグローバルとして展開されなくなる。クラスの中に入れ子の
// まま出力され、CSS 全体が無効になる。
//
// 行間は body に単位なしで置き、子要素に文字サイズ比で継承させる。
// 以前は全称セレクタで 1.7rem の行送りを固定していたため、見出しごとに
// 個別の上書きが必要だった。
//
// 章の切れ目の罫線は h2 に置く。以前は h3 にだけ罫線があり、見出しの重みと
// 装飾が逆転していた。h3 より下はサイズと余白だけで階層を作る。
//
// ただし罫線は記事本文 (article) の中に限る。一覧の記事タイトルも h2 だが、
// そちらには既にカード上端のアクセント線とタイトル下の線があり、罫線を足すと
// 短い範囲に線が 3 本並ぶ。
//
// h5 と h6 は本文と同じ大きさにして太さだけで区別する。これ以上小さくすると
// 本文より小さくなり、見出しに見えなくなる。
//
// overflow-wrap は、リンクのテキストが URL そのものになっている箇所のために置く。
// 区切りが無いためどこでも折り返せず、本文幅を 720px にしたことで画面からはみ出した。
//
// フォーカスリングは要素ごとではなく、ここに 1 つだけ置く。個別に書くと、書き忘れた要素だけキーボードで追えなくなる。
// :focus ではなく :focus-visible にするのは、マウスで押した直後にもリングが残るのを避けるため。ブラウザがキーボード操作だと判断したときにだけ出る。
// outline を使うのは、レイアウトを動かさずに描かれるため。border だと要素の大きさが変わり、周りが動く。
//
// prefers-reduced-motion は動きを止める設定への追従。0 にせず 0.01ms にするのは、transitionend を待つコードがあっても止まらないようにするため。
// アニメーションを持つ要素を将来足したときに書き漏らさないよう、全称セレクタで一括して止める。
//
// 見出しの余白は上を広く、下を狭くする。ブラウザ既定は上下が同じ 0.83em から 2.33em で、しかも自分のフォントサイズ基準なので、小さい見出しほど周りが空くという逆転が起きていた。
//
// リストの字下げは 24px にする。ブラウザ既定の 40px は本文 760px に対して深く、箇条書きだけが右に寄って見えた。
//
// 脚注の見出しは remark が `class="sr-only"` を付けて出力するが、その sr-only がどこにも定義されていなかった。英語の「Footnotes」が章の罫線つきで 6 記事に出ていた。
//
// article の直下の svg は Mermaid の図。入れ子の svg を避けるのは、Instagram の埋め込みが div の中に自前の svg を持っているため。
//
// pre の角丸は overflow: hidden と組で置く。中の code.hljs が横スクロールするので、hidden がないと角が四角いまま残る。
const bodyCss = css`
:-hono-global {
  ${themeVariables}

  body {
    color: ${text};
    background-color: ${surface};
    font-size: ${fontSize.body};
    font-family: ${fontFamily.body};

    line-height: ${lineHeight.body};
    overflow-wrap: break-word;

    margin: 0 ${space.md};
    padding: 0;

    /* https://alpacat.com/posts/unexpected-font-size-change */
    -webkit-text-size-adjust: 100%;
  }

  :focus-visible {
    outline: ${focusRing.width} solid ${accent};
    outline-offset: ${focusRing.offset};
  }

  ${reducedMotion} {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: ${lineHeight.heading};
    font-weight: ${fontWeight.bold};
  }

  h2 {
    font-size: ${fontSize.h2};
  }

  article h2 {
    border-bottom: 1px solid ${border};
    padding-bottom: ${space['2xs']};
  }

  h3 {
    font-size: ${fontSize.h3};
  }

  h4 {
    font-size: ${fontSize.h4};
  }

  h5, h6 {
    font-size: ${fontSize.body};
  }

  h2, h3, h4, h5, h6 {
    margin: ${blockGap} 0 ${space.md};
  }

  p {
    margin: 0 0 ${blockGap};
  }

  ul, ol {
    margin: 0 0 ${blockGap};
    padding-left: ${space.lg};
  }

  li {
    margin-bottom: ${space['2xs']};
  }

  li:last-child {
    margin-bottom: 0;
  }

  li > ul, li > ol {
    margin: ${space['2xs']} 0 0;
  }

  hr {
    border: 0;
    border-top: ${borderWidth.thin} solid ${border};
    margin: ${blockGap} 0;
  }

  details {
    border: ${borderWidth.thin} solid ${border};
    border-radius: ${radius.md};
    margin: 0 0 ${blockGap};
    padding: ${space.sm} ${space.md};
  }

  summary {
    cursor: pointer;
    font-weight: ${fontWeight.bold};
  }

  details[open] summary {
    margin-bottom: ${space.sm};
  }

  sup {
    line-height: 0;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    border: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .footnotes {
    border-top: ${borderWidth.thin} solid ${border};
    margin-top: ${blockGap};
    padding-top: ${space.lg};
    font-size: ${fontSize.bodySmall};
    color: ${textMuted};
  }

  article > svg {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto ${blockGap};
  }

  code {
    background-color: ${surfaceSubtle};
    border: 1px solid ${border};
    border-radius: ${radius.sm};
    font-family: ${fontFamily.mono};
    font-size: 0.85em;
    padding: 2px 6px;
  }

  pre {
    margin: 0 0 ${blockGap};
    border-radius: ${radius.md};
    overflow: hidden;
  }

  ${highlightTheme}

  code.hljs {
    display: block;
    overflow-x: auto;
    padding: ${space.md};

    /* グローバルのcodeスタイルを上書き */
    font-size: ${fontSize.code};
    font-family: ${fontFamily.mono};
    border: none;
  }

  /* emgithub用 */
  .emgithub-file .code-area td.hljs-ln-line {
    font-size: ${fontSize.code} !important;
    font-family: ${fontFamily.mono} !important;
  }
}
`

const mainCss = css`
  margin: 0 auto;
  max-width: ${contentWidth};
`

export default jsxRenderer(
  ({ children, title: propsTitle, frontmatter, noindex }, c) => {
    const description =
      frontmatter?.description ||
      'Webエンジニアリングについて学んだことや考えたことをまとめるブログです'

    const title = propsTitle
      ? `${propsTitle} - ぷらすのブログ`
      : 'ぷらすのブログ'

    const canonicalUrl = `https://blog.p1ass.com${c.req.path}`

    // 記事一覧のページには他に見出しが無いので、サイト名を h1 にする
    const isPostListPage = /^\/(?:page\/\d+\/)?$/.test(c.req.path)

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
          {noindex ? <meta name='robots' content='noindex' /> : null}
          <link rel='canonical' href={canonicalUrl} />
          <meta
            property='og:type'
            content={frontmatter ? 'article' : 'website'}
          />
          {frontmatter ? (
            <meta
              property='article:published_time'
              content={frontmatter.date}
            />
          ) : null}
          <meta property='og:description' content={description} />
          <meta property='og:image' content={ogImage} />
          <meta property='og:url' content={canonicalUrl} />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:site' content='@p1ass' />
          <meta name='twitter:creator' content='@p1ass' />
          <meta property='og:title' content={title} />

          {import.meta.env.PROD ? <GoogleAnalytics /> : null}

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
            title='ぷらすのブログ'
          />
          <Script src='/app/client.ts' async />
          <Style />
        </head>
        <body class={bodyCss}>
          <Header asHeading={isPostListPage} />
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
