import type { TocItem } from './lib/toc'
import type { Frontmatter } from './routes/posts/types'

type Head = {
  frontmatter?: Frontmatter
  filepath?: string

  // 記事の見出しから作る目次。rehype-toc.ts が MDX モジュールから export する
  toc?: TocItem[]

  title?: string

  // 検索エンジンに載せないページで true にする
  noindex?: boolean
}

declare global {
  interface Window {
    // head の同期スクリプトが定義する。テーマの適用と保存はここに集約してあり、島からも呼ぶ。
    __applyTheme?: (
      choice: 'system' | 'light' | 'dark',
      persist: boolean,
    ) => void

    // platform.twitter.com/widgets.js が定義する。埋め込みのある記事でだけ、twitter-embed.ts が読み込む。
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
