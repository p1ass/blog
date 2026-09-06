import { createLinter, loadTextlintrc } from 'textlint'
import { beforeAll, describe, expect, it } from 'vitest'

// 実際の .textlintrc.json を読んで回す。辞書ファイルのパス解決も含めて検証したい。
const DICTIONARY_RULE_ID = '@textlint-ja/morpheme-match'
const COMMA_RULE_ID = 'short-topic-comma'

let lintWith: (ruleId: string, text: string) => Promise<string[]>
let lint: (text: string) => Promise<string[]>

beforeAll(async () => {
  const descriptor = await loadTextlintrc({
    configFilePath: '.textlintrc.json',
  })
  const linter = createLinter({ descriptor })
  lintWith = async (ruleId, text) => {
    const result = await linter.lintText(text, 'test.md')
    return result.messages.filter(m => m.ruleId === ruleId).map(m => m.message)
  }
  lint = text => lintWith(DICTIONARY_RULE_ID, text)
  // kuromoji の辞書読み込みを最初の 1 回でここに寄せる
  await lint('ウォームアップ')
}, 60_000)

// 検出したい表現。左が入力、右が指摘に含まれていてほしい語。
const detected: [string, string][] = [
  ['この設定が効きます。', '効く'],
  ['インデックスが効かない。', '効く'],
  ['同名の記事を書いた時点で壊れます。', '壊れる'],
  ['バッチ処理が走ります。', '走る'],
  ['色がビルド時に焼き込まれます。', '焼く'],
  ['問いの前提を崩します。', '崩す'],
  ['リポジトリ層が担います。', '担う'],
  ['MDX の経路が 2 つあります。', '経路'],
  ['リンク先の死活に依存しています。', '死活'],
  ['画像パスを文字列置換で直しています。', '置換'],
  ['検証の漏れがあります。', '漏れ'],
  ['実装の不備ではなく設計上の帰結です。', '帰結'],
  ['無検証の文字列 SQL は論外です。', '論外'],
  ['原初の売り文句は無価値です。', '原初'],
  ['動的な組み立てが最大の穴です。', '穴'],
  ['記事からラベルへの向きを共通化しません。', '向き'],
  ['無差別置換で解決しています。', '無差別'],
  ['この事実を正典とします。', '正典'],
  ['この事実を正本とします。', '正本'],
  ['各実装に配線します。', '配線'],
  ['いずれも動きません。', 'いずれも'],
  ['これは設計の問題に他ならない。', '他ならない'],
  ['これは設計の問題にほかならない。', 'ほかならない'],
  ['ファイルのみならずディレクトリも対象です。', 'のみならず'],
  ['型が確定するという点で差があります。', 'という点で'],
  ['限界を示すに過ぎません。', '過ぎない'],
  ['限界を示すにすぎません。', '過ぎない'],
  // 本文はですます体なので、否定形は「ない」より「ません」のほうがよく出る
  ['これは設計の問題に他なりません。', '他ならない'],
  ['これは設計の問題にほかなりません。', 'ほかならない'],
  ['エラーが黙って握りつぶされます。', '黙って'],
  ['警告を出さず黙って進みます。', '黙って'],
  ['sans-serif が中国語のフォントに落ちます。', '落ちる'],
  ['指定が無いと既定値に落ちる。', '落ちる'],
]

// 検出してはいけない表現。品詞や語の並びで区別できていることを確かめる。
const notDetected: string[] = [
  '有効活用していきたいです。', // 有効 は名詞なので 効く に当たらない
  '効率よく進めます。', // 効率 も同様
  'リクエストが落ち着く前に切ります。', // 落ち着く は別の動詞
  '水が漏れるので直します。', // 漏れる は動詞なので名詞の 漏れ に当たらない
  '次の実験の配線を準備します。', // 助詞が「の」なので に配線する に当たらない
  '光配線方式の物件に住んでいます。', // 同上
  'この点で意見が分かれます。', // という が前に無いので という点で に当たらない
  '結果として妥当な線に落ち着きました。',
  '自走できるエンジニアを目指します。', // 自走 は 自 + 走 に割れるが、走る とは区別する
  'サーバーが落ちました。', // キャリブレーションで外した語
  'コードを載せておきます。',
  'テストケースを通しました。',
  '部屋にゴミが落ちている。', // 「に」の直後が「ゴミ」なので当たらない
  '暗黙的にアクセスできます。', // 暗黙 は名詞なので 黙る に当たらない
  '暗黙的に必要とされるスキルがあります。', // 同上
  '出力の品質が落ちました。', // 助詞が「が」なので に落ちる に当たらない
]

// 割り切って通している誤検出。
// 「に落ちる」から選考や落下の意味だけを形態素で切り分ける方法がなく、
// フォールバックの意味を捕まえる代わりにここは諦めている。severity は
// warning なので CI は落ちない。取りこぼしに変わったら気づけるよう、
// 指摘されること自体をテストに残す。
const knownFalsePositives: [string, string][] = [
  ['選考に落ちてしまいました。', '落ちる'],
]

describe('AI っぽい日本語の辞書', () => {
  it.each(detected)('%s を指摘する', async (text, expected) => {
    const messages = await lint(text)
    expect(messages.join('\n')).toContain(expected)
  })

  it.each(notDetected)('%s は指摘しない', async text => {
    expect(await lint(text)).toEqual([])
  })

  it.each(
    knownFalsePositives,
  )('%s は別義だが指摘してしまう', async (text, expected) => {
    const messages = await lint(text)
    expect(messages.join('\n')).toContain(expected)
  })
})

// 読点は辞書ではなく textlint/rules/short-topic-comma で見ている。
// しきい値は文頭から読点まで 5 文字以内。
describe('文頭のすぐ後ろの読点', () => {
  const detected: [string, number][] = [
    ['議事録は、溜めても資産になりません。', 4],
    ['目的は、記事を見分けることです。', 3],
    ['今回は、M1 Mac で試します。', 3],
    // 2 文目でも文頭から数え直す
    ['前提を確認します。結論は、まだ出ていません。', 3],
  ]

  const notDetected: string[] = [
    // 長い条件節の切れ目に打つ読点は、読点が仕事をしているので対象外
    'Client Secret を安全に保管できない Public Client の場合は、認可コードを使います。',
    'ブラウザ上の JavaScript がリソースサーバーにリクエストを行う場合は、CORS を設定します。',
    'そこで、次の手を考えます。', // 接続詞のあとの読点は は を含まない
    'こんにちは、p1ass です。', // 感動詞も同様
    '議事録は溜めても資産になりません。', // 読点がなければ当たらない
  ]

  it.each(detected)('%s を指摘する', async (text, length) => {
    const messages = await lintWith(COMMA_RULE_ID, text)
    expect(messages.join('\n')).toContain(`主題を ${length} 文字示しただけで`)
  })

  it.each(notDetected)('%s は指摘しない', async text => {
    expect(await lintWith(COMMA_RULE_ID, text)).toEqual([])
  })
})
