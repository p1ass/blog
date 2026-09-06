// 色は役割で呼ぶ。
// 見た目で呼ぶと、ダークモードで white が黒を指すことになり名前が嘘になる。
// 値は CSS 変数なので、テーマごとに差し替えられる。
// 変数の定義は app/styles/theme.ts にある。

export const text = 'var(--color-text)'
export const textMuted = 'var(--color-text-muted)'
// 濃い地の上に乗る文字
export const textInverted = 'var(--color-text-inverted)'

export const accent = 'var(--color-accent)'
// Note のような、アクセント色を薄く敷いた面
export const accentSurface = 'var(--color-accent-surface)'
export const textOnAccentSurface = 'var(--color-text-on-accent-surface)'

export const border = 'var(--color-border)'

export const surface = 'var(--color-surface)'
// インラインコードや表の縞のように、一段沈んで見える面
export const surfaceSubtle = 'var(--color-surface-subtle)'
export const surfaceHover = 'var(--color-surface-hover)'

// 文字ではなくアイコンに使う色
export const icon = 'var(--color-icon)'
