// dist/ をそのまま配る静的サーバー。VRT でしか使わない。
// wrangler を使わないのは、起動が速く、外部に一切出ないため。
import { createReadStream, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const root = new URL('../dist/', import.meta.url).pathname
const port = Number(process.env.PORT ?? 4173)

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

// `/posts/foo/` のようなディレクトリは index.html に読み替える
function resolvePath(pathname) {
  const relative = normalize(decodeURIComponent(pathname)).replace(/^\/+/, '')
  const candidates =
    relative.endsWith('/') || relative === ''
      ? [join(root, relative, 'index.html')]
      : [join(root, relative), join(root, relative, 'index.html')]

  for (const candidate of candidates) {
    if (!candidate.startsWith(root)) {
      continue
    }
    try {
      if (statSync(candidate).isFile()) {
        return candidate
      }
    } catch {
      // 次の候補へ
    }
  }
  return null
}

createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${port}`)
  const file = resolvePath(pathname)

  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not Found')
    return
  }

  res.writeHead(200, {
    'Content-Type': contentTypes[extname(file)] ?? 'application/octet-stream',
  })
  createReadStream(file).pipe(res)
}).listen(port, () => {
  console.log(`serving dist/ on http://localhost:${port}`)
})
