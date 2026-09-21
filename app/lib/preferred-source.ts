// ボタンは作られるときにだけ data-theme を読み、同じ要素では作り直せないので、テーマが変わったら要素ごと差し替える。

import { onReady } from './on-ready'

type Theme = 'light' | 'dark'

const scriptSrc = 'https://news.google.com/swg/js/v1/publisher.js'

const darkQuery = '(prefers-color-scheme: dark)'

let loaded = false

function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme
  if (chosen === 'light' || chosen === 'dark') {
    return chosen
  }
  return window.matchMedia(darkQuery).matches ? 'dark' : 'light'
}

function buildButton(theme: Theme): HTMLDivElement {
  const button = document.createElement('div')
  button.setAttribute('google-add-preferred-source-btn', '')
  button.dataset.theme = theme
  return button
}

function initButtons(): void {
  window.PREFERRED_SOURCE = window.PREFERRED_SOURCE || []
  window.PREFERRED_SOURCE.push(api => api.init())
  if (loaded) {
    return
  }
  loaded = true
  const script = document.createElement('script')
  script.src = scriptSrc
  script.async = true
  document.head.appendChild(script)
}

export function setupPreferredSourceButtons(): void {
  onReady(() => {
    const containers = document.querySelectorAll<HTMLElement>(
      '[data-preferred-source]',
    )
    if (containers.length === 0) {
      return
    }

    let rendered: Theme | null = null
    const render = () => {
      const theme = currentTheme()
      if (theme === rendered) {
        return
      }
      rendered = theme
      for (const container of containers) {
        container.replaceChildren(buildButton(theme))
      }
      initButtons()
    }
    render()

    new MutationObserver(render).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    window.matchMedia(darkQuery).addEventListener('change', render)
  })
}
