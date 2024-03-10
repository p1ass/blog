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

function getAllPosts(): Post[] {
  const allPosts = Object.entries(posts)
    .sort(sortByDateDesc())
    .map(([id, module]) => {
      return {
        id: id.replace(/^\.\.\/routes/, ''),
        frontmatter: module.frontmatter,
      }
    })
  return allPosts
}

export function getPosts(page: number): Posts {
  const start = POSTS_PER_PAGE * (page - 1)
  const end = POSTS_PER_PAGE * page

  const allPosts = getAllPosts()
  const pagePosts = allPosts.slice(start, end)

  return {
    posts: pagePosts,
    hasPrev: page > 1,
    hasNext: allPosts.length > end,
  }
}

type Category = {
  name: string
  posts: Post[]
}

export function getCategories(): Category[] {
  const allPosts = getAllPosts()
  const groupedByCategory = groupBy(allPosts, p => p.frontmatter.categories[0])

  return Object.entries(groupedByCategory).map(([name, posts]) => {
    return {
      name: name,
      posts: posts,
    }
  })
}

const groupBy = <K extends PropertyKey, V>(
  array: readonly V[],
  getKey: (cur: V, idx: number, src: readonly V[]) => K,
) =>
  array.reduce(
    (obj, cur, idx, src) => {
      const key = getKey(cur, idx, src)
      if (obj[key]) {
        obj[key]?.push(cur)
        return obj
      }
      obj[key] = []
      obj[key]?.push(cur)
      return obj
    },
    {} as Record<K, V[]>,
  )
