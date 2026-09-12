import { describe, expect, it } from 'vitest'
import { hasToc, nestToc, type TocItem } from './toc'

function item(id: string, depth: 2 | 3): TocItem {
  return { id, text: id, depth }
}

describe('hasToc', () => {
  it('h2 が 3 つあれば出す', () => {
    expect(hasToc([item('a', 2), item('b', 2), item('c', 2)])).toBe(true)
  })

  it('h2 が 2 つなら出さない', () => {
    expect(hasToc([item('a', 2), item('b', 2)])).toBe(false)
  })

  it('h3 は数に入れない', () => {
    expect(
      hasToc([item('a', 2), item('b', 3), item('c', 3), item('d', 3)]),
    ).toBe(false)
  })

  it('見出しが無い記事でも落ちない', () => {
    expect(hasToc([])).toBe(false)
  })
})

describe('nestToc', () => {
  it('h3 を直前の h2 の下に入れる', () => {
    const nodes = nestToc([
      item('a', 2),
      item('a-1', 3),
      item('a-2', 3),
      item('b', 2),
    ])

    expect(nodes.map(node => node.id)).toEqual(['a', 'b'])
    expect(nodes[0].children.map(child => child.id)).toEqual(['a-1', 'a-2'])
    expect(nodes[1].children).toEqual([])
  })

  it('最初の h2 より前の h3 は上の段に置く', () => {
    const nodes = nestToc([item('a-1', 3), item('a', 2)])

    expect(nodes.map(node => node.id)).toEqual(['a-1', 'a'])
    expect(nodes[0].children).toEqual([])
  })

  it('h3 が続いても入れ子を深くしない', () => {
    const nodes = nestToc([item('a-1', 3), item('a-2', 3)])

    expect(nodes.map(node => node.id)).toEqual(['a-1', 'a-2'])
  })

  it('元の配列を書き換えない', () => {
    const toc = [item('a', 2), item('a-1', 3)]
    nestToc(toc)

    expect(toc).toEqual([item('a', 2), item('a-1', 3)])
  })
})
