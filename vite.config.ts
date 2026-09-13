import ssg from '@hono/vite-ssg'
import mdx from '@mdx-js/rollup'
import honox from 'honox/vite'
import client from 'honox/vite/client'

import recmaExportFilepath from 'recma-export-filepath'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { rehypePlugins, remarkPlugins } from './app/lib/mdx'
import { mdxSummary } from './app/lib/mdx-summary'

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
    server: {
      watch: {
        // honox はファイルが増減するたびに開発サーバーを再起動するので、VRT とビルドの出力を監視から外す。
        ignored: [
          '**/dist/**',
          '**/vrt/__screenshots__/**',
          '**/vrt/.results/**',
          '**/playwright-report/**',
        ],
      },
    },
    plugins: [
      honox(),
      // mdx() より先に動かして、抜粋用の仮想モジュールを用意する
      mdxSummary(),
      mdx({
        jsxImportSource: 'hono/jsx',
        providerImportSource: './app/lib/mdx-components',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        recmaPlugins: [recmaExportFilepath],
      }),
      ssg({ entry }),
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
            // v4 から src のディレクトリ構造が維持されるので、先頭の app/routes/posts/ の 3 階層を落とす
            rename: { stripBase: 3 },
            // 普通の vite のビルドで生成したファイルを消さないようにする
            overwrite: false,
          },
        ],
      }),
    ],
  }
})
