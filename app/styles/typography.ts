// 文字の大きさ、行間、太さ、書体。
//
// 大きさは用途で呼ぶ。段の番号 (size500 のような名前) にしないのは、
// 「見出しにはどれか」を毎回決め直すことになるためで、用途名なら
// 書くものから引ける。
//
// 定義しただけで、まだどこにも当てていない。適用はタイポグラフィの PR で行う。

// 本文 17px を基準に、比 1.2 の等比で組んである。1 行が全角 42 文字に
// なる幅 (720px) と合わせて、日本語の長文が読みやすい範囲に入れた。
export const fontSize = {
  // 日付やキャプションなど、本文より一段落とすもの
  caption: '13px',
  // 補助的な本文。リンクカードの説明など
  bodySmall: '15px',
  // 記事の地の文
  body: '17px',
  h4: '20px',
  h3: '24px',
  h2: '28px',
  // ページに 1 つだけ置く見出し。記事タイトルとサイト名
  h1: '34px',
  // コードブロック。地の文より小さくして、行の詰まりを抑える
  code: '14px',
} as const

// 行間は倍率で持つ。px で持つと、文字サイズを変えたときに追従しない。
export const lineHeight = {
  // 日本語の長文。1.8〜2.0 が読みやすさの幅で、その中央
  body: 1.9,
  // 見出し。折り返したときに離れすぎないように詰める
  heading: 1.4,
  // ボタンやタグのように、1 行で収まるもの
  tight: 1.25,
} as const

export const fontWeight = {
  normal: 400,
  bold: 700,
} as const

// 書体は読者の OS のものを使う。Web フォントを入れないのは、表示速度を
// 保つため。見た目の伸びしろは書体そのものより、行長と行間と大きさの
// 整理のほうが大きい。
//
// 見た目の回帰テストのコンテナでは、この並びのどれも存在しないため
// sans-serif に解決される。vrt/fonts/local.conf でその解決先を固定してある。
export const fontFamily = {
  // 和文を先に置く。欧文だけのフォントを先に置くと、和文がそのフォントの
  // フォールバックに委ねられ、環境によって別の書体が混ざる。
  body: [
    '"Hiragino Kaku Gothic ProN"',
    '"Hiragino Sans"',
    '"Yu Gothic UI"',
    '"Noto Sans JP"',
    'Roboto',
    '"Segoe UI"',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Noto Color Emoji"',
  ].join(', '),

  // ui-monospace は OS の標準の等幅を指す。macOS では SF Mono、
  // Windows では Cascadia Mono になる。
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    '"SF Mono"',
    'Menlo',
    'Consolas',
    '"Liberation Mono"',
    'monospace',
  ].join(', '),
} as const

export type FontSizeToken = keyof typeof fontSize
export type LineHeightToken = keyof typeof lineHeight
