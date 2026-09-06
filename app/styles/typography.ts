// フォントサイズ、行間、フォントウェイト、フォントファミリー。
//
// 大きさは用途で呼ぶ。段の番号 (size500 のような名前) にすると「見出しにはどれか」を毎回決め直すことになるが、用途名なら書くものから引ける。
//
// 定義しただけで、まだどこにも当てていない。タイポグラフィの PR で適用する。

// 本文 17px を基準に、比 1.2 の等比。1 行が全角 42 文字になる幅 (720px) と合わせて、日本語の長文が読みやすい範囲に入れた。
export const fontSize = {
  caption: '13px', // 日付やキャプションなど、本文より一段落とすもの
  bodySmall: '15px', // リンクカードの説明などの補助的な本文
  body: '17px', // 記事の地の文
  h4: '20px',
  h3: '24px',
  h2: '28px',
  h1: '34px', // ページに 1 つだけ置く見出し。記事タイトルとサイト名
  code: '14px', // 地の文より小さくして、行の詰まりを抑える
} as const

// 行間は倍率で持つ。px で持つと、文字サイズを変えたときに追従しない。
export const lineHeight = {
  body: 1.9, // 日本語の長文は 1.8〜2.0 が読みやすさの幅で、その中央
  heading: 1.4, // 見出し。折り返したときに離れすぎないように詰める
  tight: 1.25, // ボタンやタグのように 1 行で収まるもの
} as const

export const fontWeight = {
  normal: 400,
  bold: 700,
} as const

// フォントは読者の OS のものを使う。Web フォントを入れないのは表示速度を保つためで、見た目の伸びしろはフォントそのものより行長と行間とサイズの整理のほうが大きい。
//
// 見た目の回帰テストのコンテナではこの並びのどれも存在しないため sans-serif に解決される。その解決先は vrt/fonts/local.conf で固定してある。
//
// フォント名を引用符で囲まないのは、hono/css が補間した値の " をエスケープし、\" という壊れた CSS になるため。
// CSS のフォント名は識別子の並びとして書けるので、引用符は要らない。
export const fontFamily = {
  // 和文を先に置く。欧文だけのフォントを先に置くと、和文がそのフォントのフォールバックに委ねられ、環境によって別のフォントが混ざる。
  body: [
    'Hiragino Kaku Gothic ProN',
    'Hiragino Sans',
    'Yu Gothic UI',
    'Noto Sans JP',
    'Roboto',
    'Segoe UI',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Noto Color Emoji',
  ].join(', '),

  // ui-monospace は OS の標準の等幅を指す。macOS では SF Mono、Windows では Cascadia Mono になる。
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    'SF Mono',
    'Menlo',
    'Consolas',
    'Liberation Mono',
    'monospace',
  ].join(', '),
} as const

export type FontSizeToken = keyof typeof fontSize
export type LineHeightToken = keyof typeof lineHeight
