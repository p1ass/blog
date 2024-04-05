import { createRoute } from 'honox/factory'

export default createRoute(c => {
  const robotsTxt = `Use-Agent: *
Allow: /`
  return c.text(robotsTxt, 200, {})
})
