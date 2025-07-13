import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'

const app = createApp({
  trailingSlash: true,
  init(_app) {},
})

showRoutes(app)

export default app
