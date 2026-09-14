import { createRoute } from 'honox/factory'
import type { Post } from '../lib/posts'
import { getAllPosts, postPermalink } from '../lib/posts'
import { formatDate, parseDate } from '../lib/time'

const SITEMAP_DATE_FORMAT = 'YYYY-MM-DD'

// Google は lastmod が実際の更新と食い違うサイトでは lastmod を使わなくなるので、トップはビルドした日ではなく最新の記事の日付にする。
function generateSitemap(posts: Post[]): string {
  const latest = posts[0]
    ? `
        <lastmod>${formatDate(parseDate(posts[0].frontmatter.date), SITEMAP_DATE_FORMAT, 'en')}</lastmod>`
    : ''
  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://blog.p1ass.com/</loc>${latest}
    </url>
    ${posts.map(post => generateSitemapItem(post)).join('\n')}
</urlset>`
}

function generateSitemapItem(post: Post): string {
  return `<url>
      <loc>https://blog.p1ass.com${postPermalink(post.slug)}</loc>
      <lastmod>${formatDate(parseDate(post.frontmatter.date), SITEMAP_DATE_FORMAT, 'en')}</lastmod>
    </url>`
}

export default createRoute(c => {
  const rss = generateSitemap(getAllPosts())
  return c.text(rss, 200, {
    'Content-Type': 'application/xml',
  })
})
