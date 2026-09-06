// ソースコードの日本語コメントを textlint の検査対象にするプラグイン。
//
// preProcess は AST だけを返し、テキストは原文のまま渡す。textlint --fix は
// preProcess が返したテキストをそのままファイルへ書き戻すため、コメントだけを
// 抜き出したテキストを返すとソースコードが消える。
//
// getSource() は range で原文を切り出すため、ノードの範囲は原文の連続した範囲に
// なる。連続する行を 1 つの Str にまとめると行の間のコメント記号が本文に混ざるが、
// 日本語のルールはどれも記号を語として数えないので実害はない。行ごとに Str を
// 分けるほうが本文はきれいになる。しかし no-doubled-joshi のように文単位で見る
// ルールが行またぎの文を落とすため、まとめるほうを採っている。
//
// このプラグインは file: で参照するローカルパッケージで、pnpm は中身をコピーする。
// index.cjs を直したら pnpm install を回さないと textlint 側に反映されない。

const path = require('node:path')
const ts = require('typescript')

// 拡張子ごとの解析方法。TypeScript のパーサに渡す ScriptKind も兼ねる。
const scriptKinds = {
  '.ts': ts.ScriptKind.TS,
  '.mts': ts.ScriptKind.TS,
  '.cts': ts.ScriptKind.TS,
  '.tsx': ts.ScriptKind.TSX,
  '.jsx': ts.ScriptKind.TSX,
  '.js': ts.ScriptKind.JS,
  '.mjs': ts.ScriptKind.JS,
  '.cjs': ts.ScriptKind.JS,
}

// 行頭の # だけをコメントとして扱う言語。行末コメントと文字列中の # は見ない。
const hashExtensions = ['.yaml', '.yml', '.sh']

const japanese = /[ぁ-んァ-ヶ一-龠々ー]/
const textlintDirective = /^textlint-(disable|enable)\b/
const machineDirective = /^(biome-ignore|eslint-disable|eslint-enable|@ts-)/

// 原文の offset から行と桁を引くための索引。行は 1 始まり、桁は 0 始まり。
const createPositions = text => {
  const lineStarts = [0]
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') {
      lineStarts.push(i + 1)
    }
  }
  return offset => {
    let low = 0
    let high = lineStarts.length - 1
    while (low < high) {
      const middle = Math.ceil((low + high) / 2)
      if (lineStarts[middle] <= offset) {
        low = middle
      } else {
        high = middle - 1
      }
    }
    return { line: low + 1, column: offset - lineStarts[low] }
  }
}

// TypeScript のコメントを重複なく集める。閉じ括弧の直前など、ノードの開始位置に
// 現れないコメントも拾うため、トークンまで降りて走査する。
const collectScriptComments = (text, scriptKind) => {
  const source = ts.createSourceFile(
    'source',
    text,
    ts.ScriptTarget.Latest,
    true,
    scriptKind,
  )
  const found = new Map()
  const visit = node => {
    for (const range of ts.getLeadingCommentRanges(text, node.pos) ?? []) {
      found.set(range.pos, range)
    }
    for (const child of node.getChildren(source)) {
      visit(child)
    }
  }
  visit(source)
  return [...found.values()].sort((a, b) => a.pos - b.pos)
}

// 行頭が # の行を集める。1 行目の shebang は除く。
const collectHashComments = text => {
  const comments = []
  let lineStart = 0
  const lines = text.split('\n')
  for (const [index, line] of lines.entries()) {
    const matched = /^\s*#/.exec(line)
    if (matched && !(index === 0 && line.trimStart().startsWith('#!'))) {
      comments.push({
        pos: lineStart + matched[0].length - 1,
        end: lineStart + line.length,
        block: false,
        marker: '#',
      })
    }
    lineStart += line.length + 1
  }
  return comments
}

// コメント 1 行から、記号と前後の空白を落とした本文の範囲を返す。
const contentRange = (line, { block, first, last, marker }) => {
  let start = 0
  let end = line.length
  if (block) {
    if (last) {
      const closing = line.lastIndexOf('*/')
      if (closing !== -1) {
        end = closing
      }
    }
    if (first) {
      start = line.startsWith('/*') ? 2 : 0
      while (start < end && line[start] === '*') {
        start++
      }
    } else {
      while (start < end && /\s/.test(line[start])) {
        start++
      }
      if (line[start] === '*') {
        start++
      }
    }
  } else {
    while (start < end && line[start] === marker) {
      start++
    }
  }
  while (start < end && /\s/.test(line[start])) {
    start++
  }
  while (end > start && /\s/.test(line[end - 1])) {
    end--
  }
  return [start, end]
}

// コメントを物理行に割り、本文の範囲を原文の offset で返す。
const toLineEntries = (text, comment, positionAt) => {
  const raw = text.slice(comment.pos, comment.end)
  const block = comment.block ?? raw.startsWith('/*')
  const marker = comment.marker ?? '/'
  const lines = raw.split('\n')
  const entries = []
  let lineStart = comment.pos
  for (const [index, line] of lines.entries()) {
    const [start, end] = contentRange(line, {
      block,
      first: index === 0,
      last: index === lines.length - 1,
      marker,
    })
    if (start < end) {
      entries.push({
        start: lineStart + start,
        end: lineStart + end,
        line: positionAt(lineStart).line,
        trailing: comment.trailing,
      })
    }
    lineStart += line.length + 1
  }
  return entries
}

// コードの後ろに付くコメントかどうか。行ごとに独立した段落として扱う。
const isTrailing = (text, pos) => {
  let index = pos - 1
  while (index >= 0 && text[index] !== '\n') {
    if (!/\s/.test(text[index])) {
      return true
    }
    index--
  }
  return false
}

// 隣り合う行をまとめる。空のコメント行、コメント以外の行、機械向けの行で切れる。
const groupParagraphs = entries => {
  const paragraphs = []
  let current = null
  for (const entry of entries) {
    const continues =
      current !== null &&
      !current.trailing &&
      !entry.trailing &&
      entry.line === current.entries.at(-1).line + 1
    if (continues) {
      current.entries.push(entry)
      continue
    }
    current = { trailing: entry.trailing, entries: [entry] }
    paragraphs.push(current)
  }
  return paragraphs
}

const parse = (text, extension) => {
  const positionAt = createPositions(text)
  const node = (type, start, end, extra) => ({
    type,
    raw: text.slice(start, end),
    range: [start, end],
    loc: { start: positionAt(start), end: positionAt(end) },
    ...extra,
  })

  const comments = hashExtensions.includes(extension)
    ? collectHashComments(text)
    : collectScriptComments(text, scriptKinds[extension] ?? ts.ScriptKind.TS)

  const children = []
  const proseEntries = []
  for (const comment of comments) {
    const trailing = isTrailing(text, comment.pos)
    for (const entry of toLineEntries(
      text,
      { ...comment, trailing },
      positionAt,
    )) {
      const content = text.slice(entry.start, entry.end)
      // textlint-disable と textlint-enable は Comment ノードとして出す。
      // textlint-filter-rule-comments が Comment ノードの value を見ている。
      if (textlintDirective.test(content)) {
        children.push(
          node('Comment', entry.start, entry.end, { value: content }),
        )
        continue
      }
      if (machineDirective.test(content)) {
        continue
      }
      proseEntries.push(entry)
    }
  }

  for (const paragraph of groupParagraphs(proseEntries)) {
    const lines = paragraph.entries
    // 日本語を含まない段落は検査しない。英語のコメントまで日本語のルールに
    // かけると、感嘆符や語の重複が指摘として出てしまう。
    if (!lines.some(line => japanese.test(text.slice(line.start, line.end)))) {
      continue
    }
    // Markdown の段落と同じく、Str は段落に 1 つだけ置く。行ごとに Str を分けると
    // no-doubled-joshi のように文単位で見るルールが指摘を落とす。
    //
    // Str の範囲は段落の先頭から末尾までなので、行の間のコメント記号が本文に
    // 混ざる。日本語のルールはどれも記号を語として数えないため実害はない。
    const start = lines[0].start
    const end = lines.at(-1).end
    children.push(
      node('Paragraph', start, end, {
        children: [node('Str', start, end, { value: text.slice(start, end) })],
      }),
    )
  }

  children.sort((a, b) => a.range[0] - b.range[0])
  return node('Document', 0, text.length, { children })
}

class CommentJaProcessor {
  constructor(options) {
    this.extensions = options?.extensions ?? []
  }

  availableExtensions() {
    return [...Object.keys(scriptKinds), ...hashExtensions, ...this.extensions]
  }

  processor(extension) {
    return {
      preProcess(text, filePath) {
        const target = extension ?? (filePath ? path.extname(filePath) : '.ts')
        return parse(text, target)
      },
      postProcess(messages, filePath) {
        return { messages, filePath: filePath ?? '<comment-ja>' }
      },
    }
  }
}

module.exports = { Processor: CommentJaProcessor }
