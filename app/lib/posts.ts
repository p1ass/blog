import type { MDXProps } from 'mdx/types'
import { type Frontmatter, frontmatterSchema } from '../routes/posts/types'
import {
  buildLabels,
  filepathToSlug,
  findLabelPage,
  findPaginationPosts,
  globKeyToSlug,
  type Label,
  type LabelId,
  type LabelKind,
  type LabelPage,
  type Page,
  type PaginationPosts,
  type Post,
  paginate,
  sortByDateDesc,
} from './post-list'

export type {
  Label,
  LabelId,
  LabelKind,
  LabelPage,
  Page,
  PaginationPosts,
  Post,
  Slug,
} from './post-list'
export {
  filepathToSlug,
  getMaxPageNumber,
  labelBasePath,
  labelHeadingPrefix,
  labelNameToId,
  labelPermalink,
  postPermalink,
} from './post-list'

type MDXExports = {
  frontmatter: unknown
  default: (props: MDXProps) => JSX.Element
  ContentSummary?: () => JSX.Element
}

const modules = import.meta.glob<MDXExports>('../routes/posts/**/*.mdx', {
  eager: true,
})

function parseFrontmatter(slug: string, value: unknown): Frontmatter {
  const result = frontmatterSchema.safeParse(value)
  if (!result.success) {
    const detail = result.error.issues
      .map(i => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n  ')
    throw new Error(`frontmatter が不正です: ${slug}\n  ${detail}`)
  }
  return result.data
}

const allPosts = sortByDateDesc(
  Object.entries(modules).map(([key, module]) => {
    const slug = globKeyToSlug(key)
    return {
      slug,
      frontmatter: parseFrontmatter(slug, module.frontmatter),
      MDXContent: module.default,
      ContentSummary: module.ContentSummary,
    } satisfies Post
  }),
)

const labelsByKind: Record<LabelKind, Label[]> = {
  category: buildLabels('category', allPosts),
  tag: buildLabels('tag', allPosts),
}

export function getAllPosts(): Post[] {
  return allPosts
}

export function getPosts(page: number): Page {
  return paginate(allPosts, page)
}

export function getPaginationPosts(filepath: string): PaginationPosts {
  return findPaginationPosts(allPosts, filepathToSlug(filepath))
}

export function getLabels(kind: LabelKind): Label[] {
  return labelsByKind[kind]
}

export function getLabelPage(
  kind: LabelKind,
  id: LabelId,
  page: number,
): LabelPage | null {
  return findLabelPage(labelsByKind[kind], id, page)
}
