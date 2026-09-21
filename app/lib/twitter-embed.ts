// ウィジェットは data-theme を作られるときに 1 度だけ読むので、テーマが変わったら作り直す。

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
      script.onerror = () => resolve(undefined)
      script.onload = () => window.twttr?.ready(() => resolve(window.twttr))
      document.head.appendChild(script)
    })
  }
  return widgets
}

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
      if (rendered === theme) {
        twttr?.widgets.load()
      }
    }
    render()

    new MutationObserver(render).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    window.matchMedia(darkQuery).addEventListener('change', render)
  })
}
