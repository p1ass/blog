// 文頭のすぐ後ろに打つ読点を指摘する。
//
// 「議事録は、溜めても資産にならない」のように、主題を 1 語示しただけで読点を打つ
// 形を狙う。長い条件節の切れ目に打つ読点 (「Client Secret を安全に保管できない
// Public Client の場合は、」) は、読点が仕事をしているので対象にしない。
//
// morpheme-match の辞書では書けないためルールとして書いている。辞書はトークンの
// 並びしか表現できず、「文頭から何文字目か」を条件にできない。

const { tokenize } = require('kuromojin')

const DEFAULT_MAX_LENGTH = 5

// 文の切れ目。ここを過ぎたら「文頭」を数え直す。
const isSentenceEnd = token =>
  token.pos === '記号' &&
  ['句点', '一般'].includes(token.pos_detail_1) &&
  /^[。！？!?]$/.test(token.surface_form)

const isTouten = token => token.pos === '記号' && token.pos_detail_1 === '読点'

const isTopicWa = token =>
  token.pos === '助詞' &&
  token.pos_detail_1 === '係助詞' &&
  token.surface_form === 'は'

module.exports = {
  linter: context => {
    const { Syntax, RuleError, report, getSource, locator } = context
    const maxLength = context.config?.maxLength ?? DEFAULT_MAX_LENGTH

    return {
      async [Syntax.Str](node) {
        const tokens = await tokenize(getSource(node))
        let offset = 0 // node の先頭から見た文字位置
        let sentenceStart = 0 // 今の文が始まった文字位置
        let previous = null

        for (const token of tokens) {
          if (isTouten(token) && previous && isTopicWa(previous)) {
            const length = offset - sentenceStart
            if (length <= maxLength) {
              report(
                node,
                new RuleError(
                  `主題を ${length} 文字示しただけで読点を打っています。読点を外すか、文を組み替えられないか検討してください。`,
                  { padding: locator.at(offset) },
                ),
              )
            }
          }
          offset += token.surface_form.length
          if (isSentenceEnd(token)) {
            sentenceStart = offset
          }
          previous = token
        }
      },
    }
  },
}
