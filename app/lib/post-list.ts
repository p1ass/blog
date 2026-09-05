import type { MDXProps } from 'mdx/types'
import type { Frontmatter } from '../routes/posts/types'
import { parseDate } from './time'
import { groupBy } from './util'

export const POSTS_PER_PAGE = 10

export type Post = {
  id: string
  frontmatter: Frontmatter
  permalink: string
  fullFilePath: URL
  MDXContent: (props: MDXProps) => JSX.Element
  ContentSummary?: () => JSX.Element
}

export function sortByDateDesc(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) =>
      parseDate(b.frontmatter.date).getTime() -
      parseDate(a.frontmatter.date).getTime(),
  )
}

export type Page = {
  posts: Post[]
  hasPrev: boolean
  hasNext: boolean
}

export function getMaxPageNumber(posts: Post[]): number {
  return Math.ceil(posts.length / POSTS_PER_PAGE)
}

export function paginate(posts: Post[], page: number): Page {
  const start = POSTS_PER_PAGE * (page - 1)
  const end = POSTS_PER_PAGE * page

  return {
    posts: posts.slice(start, end),
    hasPrev: page > 1,
    hasNext: posts.length > end,
  }
}

export type PaginationPosts = {
  prevPost: Post | null
  nextPost: Post | null
}

// recma-export-filepath が渡す `app/routes/posts/<slug>/index.mdx` を
// Post.id の形式 (`/posts/<slug>/index.mdx`) に揃える
export function filepathToPostId(filepath: string): string {
  return `/${filepath.replace(/^app\/routes\//, '')}`
}

export function findPaginationPosts(
  posts: Post[],
  currentFilepath: string,
): PaginationPosts {
  const currentId = filepathToPostId(currentFilepath)
  const currentIndex = posts.findIndex(p => p.id === currentId)

  // 見つからないまま先に進むと、一覧の先頭が「前の記事」として表示されてしまう
  if (currentIndex === -1) {
    return { prevPost: null, nextPost: null }
  }

  return {
    prevPost: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    nextPost: currentIndex > 0 ? posts[currentIndex - 1] : null,
  }
}

export type Category = {
  id: string
  name: string
  posts: Post[]
}

export function categoryNameToId(name: string): string {
  return name.toLowerCase()
}

export function buildCategories(posts: Post[]): Category[] {
  const grouped = groupBy(posts, p => p.frontmatter.category)

  return Object.entries(grouped).map(([name, categoryPosts]) => ({
    id: categoryNameToId(name),
    name,
    posts: categoryPosts,
  }))
}

export type Tag = {
  id: string
  name: string
  posts: Post[]
}

export function tagNameToId(name: string): string {
  return name.toLowerCase()
}

export function buildTags(posts: Post[]): Tag[] {
  const names = posts.flatMap(p => p.frontmatter.tags ?? [])
  const uniqueNames = Array.from(
    new Map(names.map(name => [tagNameToId(name), name])).values(),
  )

  return uniqueNames.map(name => ({
    id: tagNameToId(name),
    name,
    posts: posts.filter(p => p.frontmatter.tags?.includes(name)),
  }))
}
