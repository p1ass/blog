import type { TocItem } from './lib/toc'
import type { Frontmatter } from './routes/posts/types'

type Head = {
  frontmatter?: Frontmatter
  filepath?: string

  toc?: TocItem[]

  title?: string

  noindex?: boolean
}

declare global {
  interface Window {
    // head の同期スクリプトが定義する。
    __applyTheme?: (
      choice: 'system' | 'light' | 'dark',
      persist: boolean,
    ) => void

    // twitter-embed.ts が読み込む widgets.js が定義する。
    twttr?: {
      ready: (callback: () => void) => void
      widgets: { load: (element?: HTMLElement) => void }
    }
  }
}

declare module 'hono' {
  interface Env {
    Variables: {}
    Bindings: {}
  }
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: false positive
    (
      content: string | Promise<string>,
      head?: Head,
    ): Response | Promise<Response>
  }
}
