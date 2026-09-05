import { describe, expect, it } from 'vitest'
import type { Frontmatter } from '../routes/posts/types'
import {
  buildLabels,
  filepathToSlug,
  findLabelPage,
  findPaginationPosts,
  getMaxPageNumber,
  globKeyToSlug,
  labelHeadingPrefix,
  labelIndexTitle,
  labelNameToId,
  labelPermalink,
  type Post,
  paginate,
  postPermalink,
  sortByDateDesc,
} from './post-list'

function post(slug: string, frontmatter: Partial<Frontmatter> = {}): Post {
  return {
    slug,
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
    const { prevPost } = findPaginationPosts(sorted, 'middle')
    expect(prevPost?.frontmatter.title).toBe('oldest')
  })

  it('次の記事はより新しい記事', () => {
    const { nextPost } = findPaginationPosts(sorted, 'middle')
    expect(nextPost?.frontmatter.title).toBe('newest')
  })

  it('最新の記事には次の記事が無い', () => {
    expect(findPaginationPosts(sorted, 'newest').nextPost).toBeNull()
  })

  it('最古の記事には前の記事が無い', () => {
    expect(findPaginationPosts(sorted, 'oldest').prevPost).toBeNull()
  })

  it('見つからない場合は前後どちらも出さない', () => {
    // 以前は findIndex の -1 をそのまま使い、一覧の先頭を「前の記事」として
    // 表示していた
    expect(findPaginationPosts(sorted, 'unknown')).toEqual({
      prevPost: null,
      nextPost: null,
    })
  })

  it('同じタイトルの記事があっても取り違えない', () => {
    const duplicated = [
      post('a', { title: '同じタイトル' }),
      post('b', { title: '同じタイトル' }),
    ]
    const { prevPost } = findPaginationPosts(duplicated, 'a')
    expect(prevPost?.slug).toBe('b')
  })
})

describe('buildLabels', () => {
  it('同じカテゴリの記事をまとめる', () => {
    const categories = buildLabels('category', [
      post('a', { category: '開発' }),
      post('b', { category: 'ポエム' }),
      post('c', { category: '開発' }),
    ])

    expect(categories).toHaveLength(2)
    expect(categories.find(c => c.name === '開発')?.posts).toHaveLength(2)
  })

  it('id は小文字にする', () => {
    expect(
      buildLabels('category', [post('a', { category: 'Go' })])[0]?.id,
    ).toBe('go')
  })

  it('渡された順序を保つ', () => {
    const categories = buildLabels('category', [
      post('a', { category: '開発', title: '1' }),
      post('b', { category: '開発', title: '2' }),
    ])
    expect(categories[0]?.posts.map(p => p.frontmatter.title)).toEqual([
      '1',
      '2',
    ])
  })
})

describe('buildLabels (タグ)', () => {
  it('タグを持たない記事を無視する', () => {
    expect(buildLabels('tag', [post('a')])).toEqual([])
  })

  it('複数の記事にまたがるタグをまとめる', () => {
    const tags = buildLabels('tag', [
      post('a', { tags: ['Go', 'テスト'] }),
      post('b', { tags: ['Go'] }),
    ])

    expect(tags).toHaveLength(2)
    expect(tags.find(t => t.name === 'Go')?.posts).toHaveLength(2)
  })

  it('大文字小文字が違うだけのタグは、表記ゆれとしてビルドを落とす', () => {
    // 以前は静かに片方へ潰れ、記事が一覧から抜け落ちていた
    expect(() =>
      buildLabels('tag', [
        post('a', { tags: ['Go'] }),
        post('b', { tags: ['go'] }),
      ]),
    ).toThrow(/id が衝突/)
  })

  it('空白を含むタグ名をハイフンで繋ぐ', () => {
    expect(
      buildLabels('tag', [
        post('a', { tags: ['Claude Code', 'Cloud Run'] }),
      ]).map(t => t.id),
    ).toEqual(['claude-code', 'cloud-run'])
  })
})

describe('ラベルの見出し', () => {
  it('一覧ページの見出しは Categorys にならない', () => {
    expect(labelIndexTitle.category).toBe('Categories')
    expect(labelIndexTitle.tag).toBe('Tags')
  })

  it('個別ページの見出しは接頭辞とラベル名を並べる', () => {
    expect(labelHeadingPrefix.category).toBe('Category')
    expect(labelHeadingPrefix.tag).toBe('Tag')
  })
})

describe('labelNameToId', () => {
  it('小文字にする', () => {
    expect(labelNameToId('Go')).toBe('go')
  })

  it('空白をハイフンにする', () => {
    expect(labelNameToId('Claude Code')).toBe('claude-code')
  })

  it('連続した空白をまとめる', () => {
    expect(labelNameToId('VS  Code')).toBe('vs-code')
  })

  it('日本語はそのまま残す', () => {
    expect(labelNameToId('開発')).toBe('開発')
  })

  it('前後の空白を落とす', () => {
    expect(labelNameToId('  Go  ')).toBe('go')
  })
})

describe('findLabelPage', () => {
  const labels = buildLabels(
    'tag',
    Array.from({ length: 25 }, (_, i) => post(`p${i}`, { tags: ['Go'] })),
  )

  it('見つからない id では null を返す', () => {
    expect(findLabelPage(labels, 'unknown', 1)).toBeNull()
  })

  it('1 ページ分だけを取り出す', () => {
    expect(findLabelPage(labels, 'go', 1)?.posts).toHaveLength(10)
  })

  it('ページ番号を持たせる', () => {
    expect(findLabelPage(labels, 'go', 3)).toMatchObject({
      pageNumber: 3,
      hasPrev: true,
      hasNext: false,
    })
  })
})

describe('Slug と URL の導出', () => {
  it('記事の URL は Slug から作る', () => {
    expect(postPermalink('migrate-to-hono')).toBe('/posts/migrate-to-hono/')
  })

  it('filepath から Slug を取り出す', () => {
    expect(filepathToSlug('app/routes/posts/migrate-to-hono/index.mdx')).toBe(
      'migrate-to-hono',
    )
  })

  it('glob のキーから Slug を取り出す', () => {
    expect(globKeyToSlug('../routes/posts/migrate-to-hono/index.mdx')).toBe(
      'migrate-to-hono',
    )
  })

  it('カテゴリとタグで URL の接頭辞が変わる', () => {
    expect(labelPermalink('category', '開発')).toBe('/categories/開発/')
    expect(labelPermalink('tag', 'go')).toBe('/tags/go/')
  })
})
