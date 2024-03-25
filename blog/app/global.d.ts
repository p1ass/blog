import {} from 'hono'
import type { Frontmatter } from './routes/posts/types'

type Head = {
  title?: string

  frontmatter?: Frontmatter
}

declare module 'hono' {
  interface Env {
    Variables: {}
    Bindings: {}
  }
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      head?: Head,
    ): Response | Promise<Response>
  }
}
