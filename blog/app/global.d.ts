import {} from 'hono'
import { Meta } from './routes/types'

type Head = {
  title?: string
  description?: string

  frontmatter?: Meta
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
