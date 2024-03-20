import { serveStatic } from '@hono/node-server/serve-static'
import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'

const app = createApp({
  trailingSlash: true,
  init(app) {
    app.get('/public/*', serveStatic({ root: './' }))
  },
})

showRoutes(app)

export default app
