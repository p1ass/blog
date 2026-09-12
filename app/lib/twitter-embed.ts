// ツイートの埋め込み。ブラウザでだけ動く。
//
// 以前は widgets.js を全ページの head で読んでいた。埋め込みがあるのは 77 記事のうち 16 記事だけなので、
// 残りのページは使わないスクリプトのために外部への通信を 1 本増やしていた。ここではページに blockquote があるときだけ読む。
//
// 島にはしなかった。ヘッダーのテーマの選択が島になっていて、同じページでその後に描かれる島は honox-island に包まれない。
// 包まれないと水和もされないので、島にすると埋め込みが動かなくなる。原因は hono/jsx の文脈が最初の島の後ろへ漏れることで、こちらでは直せない。
//
// テーマは blockquote の data-theme で渡す。ウィジェットはこの属性を作られるときに 1 度だけ読むため、
// 読者がテーマを切り替えたときは、こちらで作り直す。読者が選んだテーマと OS の設定の両方を見る。

import { onReady } from './on-ready'

type Theme = 'light' | 'dark'

const scriptSrc = 'https://platform.twitter.com/widgets.js'

const darkQuery = '(prefers-color-scheme: dark)'

let widgets: Promise<Window['twttr']> | null = null

function loadWidgets(): Promise<Window['twttr']> {
  if (widgets === null) {
    widgets = new Promise(resolve => {
      const script = document.createElement('script')
      script.src = scriptSrc
      script.async = true
      script.charset = 'utf-8'
      // 読み込めなかったときは undefined を返す。blockquote が引用とリンクのまま残る。
      script.onerror = () => resolve(undefined)
      script.onload = () => window.twttr?.ready(() => resolve(window.twttr))
      document.head.appendChild(script)
    })
  }
  return widgets
}

// 読者が選んだテーマを先に見る。html の data-theme は選んだときだけ付き、選んでいなければ OS の設定に従う。
function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme
  if (chosen === 'light' || chosen === 'dark') {
    return chosen
  }
  return window.matchMedia(darkQuery).matches ? 'dark' : 'light'
}

function buildQuote(url: string, theme: Theme): HTMLQuoteElement {
  const quote = document.createElement('blockquote')
  quote.className = 'twitter-tweet'
  quote.dataset.theme = theme
  const link = document.createElement('a')
  link.href = url
  link.textContent = url
  quote.append(link)
  return quote
}

export function setupTwitterEmbeds(): void {
  onReady(() => {
    // 作り直す単位は blockquote を包む div。ウィジェットは blockquote を iframe に置き換えるので、置き場所が要る。
    const embeds: { container: HTMLElement; url: string }[] = []
    for (const quote of document.querySelectorAll('blockquote.twitter-tweet')) {
      const container = quote.parentElement
      const url = quote.querySelector('a')?.href
      if (container !== null && url !== undefined) {
        embeds.push({ container, url })
      }
    }
    if (embeds.length === 0) {
      return
    }

    let rendered: Theme | null = null
    const render = async () => {
      const theme = currentTheme()
      if (theme === rendered) {
        return
      }
      rendered = theme
      for (const { container, url } of embeds) {
        container.replaceChildren(buildQuote(url, theme))
      }
      const twttr = await loadWidgets()
      // 読み込みを待つ間にテーマが変わっていたら、後から始まったほうに任せる。
      if (rendered === theme) {
        twttr?.widgets.load()
      }
    }
    render()

    // テーマの切り替えを見る。読者の選択は html の data-theme、OS の設定は matchMedia から届く。
    new MutationObserver(render).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    window.matchMedia(darkQuery).addEventListener('change', render)
  })
}
