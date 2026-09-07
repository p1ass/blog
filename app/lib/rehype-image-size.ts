import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { Root } from 'hast'
import { imageSize } from 'image-size'
import type { Plugin } from 'unified'
import type { VFile } from 'vfile'

// 記事の画像に width と height を入れる。
//
// 寸法が無いと、ブラウザは画像を読み終わるまで高さを 0 として組み、読み終わった時点で下の本文を押し下げる。
// 52 記事が画像を使っていて、どれにも寸法が付いていなかった。見た目の回帰テストが同じコードに対して数百ピクセルぶれるのも、これが原因のひとつ。
//
// 入れるのは元の寸法ではなく、実際に描かれる寸法にする。
// 以前は CSS の max-height で高さを抑えていた。ただし width と height の属性はプレゼンテーション上のヒントとして CSS の width と height に反映されるため、
// max-height で高さだけを詰めると横幅が付いてこなくなり、画像が縦に潰れる。
// 抑える計算をここでやってしまえば、CSS 側は max-width: 100% と height: auto の 2 行で済む。
//
// rehype-mdx-import-media より前に置くこと。あちらが src を import 文に書き換えたあとでは、元のファイルにたどり着けない。

// 本文幅。これより広い画像は縮めて入れる。
const maxWidth = 760
// 縦に長い画像が画面を占領しないための上限。以前 imageCss にあった max-height と同じ値。
const maxHeight = 500

type ImageProperties = {
  src?: unknown
  width?: unknown
  height?: unknown
}

type ElementNode = {
  type: string
  tagName?: string
  properties?: ImageProperties
  children?: ElementNode[]
}

// 元の縦横比を保ったまま、幅と高さの上限に収まるまで縮める。
function fitted(width: number, height: number): [number, number] {
  const scale = Math.min(1, maxWidth / width, maxHeight / height)
  return [Math.round(width * scale), Math.round(height * scale)]
}

// 記事に置いた画像かどうか。`./foo.png` と書く記事と `foo.png` と書く記事の両方がある。
// 外部の URL とサイト直下の絶対パスは、ファイルとして読めないので外す。
function isRelativeSource(src: unknown): src is string {
  return (
    typeof src === 'string' &&
    src !== '' &&
    !src.startsWith('/') &&
    !/^[a-z][a-z0-9+.-]*:/i.test(src)
  )
}

export const rehypeImageSize: Plugin<[], Root> = () => (tree, file: VFile) => {
  const mdxPath = file.path
  if (!mdxPath) {
    return
  }
  const baseDir = dirname(mdxPath)

  const walk = (node: ElementNode) => {
    if (node.tagName === 'img' && node.properties) {
      const { src } = node.properties
      if (isRelativeSource(src)) {
        // ファイル名に日本語を使っている記事があり、src はパーセントエンコードされた状態で来る
        const imagePath = resolve(baseDir, decodeURIComponent(src))
        const { width, height } = imageSize(readFileSync(imagePath))
        if (width && height) {
          const [fittedWidth, fittedHeight] = fitted(width, height)
          node.properties.width = fittedWidth
          node.properties.height = fittedHeight
        }
      }
    }
    for (const child of node.children ?? []) {
      walk(child)
    }
  }

  walk(tree as unknown as ElementNode)
}
