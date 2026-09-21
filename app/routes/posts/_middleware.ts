import { isSSGContext, X_HONO_DISABLE_SSG_HEADER_KEY } from 'hono/ssg'
import { createRoute } from 'honox/factory'
import { isDraft } from '../../lib/posts'

export default createRoute(async (c, next) => {
  const slug = c.req.path.match(/^\/posts\/([^/]+)\/?$/)?.[1]
  if (slug !== undefined && isDraft(slug) && isSSGContext(c)) {
    c.header(X_HONO_DISABLE_SSG_HEADER_KEY, 'true')
    return c.notFound()
  }
  await next()
})
