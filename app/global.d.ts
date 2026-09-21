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
    __applyTheme?: (
      choice: 'system' | 'light' | 'dark',
      persist: boolean,
    ) => void

    twttr?: {
      ready: (callback: () => void) => void
      widgets: { load: (element?: HTMLElement) => void }
    }

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
