#!/usr/bin/env node
// textlint にかける変更ファイルを出力する。Markdown は本文が変わったものだけに絞る。
//
// textlint は記事の文章とソースコードの日本語コメントを検査する。frontmatter だけを機械的に書き換える移行 (日付の統一やキーの改名など) で全記事が対象になると、既存の文章の指摘で CI が落ちる。
// frontmatter しか変わっていないファイルはここで除く。コメントを見るファイルには frontmatter が無いので、変更があればそのまま対象にする。
//
// 使い方: node scripts/list-prose-changes.mjs <base-ref>

import { execFileSync } from 'node:child_process'

const baseRef = process.argv[2]
if (!baseRef) {
  console.error('base ref を渡してください')
  process.exit(1)
}

const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 })

// frontmatter を落とした本文を返す。frontmatter が無ければ全体が本文。
function body(text) {
  if (!text.startsWith('---\n')) {
    return text
  }
  const end = text.indexOf('\n---\n', 3)
  return end === -1 ? text : text.slice(end + 5)
}

// package.json の lint:text と揃える。
const markdownGlobs = ['*.md', '*.mdx']
const commentGlobs = [
  '*.ts',
  '*.tsx',
  '*.mjs',
  '*.cjs',
  '*.js',
  '*.jsx',
  '*.yaml',
  '*.yml',
  '*.sh',
]

const changed = git(
  'diff',
  '--name-only',
  '--diff-filter=d',
  `${baseRef}...HEAD`,
  '--',
  ...markdownGlobs,
  ...commentGlobs,
)
  .split('\n')
  .filter(Boolean)

const isMarkdown = file => file.endsWith('.md') || file.endsWith('.mdx')

const needsLint = changed.filter(file => {
  if (!isMarkdown(file)) {
    return true
  }
  let before
  try {
    before = git('show', `${baseRef}:${file}`)
  } catch {
    // 新規追加されたファイル
    return true
  }
  const after = git('show', `HEAD:${file}`)
  return body(before) !== body(after)
})

process.stdout.write(needsLint.join(' '))
