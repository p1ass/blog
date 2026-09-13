export type TocItem = {
  id: string
  text: string
  depth: 2 | 3
}

export type TocNode = TocItem & {
  children: TocItem[]
}

const minHeadings = 3

// h2 が 1 つしかない記事で小見出しだけ並んでも記事全体の見取り図にならないので、h3 は数えない。
export function hasToc(toc: TocItem[]): boolean {
  return toc.filter(item => item.depth === 2).length >= minHeadings
}

export function nestToc(toc: TocItem[]): TocNode[] {
  const nodes: TocNode[] = []
  for (const item of toc) {
    const last = nodes.at(-1)
    if (item.depth === 3 && last?.depth === 2) {
      last.children.push(item)
    } else {
      nodes.push({ ...item, children: [] })
    }
  }
  return nodes
}
