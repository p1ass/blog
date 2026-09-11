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
// テーマの選択は、今の選択のアイコンだけを出す。引き金には枠と地を持たせない。ヘッダーは文字のリンクだけでできていて箱を持つ要素が 1 つもないので、枠を付けるとここだけ重くなる。
// hover では surfaceHover の丸を敷き、色も icon から text へ濃くする。色だけを変えても、指しているかどうかが分からない。本文のリンクに面を敷いているのと同じ考え方で、面はシェアボタンと同じ 48px の丸になる。
// 開いている間も同じ見た目にする。一覧を出しているのがこのボタンだと分かる。
//
// 画面の幅によらず右上へ絶対配置する。並びの中に流し込むと、狭い画面でヘッダーがもう 1 行ぶん高くなる。48px の当たり判定はそのまま保つ。
// 基準はヘッダー全体ではなくタイトルの行で、その上下の中央に置く。ヘッダー全体を基準にすると、案内の並びのぶんだけ中心が下がり、タイトルより 7px 下にずれる。
//
// 開く一覧はこちらのトークンで組む。面は surface、枠は border、角丸は md で、影は使わない。項目の角丸だけ sm にして、外側の枠との二重の丸みを避ける。
// 今の選択にはチェックを添える。面の濃さで示すと hover の面より弱く見え、どちらが今の選択か読み取れない。文字の色を accent にする手もあるが、白地で 4.40 対 1 しかなく本文の基準を割る。
// 文言は折り返さない。「端末の設定に合わせる」が 2 行になると、項目の高さが 1 つだけ変わる。
// 一覧はヘッダーからはみ出すので、header の overflow: auto は display: flow-root に替えてある。余白の相殺を止める役目だけが要る。
//
// 出すアイコンは html の data-theme-choice を見て CSS が選ぶ。島の状態で選ぶと、水和するまで SSR のときのアイコンが出たままになる。
// コンポーネントそのものは data-theme-choice が付くまで隠す。スクリプトが動かない読者に、押しても何も起きないものを見せないため。
//
// article の直下の svg は Mermaid の図。入れ子の svg を避けるのは、Instagram の埋め込みが div の中に自前の svg を持っているため。
// 図の色はビルド時に確定するので、暗いテーマでも線と文字は暗いまま出る。地に白い面を敷いて、図だけ明るいまま見せる。コードブロックを常に暗いまま置いているのと同じ扱いにした。明るいテーマでは diagramSurface が透明なので、面は出ない。
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
          {/* ブラウザの UI をページの地に合わせる。値は theme.ts の surface と同じもので、CSS 変数は meta では使えないので書き写す */}
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

// テーマの適用。
//
// head に同期で置く。非同期にすると、記憶した選択が当たる前に一度描かれ、リロードのたびに色が入れ替わって見える。
// theme-color の meta より後ろに置くのは、この場でその meta を書き換えるため。head の解析はここまでしか進んでいない。
//
// 適用と保存をこの関数 1 つに集めて、島からも呼ぶ。2 箇所に書くと、読み込み直後と押した直後で挙動が分かれる。
//
// theme-color は media 属性で 2 つ置いてあり、既定では OS の設定で選ばれる。読者が明示的に選んだときは、
// 選んだ側を all、もう片方を not all にして、OS ではなく選択のほうを見るようにする。
//
// localStorage は例外を投げることがある。Cookie を全部断る設定のブラウザで、読むだけでも投げる。
// テーマは落ちても致命的ではないので、握りつぶして既定のまま進む。
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
