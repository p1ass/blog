import { createRoute } from 'honox/factory'

export default createRoute(c => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /styleguide/

Sitemap: https://blog.p1ass.com/sitemap.xml
`
  return c.text(robotsTxt, 200, {})
})
