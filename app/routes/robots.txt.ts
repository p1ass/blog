import { createRoute } from 'honox/factory'

export default createRoute(c => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /styleguide/`
  return c.text(robotsTxt, 200, {})
})
