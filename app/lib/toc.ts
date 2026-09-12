// TOC は記事本文の見出しから作る目次。
//
// 作るのはビルド時で、rehype-toc.ts が記事の hast から見出しを拾い、MDX モジュールの
// toc として export する。ここにあるのは、その並びを受け取ってからの判断だけ。
// 記事を読み込まずに試せるよう、DOM とファイルのどちらにも触れない形にしてある。

export type TocItem = {
  // 見出しに振った id。目次のリンク先になる
  id: string
  text: string
  depth: 2 | 3
}

// h3 を h2 の下にぶら下げた形。目次は入れ子のリストとして出す。
export type TocNode = TocItem & {
  children: TocItem[]
}

// 目次を出す下限。これを下回る記事では、目次より本文のほうが短い区切りで読める。
const minHeadings = 3

// h2 が少ない記事では目次を出さない。h3 を数に入れないのは、h2 が 1 つしかない記事で
// その中の小見出しだけが並ぶと、記事全体の見取り図にならないため。
export function hasToc(toc: TocItem[]): boolean {
  return toc.filter(item => item.depth === 2).length >= minHeadings
}

// h2 の下に h3 を入れる。最初の h2 より前に出てくる h3 は、ぶら下げる先が無いので
// そのまま上の段に置く。
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
