import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

// 一覧ページの抜粋を、記事本体とまったく同じ経路でビルド時に用意する。
//
// <slug>/index.mdx の隣に <slug>/index.summary.mdx という仮想モジュールを作り、
// 中身をマーカーより前だけにする。@mdx-js/rollup から見れば普通の .mdx なので、
// remark と rehype のプラグインがそのまま効き、画像パスも同じ規則で解決される。
// 記事本体の側には、この仮想モジュールを ContentSummary として再 export する
// 1 行を足す。

const summarySuffix = '.summary.mdx'
const excerptMarker = '{/* <!--more--> */}'
const postsDir = `${path.sep}app${path.sep}routes${path.sep}posts${path.sep}`

function withoutQuery(id: string): string {
  return id.split('?')[0] ?? id
}

function isPostSource(id: string): boolean {
  return (
    id.includes(postsDir) && id.endsWith('.mdx') && !id.endsWith(summarySuffix)
  )
}

export function mdxSummary(): Plugin {
  return {
    name: 'mdx-summary',
    enforce: 'pre',

    resolveId(source, importer) {
      if (!source.endsWith(summarySuffix) || !importer) {
        return null
      }
      return path.resolve(path.dirname(withoutQuery(importer)), source)
    },

    load(id) {
      const file = withoutQuery(id)
      if (!file.endsWith(summarySuffix)) {
        return null
      }

      const sourcePath = `${file.slice(0, -summarySuffix.length)}.mdx`
      const source = fs.readFileSync(sourcePath, 'utf-8')

      const markerIndex = source.indexOf(excerptMarker)
      if (markerIndex === -1) {
        throw new Error(
          `一覧に出す抜粋の区切りが見つかりません: ${sourcePath}\n  ` +
            `本文のどこかに ${excerptMarker} を入れてください。`,
        )
      }

      // frontmatter は残したまま切る。抜粋側でも remark-mdx-frontmatter が
      // 素直に動き、記事本体との差が無くなる。
      return source.slice(0, markerIndex)
    },

    transform(code, id) {
      const file = withoutQuery(id)
      if (!isPostSource(file)) {
        return null
      }

      const name = path.basename(file, '.mdx')
      return {
        code: `${code}\n\nexport { default as ContentSummary } from './${name}${summarySuffix}'\n`,
        map: null,
      }
    },
  }
}
