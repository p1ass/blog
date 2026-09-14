import type { NotFoundHandler } from 'hono'
import { NotFound } from '../components/NotFound'

const handler: NotFoundHandler = c => {
  c.status(404)
  return c.render(<NotFound />, { noindex: true })
}

export default handler
