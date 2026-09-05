import { describe, expect, it } from 'vitest'
import type { Frontmatter } from '../routes/posts/types'
import {
  buildCategories,
  buildTags,
  findPaginationPosts,
  getMaxPageNumber,
  type Post,
  paginate,
  sortByDateDesc,
} from './post-list'

function post(slug: string, frontmatter: Partial<Frontmatter> = {}): Post {
  return {
    id: `/posts/${slug}/index.mdx`,
    permalink: `/posts/${slug}/`,
    fullFilePath: new URL(`file:///posts/${slug}/index.mdx`),
    frontmatter: {
      title: slug,
      date: '2024-01-01T00:00:00+09:00',
      description: slug,
      category: '開発',
      ...frontmatter,
    },
    MDXContent: () => null as unknown as JSX.Element,
  }
}

function posts(count: number): Post[] {
  return Array.from({ length: count }, (_, i) => post(`post-${i}`))
}

describe('sortByDateDesc', () => {
  it('新しい記事を先頭に並べる', () => {
    const sorted = sortByDateDesc([
      post('old', { date: '2020-01-01T00:00:00+09:00' }),
      post('new', { date: '2024-01-01T00:00:00+09:00' }),
      post('mid', { date: '2022-01-01T00:00:00+09:00' }),
    ])

    expect(sorted.map(p => p.frontmatter.title)).toEqual(['new', 'mid', 'old'])
  })

  it('文字列ではなく実際の瞬間で並べる', () => {
    // JST の 01/02 00:00 は UTC では 01/01 15:00 なので、UTC の 01/01 16:00 より
    // 前になる。文字列として比較すると逆の順序になる組み合わせ。
    const sorted = sortByDateDesc([
      post('jst', { date: '2024-01-02T00:00:00+09:00' }),
      post('utc', { date: '2024-01-01T16:00:00+00:00' }),
    ])

    expect(sorted.map(p => p.frontmatter.title)).toEqual(['utc', 'jst'])
  })

  it('元の配列を書き換えない', () => {
    const original = [
      post('old', { date: '2020-01-01T00:00:00+09:00' }),
      post('new', { date: '2024-01-01T00:00:00+09:00' }),
    ]
    sortByDateDesc(original)

    expect(original.map(p => p.frontmatter.title)).toEqual(['old', 'new'])
  })
})

describe('paginate', () => {
  it('1 ページ目には前のページが無い', () => {
    expect(paginate(posts(25), 1)).toMatchObject({
      hasPrev: false,
      hasNext: true,
    })
  })

  it('最終ページには次のページが無い', () => {
    expect(paginate(posts(25), 3)).toMatchObject({
      hasPrev: true,
      hasNext: false,
    })
  })

  it('ちょうど割り切れる件数でも、次のページを作らない', () => {
    expect(paginate(posts(20), 2)).toMatchObject({
      hasPrev: true,
      hasNext: false,
    })
  })

  it('最終ページには余りの件数だけ載せる', () => {
    expect(paginate(posts(25), 3).posts).toHaveLength(5)
  })

  it('存在しないページでは記事が空になる', () => {
    expect(paginate(posts(25), 4).posts).toEqual([])
  })
})

describe('getMaxPageNumber', () => {
  it('端数を切り上げる', () => {
    expect(getMaxPageNumber(posts(21))).toBe(3)
  })

  it('ちょうど割り切れる件数では切り上げない', () => {
    expect(getMaxPageNumber(posts(20))).toBe(2)
  })

  it('記事が無ければ 0', () => {
    expect(getMaxPageNumber([])).toBe(0)
  })
})

describe('findPaginationPosts', () => {
  // 日付降順に並んでいる前提。前の記事 = より古い記事。
  const sorted = [post('newest'), post('middle'), post('oldest')]

  it('前の記事はより古い記事', () => {
    const { prevPost } = findPaginationPosts(
      sorted,
      'app/routes/posts/middle/index.mdx',
    )
    expect(prevPost?.frontmatter.title).toBe('oldest')
  })

  it('次の記事はより新しい記事', () => {
    const { nextPost } = findPaginationPosts(
      sorted,
      'app/routes/posts/middle/index.mdx',
    )
    expect(nextPost?.frontmatter.title).toBe('newest')
  })

  it('最新の記事には次の記事が無い', () => {
    expect(
      findPaginationPosts(sorted, 'app/routes/posts/newest/index.mdx').nextPost,
    ).toBeNull()
  })

  it('最古の記事には前の記事が無い', () => {
    expect(
      findPaginationPosts(sorted, 'app/routes/posts/oldest/index.mdx').prevPost,
    ).toBeNull()
  })

  it('見つからない場合は前後どちらも出さない', () => {
    // 以前は findIndex の -1 をそのまま使い、一覧の先頭を「前の記事」として
    // 表示していた
    expect(
      findPaginationPosts(sorted, 'app/routes/posts/unknown/index.mdx'),
    ).toEqual({ prevPost: null, nextPost: null })
  })

  it('同じタイトルの記事があっても取り違えない', () => {
    const duplicated = [
      post('a', { title: '同じタイトル' }),
      post('b', { title: '同じタイトル' }),
    ]
    const { prevPost } = findPaginationPosts(
      duplicated,
      'app/routes/posts/a/index.mdx',
    )
    expect(prevPost?.id).toBe('/posts/b/index.mdx')
  })
})

describe('buildCategories', () => {
  it('同じカテゴリの記事をまとめる', () => {
    const categories = buildCategories([
      post('a', { category: '開発' }),
      post('b', { category: 'ポエム' }),
      post('c', { category: '開発' }),
    ])

    expect(categories).toHaveLength(2)
    expect(categories.find(c => c.name === '開発')?.posts).toHaveLength(2)
  })

  it('id は小文字にする', () => {
    expect(buildCategories([post('a', { category: 'Go' })])[0]?.id).toBe('go')
  })

  it('渡された順序を保つ', () => {
    const categories = buildCategories([
      post('a', { category: '開発', title: '1' }),
      post('b', { category: '開発', title: '2' }),
    ])
    expect(categories[0]?.posts.map(p => p.frontmatter.title)).toEqual([
      '1',
      '2',
    ])
  })
})

describe('buildTags', () => {
  it('タグを持たない記事を無視する', () => {
    expect(buildTags([post('a')])).toEqual([])
  })

  it('複数の記事にまたがるタグをまとめる', () => {
    const tags = buildTags([
      post('a', { tags: ['Go', 'テスト'] }),
      post('b', { tags: ['Go'] }),
    ])

    expect(tags).toHaveLength(2)
    expect(tags.find(t => t.name === 'Go')?.posts).toHaveLength(2)
  })

  it('大文字小文字が違うだけのタグは同じ id になる', () => {
    const tags = buildTags([
      post('a', { tags: ['Go'] }),
      post('b', { tags: ['go'] }),
    ])

    expect(tags.map(t => t.id)).toEqual(['go'])
  })
})
