import type { MDXProps } from 'mdx/types'
import type { Frontmatter } from '../routes/posts/types'
import { parseDate } from './time'
import { groupBy } from './util'

const POSTS_PER_PAGE = 10

type MDXExports = {
  frontmatter: Frontmatter
  default: (props: MDXProps) => JSX.Element
  ContentSummary?: () => JSX.Element
}

const posts = import.meta.glob<MDXExports>('../routes/posts/**/*.mdx', {
  eager: true,
})

function sortByDateDesc():
  | ((
      a: [string, { frontmatter: Frontmatter }],
      b: [string, { frontmatter: Frontmatter }],
    ) => number)
  | undefined {
  return ([_aid, aPost], [_bid, bPost]) => {
    const aDate = parseDate(aPost.frontmatter.date)
    const bDate = parseDate(bPost.frontmatter.date)
    return aDate.getTime() < bDate.getTime() ? 1 : -1
  }
}

export type Post = {
  id: string
  frontmatter: Frontmatter
  fullPath: URL
  MDXContent: (props: MDXProps) => JSX.Element
  ContentSummary?: () => JSX.Element
}

type Posts = {
  posts: Post[]
  hasPrev: boolean
  hasNext: boolean
}

export function getAllPosts(): Post[] {
  const allPosts = Object.entries(posts)
    .sort(sortByDateDesc())
    .map(([id, module]) => {
      return {
        id: id.replace(/^\.\.\/routes/, ''),
        fullPath: new URL(id, import.meta.url),
        frontmatter: module.frontmatter,
        MDXContent: module.default,
        ContentSummary: module.ContentSummary,
      } satisfies Post
    })
  return allPosts
}

export function getMaxPageNumber(posts: Post[]): number {
  return Math.ceil(posts.length / POSTS_PER_PAGE)
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

type Tag = {
  id: string
  name: string
  posts: Post[]
}

export function getTags(): Tag[] {
  const allPosts = getAllPosts()

  const tags = allPosts.flatMap(p => {
    return (
      p.frontmatter.tags?.map(tag => {
        return {
          id: tagNameToId(tag),
          name: tag,
        }
      }) || []
    )
  })
  const uniqueTags = Array.from(
    new Map(tags.map(tag => [tag.id, tag])).values(),
  )

  return uniqueTags.map(tag => {
    return {
      id: tag.id,
      name: tag.name,
      posts: getAllPosts().filter(p => p.frontmatter.tags?.includes(tag.name)),
    }
  })
}

export function tagNameToId(name: string): string {
  return name.toLowerCase()
}

type TagPosts = {
  posts: Post[]
  hasPrev: boolean
  hasNext: boolean
} & Tag

export function getTagPosts(tagId: string, page: number): TagPosts | null {
  const start = POSTS_PER_PAGE * (page - 1)
  const end = POSTS_PER_PAGE * page

  const tag = getTags().find(tag => tag.id === tagId)

  if (!tag) {
    return null
  }

  const tagPosts = getAllPosts().filter(p =>
    p.frontmatter.tags?.includes(tag.name),
  )
  const pagePosts = tagPosts.slice(start, end)

  return {
    id: tag.id,
    name: tag.name,
    posts: pagePosts,
    hasPrev: page > 1,
    hasNext: tagPosts.length > end,
  }
}
