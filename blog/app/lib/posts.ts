import { Meta } from '../routes/types'
import { parseDate } from './time'

const POSTS_PER_PAGE = 10

const posts = import.meta.glob<{ frontmatter: Meta }>(
  '../routes/posts/**/*.mdx',
  {
    eager: true,
  },
)

function sortByDateDesc():
  | ((
      a: [string, { frontmatter: Meta }],
      b: [string, { frontmatter: Meta }],
    ) => number)
  | undefined {
  return ([_aid, aPost], [_bid, bPost]) => {
    const aDate = parseDate(aPost.frontmatter.date)
    const bDate = parseDate(bPost.frontmatter.date)
    return aDate.getTime() < bDate.getTime() ? 1 : -1
  }
}

type Post = {
  id: string
  frontmatter: Meta
}
type Posts = {
  posts: Post[]
  hasPrev: boolean
  hasNext: boolean
}

export function getPosts(page: number): Posts {
  const start = POSTS_PER_PAGE * (page - 1)
  const end = POSTS_PER_PAGE * page

  const allPosts = Object.entries(posts)
    .sort(sortByDateDesc())
    .map(([id, module]) => {
      console.log(id)
      return {
        id: id.replace(/^\.\.\/routes/, ''),
        frontmatter: module.frontmatter,
      }
    })
  const pagePosts = allPosts.slice(start, end)

  return {
    posts: pagePosts,
    hasPrev: page > 1,
    hasNext: allPosts.length > end,
  }
}
