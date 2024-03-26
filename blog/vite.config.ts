import path from 'node:path'
import ssg from '@hono/vite-ssg'
import mdx from '@mdx-js/rollup'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import honox from 'honox/vite'
import client from 'honox/vite/client'

import { defineConfig } from 'vite'
import { normalizePath } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { rehypePlugins, remarkPlugins } from './app/lib/mdx'

const entry = './app/server.ts'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [client()],
    }
  }

  return {
    build: {
      emptyOutDir: false,
    },
    plugins: [
      viteCommonjs({
        include: [
          'acorn-jsx',
          'debug',
          'ms',
          'supports-color',
          'has-flag',
          'extend',
          'style-to-object',
          'inline-style-parser',
          'highlight.js',
          'toml',
          'yaml',
        ],
      }),
      honox(),
      mdx({
        jsxImportSource: 'hono/jsx',
        providerImportSource: './app/lib/mdx-components',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
      }),
      ssg({ entry }),
      // 記事内でco-locationして配置している画像たちを `dist/posts` にコピーする
      viteStaticCopy({
        targets: [
          {
            src: [
              './app/routes/posts/**/*.png',
              './app/routes/posts/**/*.jpg',
              './app/routes/posts/**/*.jpeg',
            ],
            dest: 'posts',
            rename: (
              fileName: string,
              fileExtension: string,
              fullPath: string,
            ) => {
              const destPath = normalizePath(
                path
                  .relative(__dirname, fullPath)
                  .replaceAll('app/routes/posts/', ''),
              )
              return destPath
            },
            // 普通のviteのビルドで生成したファイルを消さないようにする
            overwrite: false,
          },
        ],
      }),
    ],
  }
})
