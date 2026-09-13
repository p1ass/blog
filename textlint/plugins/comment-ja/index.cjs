// textlint --fix は preProcess が返したテキストをファイルへ書き戻すので、テキストは原文のまま返し AST だけを作る。
// no-doubled-joshi のように文単位で見るルールが行またぎの文を落とさないよう、連続する行は 1 つの Str にまとめる。

const path = require('node:path')
const ts = require('typescript')

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

const hashExtensions = ['.yaml', '.yml', '.sh']

const japanese = /[ぁ-んァ-ヶ一-龠々ー]/
const textlintDirective = /^textlint-(disable|enable)\b/
const machineDirective = /^(biome-ignore|eslint-disable|eslint-enable|@ts-)/

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

// 閉じ括弧の直前のようにノードの開始位置に現れないコメントも拾うため、トークンまで降りる。
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
      // textlint-filter-rule-comments は Comment ノードの value を見る。
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
    // 英語のコメントを日本語のルールにかけると、感嘆符や語の重複が指摘として出る。
    if (!lines.some(line => japanese.test(text.slice(line.start, line.end)))) {
      continue
    }
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
