import type { Frontmatter } from './routes/posts/types'

type Head = {
  frontmatter?: Frontmatter
  filepath?: string

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
