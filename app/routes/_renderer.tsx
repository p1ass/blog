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
  diagramSurface,
  icon,
  surface,
  surfaceHover,
  surfaceSubtle,
  text,
  textMuted,
} from '../styles/color'
import { highlightTheme } from '../styles/highlight'
import { reducedMotion } from '../styles/motion'
import { borderWidth, focusRing, radius } from '../styles/shape'
import { blockGap, space } from '../styles/spacing'
import { dark, light, themeVariables } from '../styles/theme'
import { transition } from '../styles/transition'
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} from '../styles/typography'

// :-hono-global は複数行のコメントがあると展開されないので、説明はテンプレートの外に書く。
// reduced motion で 0 ではなく 0.01ms にするのは、transitionend を待つ処理を止めないため。
// .theme-picker は、スクリプトが動かない読者に押しても反応しないボタンを見せないよう、data-theme-choice が付くまで隠す。
// article > svg は Mermaid の図で、色がビルド時に決まり暗いテーマでも暗い線のまま出るので、明るい面を敷く。
// pre の overflow: hidden は、中の code.hljs が横スクロールしても角丸を保つため。
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
    border-bottom: ${borderWidth.thin} solid ${border};
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

  article :is(h2, h3) {
    scroll-margin-top: ${space.lg};
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

  .theme-picker {
    display: none;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  :root[data-theme-choice] .theme-picker {
    display: block;
  }

  .theme-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${space['2xl']};
    height: ${space['2xl']};
    padding: 0;
    border: 0;
    border-radius: ${radius.full};
    background-color: transparent;
    color: ${icon};
    cursor: pointer;
    ${transition(['background-color', 'color'])}
  }

  .theme-trigger:hover,
  .theme-trigger[aria-expanded=true] {
    background-color: ${surfaceHover};
    color: ${text};
  }

  .theme-choice {
    display: none;
  }

  :root[data-theme-choice=system] .theme-choice-system,
  :root[data-theme-choice=light] .theme-choice-light,
  :root[data-theme-choice=dark] .theme-choice-dark {
    display: inline-flex;
  }

  .theme-menu {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1;
    min-width: 240px;
    padding: ${space['2xs']};
    border: ${borderWidth.thin} solid ${border};
    border-radius: ${radius.md};
    background-color: ${surface};
    text-align: left;
  }

  .theme-option {
    display: flex;
    align-items: center;
    gap: ${space.xs};
    width: 100%;
    padding: ${space.xs} ${space.sm};
    border: 0;
    border-radius: ${radius.sm};
    background-color: transparent;
    color: ${text};
    font-size: ${fontSize.bodySmall};
    font-family: inherit;
    line-height: ${lineHeight.tight};
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
    ${transition(['background-color'])}
  }

  .theme-option:hover {
    background-color: ${surfaceHover};
  }

  .theme-check {
    display: inline-flex;
    margin-left: auto;
    color: ${accent};
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
    background-color: ${diagramSurface};
    border-radius: ${radius.md};
  }

  code {
    background-color: ${surfaceSubtle};
    border: ${borderWidth.thin} solid ${border};
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
      : frontmatter
        ? `${canonicalUrl}og.png`
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
          {/* CSS 変数は meta で使えないので、theme.ts の値を書き写す */}
          <meta
            name='theme-color'
            content={light.surface}
            media='(prefers-color-scheme: light)'
            data-scheme='light'
          />
          <meta
            name='theme-color'
            content={dark.surface}
            media='(prefers-color-scheme: dark)'
            data-scheme='dark'
          />
          <ThemeScript />
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

// 非同期にすると保存したテーマが当たる前に一度描画され色がちらつくので、head に同期で置く。書き換える theme-color の meta より後ろに置く。
// localStorage は Cookie を拒否する設定だと読むだけで例外を投げるので、握りつぶして既定のテーマで進める。
const ThemeScript = () => {
  return html`
    <script>
      (function () {
        var root = document.documentElement;
        function apply(choice, persist) {
          root.dataset.themeChoice = choice;
          if (choice === 'system') {
            root.removeAttribute('data-theme');
          } else {
            root.setAttribute('data-theme', choice);
          }
          var metas = document.querySelectorAll('meta[name=theme-color]');
          for (var i = 0; i < metas.length; i++) {
            var scheme = metas[i].getAttribute('data-scheme');
            metas[i].media =
              choice === 'system'
                ? '(prefers-color-scheme: ' + scheme + ')'
                : choice === scheme
                  ? 'all'
                  : 'not all';
          }
          if (persist) {
            try {
              if (choice === 'system') {
                localStorage.removeItem('theme');
              } else {
                localStorage.setItem('theme', choice);
              }
            } catch (e) {}
          }
        }
        window.__applyTheme = apply;
        var stored = null;
        try {
          stored = localStorage.getItem('theme');
        } catch (e) {}
        apply(stored === 'light' || stored === 'dark' ? stored : 'system', false);
      })();
    </script>
  `
}

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
