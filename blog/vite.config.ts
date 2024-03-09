import ssg from '@hono/vite-ssg'
import mdx from '@mdx-js/rollup'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import rehypeHighlight from 'rehype-highlight'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkMdxImages from 'remark-mdx-images'
import { defineConfig } from 'vite'

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
      honox(),
      ssg({ entry }),
      mdx({
        jsxImportSource: 'hono/jsx',
        providerImportSource: './app/lib/mdx-components',
        remarkPlugins: [
          remarkFrontmatter,
          remarkMdxFrontmatter,
          remarkMdxImages,
        ],
        rehypePlugins: [rehypeHighlight, rehypeMdxCodeProps],
      }),
    ],
  }
})
