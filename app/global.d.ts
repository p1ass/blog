import type { TocItem } from './lib/toc'
import type { Frontmatter } from './routes/posts/types'

type Head = {
  frontmatter?: Frontmatter
  filepath?: string

  toc?: TocItem[]

  title?: string

  description?: string

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

    // preferred-source.ts が読み込む publisher.js が、読み込み前に積んだ関数を呼び、push を差し替える。
    PREFERRED_SOURCE?: {
      push: (callback: (api: { init: () => void }) => void) => void
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
