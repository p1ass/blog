import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

export const summarySuffix = '.summary.mdx'
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
