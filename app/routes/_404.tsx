import type { NotFoundHandler } from 'hono'

const handler: NotFoundHandler = c => {
  return c.render(<h2>Not Foundだよ</h2>)
}

export default handler
