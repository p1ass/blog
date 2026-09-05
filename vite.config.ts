import ssg from '@hono/vite-ssg'
import mdx from '@mdx-js/rollup'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import honox from 'honox/vite'
import client from 'honox/vite/client'

import recmaExportFilepath from 'recma-export-filepath'
import { defineConfig } from 'vite'
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
    assetsInclude: ['**/*.JPG'],
    base:
      process.env.NODE_ENV === 'production' ? 'https://blog.p1ass.com' : '/',
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
          'style-to-js',
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
        recmaPlugins: [recmaExportFilepath],
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
              './app/routes/posts/**/*.webp',
            ],
            dest: 'posts',
            // v4 から src のディレクトリ構造が常に維持されるため、
            // 先頭の `app/routes/posts/` の 3 階層を落として `posts/<slug>/` に揃える
            rename: { stripBase: 3 },
            // 普通のviteのビルドで生成したファイルを消さないようにする
            overwrite: false,
          },
        ],
      }),
    ],
  }
})
