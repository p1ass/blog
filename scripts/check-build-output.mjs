// ビルド結果に取りこぼしがないか確かめる。
//
// @hono/vite-ssg は、ルートが例外を投げても "Internal Server Error" という本文を書き出してビルドを成功させる。
// しかも Content-Type が text/plain になるため、ファイル名が index.html ではなく index.txt になる。
// 結果としてその記事は本番で 404 になるが、ビルドログには何も出ない。
//
// 実際に java-catch-up と line-dev-day-2018 の 2 記事がこの状態で出ていた。
// 原因は外部の OGP API の応答で、ビルドのたびに結果が変わる。
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const postsDir = 'dist/posts'
const failures = []

for (const slug of readdirSync(postsDir)) {
  const dir = join(postsDir, slug)
  if (!statSync(dir).isDirectory()) {
    continue
  }
  const entries = readdirSync(dir)
  if (!entries.includes('index.html')) {
    failures.push(`${slug}: index.html が無い (${entries.join(', ')})`)
  }
}

if (failures.length > 0) {
  console.error('ビルド結果に欠けている記事があります:')
  for (const failure of failures) {
    console.error(`  ${failure}`)
  }
  process.exit(1)
}

console.log(
  `記事 ${readdirSync(postsDir).length} 件すべてに index.html があります`,
)
