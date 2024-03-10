import { Meta } from '../routes/types'
import { parseDate } from './time'
import { groupBy } from './util'

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

export type PaginationPosts = {
  prevPost: Post | null
  nextPost: Post | null
}

export function getPaginationPosts(currentPostTitle: string): PaginationPosts {
  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex(
    p => p.frontmatter.title === currentPostTitle,
  )
  return {
    prevPost:
      currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
    nextPost: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
  }
}

type Category = {
  id: string
  name: string
  posts: Post[]
}

export function getCategories(): Category[] {
  const allPosts = getAllPosts()
  const groupedByCategory = groupBy(allPosts, p => p.frontmatter.categories[0])

  return Object.entries(groupedByCategory).map(([name, posts]) => {
    return {
      id: categoryNameToId(name),
      name: name,
      posts: posts,
    }
  })
}

type CategoryPosts = {
  hasPrev: boolean
  hasNext: boolean
} & Category

export function getCategoryPosts(
  categoryId: string,
  page: number,
): CategoryPosts | null {
  const start = POSTS_PER_PAGE * (page - 1)
  const end = POSTS_PER_PAGE * page

  const category = getCategories().find(c => c.id === categoryId)

  if (!category) {
    return null
  }

  const pagePosts = category.posts.slice(start, end)

  return {
    id: category.id,
    name: category.name,
    posts: pagePosts,
    hasPrev: page > 1,
    hasNext: category.posts.length > end,
  }
}

export function categoryNameToId(name: string): string {
  return name.toLowerCase()
}
