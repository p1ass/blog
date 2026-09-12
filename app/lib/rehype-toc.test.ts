import { compile, evaluate } from '@mdx-js/mdx'
import * as runtime from 'hono/jsx/jsx-runtime'
import remarkGfm from 'remark-gfm'
import { describe, expect, it } from 'vitest'
import { rehypeToc } from './rehype-toc'
import type { TocItem } from './toc'

const options = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeToc],
}

// 記事と同じ変換を通し、MDX モジュールが export する toc を取り出す。
// evaluate は任意の export を持つモジュールを返すので、型は使う側で決める。
async function tocOf(source: string, path = '/posts/slug/index.mdx') {
  const mod = await evaluate({ path, value: source }, {
    ...runtime,
    ...options,
  } as Parameters<typeof evaluate>[1])
  return (mod as unknown as { toc: TocItem[] }).toc
}

async function codeOf(source: string) {
  const file = await compile(
    { path: '/posts/slug/index.mdx', value: source },
    options,
  )
  return String(file)
}

describe('rehypeToc', () => {
  it('h2 と h3 を本文の順に集める', async () => {
    const toc = await tocOf(['## 動機', '### 前提', '## まとめ'].join('\n\n'))

    expect(toc).toEqual([
      { id: '動機', text: '動機', depth: 2 },
      { id: '前提', text: '前提', depth: 3 },
      { id: 'まとめ', text: 'まとめ', depth: 2 },
    ])
  })

  it('h1 と h4 は集めない', async () => {
    const toc = await tocOf(['# タイトル', '#### 補足'].join('\n\n'))

    expect(toc).toEqual([])
  })

  it('見出しの中の装飾を落として文字だけ拾う', async () => {
    const toc = await tocOf(
      '## `slice` と [append](https://example.com) の違い',
    )

    expect(toc[0].text).toBe('slice と append の違い')
  })

  it('同じ見出しが 2 つあっても id が重ならない', async () => {
    const toc = await tocOf(['## まとめ', '## まとめ'].join('\n\n'))

    expect(toc.map(item => item.id)).toEqual(['まとめ', 'まとめ-1'])
  })

  it('脚注のまとまりは集めない', async () => {
    const toc = await tocOf(
      ['## 動機[^1]', '本文', '[^1]: 脚注の中身'].join('\n\n'),
    )

    expect(toc).toEqual([{ id: '動機', text: '動機', depth: 2 }])
  })

  it('見出しに id を振る', async () => {
    const code = await codeOf('## 動機')

    expect(code).toContain('id: "動機"')
  })

  it('一覧の抜粋では id を振らず、目次も作らない', async () => {
    const source = ['## 動機', '### 前提'].join('\n\n')

    expect(await tocOf(source, '/posts/slug/index.summary.mdx')).toEqual([])
    expect(
      String(
        await compile(
          { path: '/posts/slug/index.summary.mdx', value: source },
          options,
        ),
      ),
    ).not.toContain('id:')
  })
})
