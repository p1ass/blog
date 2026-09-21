import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { Root } from 'hast'
import { imageSize } from 'image-size'
import type { Plugin } from 'unified'
import type { VFile } from 'vfile'

const maxWidth = 760
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

function fitted(width: number, height: number): [number, number] {
  const scale = Math.min(1, maxWidth / width, maxHeight / height)
  return [Math.round(width * scale), Math.round(height * scale)]
}

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
