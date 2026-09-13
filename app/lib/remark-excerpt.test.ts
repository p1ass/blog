import { compile } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { describe, expect, it } from 'vitest'
import { remarkExcerpt } from './remark-excerpt'

async function jsxOf(source: string) {
  const file = await compile(
    { path: '/app/routes/posts/enum/index.mdx', value: source },
    {
      jsx: true,
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkExcerpt],
    },
  )
  return String(file)
}

describe('remarkExcerpt', () => {
  it('区切りより前の本文を、記事の permalink を持つ要素で囲む', async () => {
    const code = await jsxOf(
      ['冒頭の段落', '2 つ目の段落', '{/* <!--more--> */}', '続き'].join(
        '\n\n',
      ),
    )

    expect(code).toContain(
      '<_components.div data-post="/posts/enum/" data-post-part="excerpt"><_components.p>{"冒頭の段落"}</_components.p><_components.p>{"2 つ目の段落"}</_components.p></_components.div>',
    )
    expect(code).not.toMatch(/"続き".*<\/_components\.div>/)
  })

  it('frontmatter は囲みの外に残す', async () => {
    const code = await jsxOf(
      ['---', 'title: 題', '---', '', '冒頭', '', '{/* <!--more--> */}'].join(
        '\n',
      ),
    )

    expect(code).toContain('export const frontmatter')
    expect(code).toContain('data-post-part="excerpt"')
  })

  it('区切りがなければ何もしない', async () => {
    const code = await jsxOf('冒頭の段落')

    expect(code).not.toContain('data-post-part')
  })
})
