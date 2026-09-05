import { createRoute } from 'honox/factory'
import type { Post } from '../lib/posts'
import { getAllPosts, postPermalink } from '../lib/posts'
import { formatDate, parseDate } from '../lib/time'

// RFC 822 の date-time。24 時間表記で、オフセットはコロン無しで書く。
// JST 固定で出すため、オフセットはリテラルとして付ける。
const RSS_DATE_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss'

function toRfc822(date: string): string {
  return `${formatDate(parseDate(date), RSS_DATE_FORMAT, 'en')} +0900`
}

function generateRss(posts: Post[]): string {
  const title = 'ぷらすのブログ'
  const baseUrl = 'https://blog.p1ass.com'
  const buildDate = new Date()

  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${baseUrl}</link>
    <description>Recent content on ${title}</description>
    <generator>github.com/p1ass/blog</generator>
    <language>ja</language>
    <lastBuildDate>${formatDate(buildDate, RSS_DATE_FORMAT, 'en')} +0900</lastBuildDate>
    <atom:link href="/index.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(post => generateRssItem(post)).join('\n')}
  </channel>
</rss>`
}

function generateRssItem(post: Post): string {
  const encodedTitle = encodeURIComponent(post.frontmatter.title)
  const ogImage = post.frontmatter.ogImage
    ? `https://blog.p1ass.com${post.frontmatter.ogImage}`
    : `https://og-image.p1ass.com/apiv2/${encodedTitle}.png`

  return `<item>
      <title>${post.frontmatter.title}</title>
      <link>https://blog.p1ass.com${postPermalink(post.slug)}</link>
      <pubDate>${toRfc822(post.frontmatter.date)}</pubDate>
      <guid>https://blog.p1ass.com${postPermalink(post.slug)}</guid>
      <enclosure url="${ogImage}" length="0" type="image/png"/>
      <description>${post.frontmatter.description}</description>
    </item>`
}

export default createRoute(c => {
  const rss = generateRss(getAllPosts())
  return c.text(rss, 200, {
    'Content-Type': 'application/xml',
  })
})
