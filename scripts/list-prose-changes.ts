#!/usr/bin/env node
import { execFileSync } from 'node:child_process'

const baseRef = process.argv[2]
if (!baseRef) {
  console.error('base ref を渡してください')
  process.exit(1)
}

const git = (...args: string[]) =>
  execFileSync('git', args, { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 })

function body(text: string): string {
  if (!text.startsWith('---\n')) {
    return text
  }
  const end = text.indexOf('\n---\n', 3)
  return end === -1 ? text : text.slice(end + 5)
}

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

const isMarkdown = (file: string) =>
  file.endsWith('.md') || file.endsWith('.mdx')

const needsLint = changed.filter(file => {
  if (!isMarkdown(file)) {
    return true
  }
  let before: string
  try {
    before = git('show', `${baseRef}:${file}`)
  } catch {
    return true
  }
  const after = git('show', `HEAD:${file}`)
  return body(before) !== body(after)
})

process.stdout.write(needsLint.join(' '))
