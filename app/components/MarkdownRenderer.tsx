import { compile, run } from '@mdx-js/mdx'
import { Fragment, jsx } from 'hono/jsx/jsx-runtime'
import { useMDXComponents } from '../lib/mdx-components'
type Props = {
  content: string
  baseUrl: string
}

const postDirRegex = /posts\/(.+)\/index.mdx/

export async function MarkdownRenderer({ content, baseUrl }: Props) {
  const compiled = await compile(content, {
    jsxImportSource: 'hono/jsx',
    outputFormat: 'function-body',
    providerImportSource: './app/lib/mdx-components',
    // 画像をimport fromで読み込んでパスを解決できるようにしたいので設定しているがエラーになってしまう
    // そこで画像のパスを気合で書き換えるワークアラウンドを実装している
    // baseUrl: baseUrl,
    // remarkPlugins: remarkPlugins,
    // rehypePlugins: rehypePlugins,
  })

  const postSlug = baseUrl.match(postDirRegex)?.[1]
  const imgBaseUrl = import.meta.env.PROD
    ? `/posts/${postSlug}/`
    : `/app/routes/posts/${postSlug}/`
  const transformed = String(compiled).replaceAll('./', imgBaseUrl)

  const { default: MDXContent } = await run(transformed, {
    // @ts-ignore
    jsx: jsx,
    // @ts-ignore
    jsxDEV: jsx,
    // @ts-ignore
    jsxs: jsx,
    Fragment: Fragment,
    useMDXComponents: useMDXComponents,
  })
  return <MDXContent />
}
