import type { MDXProps } from 'mdx/types'
import { type Frontmatter, frontmatterSchema } from '../routes/posts/types'
import {
  buildCategories,
  buildTags,
  type Category,
  findPaginationPosts,
  type Page,
  type PaginationPosts,
  type Post,
  paginate,
  sortByDateDesc,
  type Tag,
} from './post-list'

export type { Category, Page, PaginationPosts, Post, Tag }
export { categoryNameToId, getMaxPageNumber, tagNameToId } from './post-list'

type MDXExports = {
  frontmatter: unknown
  default: (props: MDXProps) => JSX.Element
  ContentSummary?: () => JSX.Element
}

const modules = import.meta.glob<MDXExports>('../routes/posts/**/*.mdx', {
  eager: true,
})

function parseFrontmatter(id: string, value: unknown): Frontmatter {
  const result = frontmatterSchema.safeParse(value)
  if (!result.success) {
    const detail = result.error.issues
      .map(i => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n  ')
    throw new Error(`frontmatter が不正です: ${id}\n  ${detail}`)
  }
  return result.data
}

const allPosts = sortByDateDesc(
  Object.entries(modules).map(([id, module]) => {
    const postId = id.replace(/^\.\.\/routes/, '')
    return {
      id: postId,
      fullFilePath: new URL(id, import.meta.url),
      permalink: `${postId.replace(/\/index\.mdx$/, '')}/`,
      frontmatter: parseFrontmatter(postId, module.frontmatter),
      MDXContent: module.default,
      ContentSummary: module.ContentSummary,
    } satisfies Post
  }),
)

const categories = buildCategories(allPosts)
const tags = buildTags(allPosts)

export function getAllPosts(): Post[] {
  return allPosts
}

export function getPosts(page: number): Page {
  return paginate(allPosts, page)
}

export function getPaginationPosts(currentFilepath: string): PaginationPosts {
  return findPaginationPosts(allPosts, currentFilepath)
}

export function getCategories(): Category[] {
  return categories
}

export type CategoryPage = Page & Omit<Category, 'posts'>

export function getCategoryPosts(
  categoryId: string,
  page: number,
): CategoryPage | null {
  const category = categories.find(c => c.id === categoryId)
  if (!category) {
    return null
  }
  return {
    id: category.id,
    name: category.name,
    ...paginate(category.posts, page),
  }
}

export function getTags(): Tag[] {
  return tags
}

export type TagPage = Page & Omit<Tag, 'posts'>

export function getTagPosts(tagId: string, page: number): TagPage | null {
  const tag = tags.find(t => t.id === tagId)
  if (!tag) {
    return null
  }
  return { id: tag.id, name: tag.name, ...paginate(tag.posts, page) }
}
