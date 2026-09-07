// 色は役割で呼ぶ。
// 見た目で呼ぶと、ダークモードで white が黒を指すことになり名前が嘘になる。
// 値は CSS 変数なので、テーマごとに差し替えられる。
// 変数の定義は app/styles/theme.ts にある。

export const text = 'var(--color-text)'
export const textMuted = 'var(--color-text-muted)'
// 濃い地の上に乗る文字
export const textInverted = 'var(--color-text-inverted)'

export const accent = 'var(--color-accent)'
// 本文リンクの下線のように、アクセント色を弱めて引く線。hover で accent に切り替える
export const accentMuted = 'var(--color-accent-muted)'
// Note のような、アクセント色を薄く敷いた面
export const accentSurface = 'var(--color-accent-surface)'
export const textOnAccentSurface = 'var(--color-text-on-accent-surface)'

// 注意を促す囲みと、補足や助言の囲み。accent と別の色相を持つのはこの 2 つだけ
export const warning = 'var(--color-warning)'
export const warningSurface = 'var(--color-warning-surface)'
export const textOnWarningSurface = 'var(--color-text-on-warning-surface)'

export const tip = 'var(--color-tip)'
export const tipSurface = 'var(--color-tip-surface)'
export const textOnTipSurface = 'var(--color-text-on-tip-surface)'

export const border = 'var(--color-border)'

export const surface = 'var(--color-surface)'
// インラインコードや表の縞のように、一段沈んで見える面
export const surfaceSubtle = 'var(--color-surface-subtle)'
export const surfaceHover = 'var(--color-surface-hover)'

// 文字ではなくアイコンに使う色
export const icon = 'var(--color-icon)'
