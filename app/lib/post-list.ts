import type { MDXProps } from 'mdx/types'
import type { Frontmatter } from '../routes/posts/types'
import { parseDate } from './time'
import { groupBy } from './util'

export const POSTS_PER_PAGE = 10

// どの記事かを見分けるためのキー。記事が置かれたディレクトリの名前がそのまま Slug になる。
export type Slug = string

export type Post = {
  slug: Slug
  frontmatter: Frontmatter
  MDXContent: (props: MDXProps) => JSX.Element
  // 本文のマーカーより前。mdx-summary プラグインがビルド時に用意する。
  ContentSummary: (props: MDXProps) => JSX.Element
}

// URL とファイルパスは Slug から導出する。文字列操作をここに閉じ込め、
// 呼び出し側が自前で組み立てないようにする。
export function postPermalink(slug: Slug): string {
  return `/posts/${slug}/`
}

// recma-export-filepath が渡す `app/routes/posts/<slug>/index.mdx` から Slug を取る
export function filepathToSlug(filepath: string): Slug {
  return filepath
    .replace(/^app\/routes\/posts\//, '')
    .replace(/\/index\.mdx$/, '')
}

// import.meta.glob が返す `../routes/posts/<slug>/index.mdx` から Slug を取る
export function globKeyToSlug(key: string): Slug {
  return key.replace(/^\.\.\/routes\/posts\//, '').replace(/\/index\.mdx$/, '')
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

export function findPaginationPosts(
  posts: Post[],
  currentSlug: Slug,
): PaginationPosts {
  const currentIndex = posts.findIndex(p => p.slug === currentSlug)

  // 見つからないまま先に進むと、一覧の先頭が「前の記事」として表示されてしまう
  if (currentIndex === -1) {
    return { prevPost: null, nextPost: null }
  }

  return {
    prevPost: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    nextPost: currentIndex > 0 ? posts[currentIndex - 1] : null,
  }
}

// 記事に貼るしるし。Category と Tag はこれの種類違い。
export type LabelKind = 'category' | 'tag'

export type LabelId = string

export type Label = {
  kind: LabelKind
  id: LabelId
  name: string
  posts: Post[]
}

// 1 ページ分だけを取り出した Label。全件を持つ Label とは別物として扱う。
export type LabelPage = Page & {
  kind: LabelKind
  id: LabelId
  name: string
  pageNumber: number
}

export const labelBasePath: Record<LabelKind, string> = {
  category: '/categories',
  tag: '/tags',
}

// 個別ページの見出しの接頭辞 (例:「Category 開発」)
export const labelHeadingPrefix: Record<LabelKind, string> = {
  category: 'Category',
  tag: 'Tag',
}

// 一覧ページの見出し。接頭辞に s を足すと Categorys になってしまう。
export const labelIndexTitle: Record<LabelKind, string> = {
  category: 'Categories',
  tag: 'Tags',
}

export function labelNameToId(name: string): LabelId {
  // 日本語のラベルはそのまま URL に載せる。空白だけはパスに置けないので繋ぐ。
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}

export function labelPermalink(kind: LabelKind, id: LabelId): string {
  return `${labelBasePath[kind]}/${id}/`
}

function assertNoIdCollision(kind: LabelKind, labels: Label[]): void {
  const byId = groupBy(labels, l => l.id)
  const collided = Object.entries(byId).filter(([, ls]) => ls.length > 1)
  if (collided.length === 0) {
    return
  }
  const detail = collided
    .map(([id, ls]) => `${id}: ${ls.map(l => l.name).join(', ')}`)
    .join('\n  ')
  throw new Error(
    `${kind} の id が衝突しています。表記を揃えてください。\n  ${detail}`,
  )
}

export function buildLabels(kind: LabelKind, posts: Post[]): Label[] {
  const names =
    kind === 'category'
      ? posts.map(p => p.frontmatter.category)
      : posts.flatMap(p => p.frontmatter.tags ?? [])

  // 表記ゆれを潰さずに残し、衝突として検出できるようにする
  const uniqueNames = Array.from(new Set(names))

  const labels = uniqueNames.map(name => ({
    kind,
    id: labelNameToId(name),
    name,
    posts: posts.filter(p => hasLabel(p, kind, name)),
  }))

  assertNoIdCollision(kind, labels)

  return labels
}

function hasLabel(post: Post, kind: LabelKind, name: string): boolean {
  return kind === 'category'
    ? post.frontmatter.category === name
    : (post.frontmatter.tags?.includes(name) ?? false)
}

export function findLabelPage(
  labels: Label[],
  id: LabelId,
  pageNumber: number,
): LabelPage | null {
  const label = labels.find(l => l.id === id)
  if (!label) {
    return null
  }
  return {
    kind: label.kind,
    id: label.id,
    name: label.name,
    pageNumber,
    ...paginate(label.posts, pageNumber),
  }
}
