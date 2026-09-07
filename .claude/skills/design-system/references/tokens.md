# トークンの対応表

`app/styles/` の各ファイルが何を持つか。値の根拠は [docs/design-system.md](../../../../docs/design-system.md) にある。

## カラー

色は 3 層に分かれる。コンポーネントから触ってよいのは `color.ts` だけ。

| ファイル | 何を持つか | 触るとき |
| --- | --- | --- |
| `palette.ts` | 色の値そのもの。neutral 12 段、accent 10 段、warning と tip が 4 段ずつ | 段を足すとき |
| `theme.ts` | 役割への割り当て。`light` と `dark` の 2 つ | 役割を足すとき。必ず両方に書く |
| `color.ts` | 役割名。`var(--color-*)` を返す | 役割を足すとき |

役割の一覧は `color.ts` を読む。よく使うもの:

| 役割 | 用途 |
| --- | --- |
| `text` / `textMuted` | 地の文と、日付やキャプションのような一段落とす文字 |
| `textInverted` | 濃い地の上に乗る文字 |
| `accent` | リンクの文字、アクセント線 |
| `accentMuted` | 本文リンクの下線。hover で `accent` に切り替える |
| `border` | 罫線、囲みの境界 |
| `surface` / `surfaceSubtle` / `surfaceHover` | 地、一段沈んだ面、hover で敷く面 |
| `icon` | 文字ではなくアイコンに使う色 |
| `warning` / `tip` とその `*Surface` | `Note` の 3 種別のうち info 以外 |

他社のブランドカラーは `brand.ts` にある。テーマで差し替えないので CSS 変数にしていない。値はこちらで決められないので、コントラストの検証からも外してある。

## タイポグラフィ

`typography.ts`。

| トークン | 中身 |
| --- | --- |
| `fontSize` | `caption` 13 / `bodySmall` 15 / `body` 17 / `h4` 20 / `h3` 24 / `h2` 28 / `h1` 34 / `code` 14 (px) |
| `lineHeight` | `body` 1.9 / `heading` 1.4 / `tight` 1.25。倍率で持ち、px では持たない |
| `fontWeight` | `normal` 400 / `bold` 700 |
| `fontFamily` | `body` と `mono`。読者の OS のフォントを使う。Web フォントは入れない |
| `underline` | リンクの下線の太さと offset。ボーダーとは別に持つ |

段の名前は用途で付いている。番号にすると「見出しにはどれか」を毎回決め直すことになる。

h5 と h6 は本文と同じ大きさで、太さだけで区別する。

## スペーシング

`spacing.ts`。4px の倍数。

| トークン | 値 |
| --- | --- |
| `space['2xs']` | 4px |
| `space.xs` | 8px |
| `space.sm` | 12px |
| `space.md` | 16px |
| `space.lg` | 24px |
| `space.xl` | 32px |
| `space['2xl']` | 48px |
| `space['3xl']` | 64px |
| `space['4xl']` | 96px |
| `blockGap` | 32px。本文のブロック間。行送りと同じ値 |

## 角丸・ボーダー・フォーカス

`shape.ts`。

| トークン | 値と用途 |
| --- | --- |
| `radius.sm` | 4px。インラインコード、タグ、小さいボタン |
| `radius.md` | 8px。カード、コードブロック、囲み |
| `radius.full` | アバター、アイコンボタン |
| `borderWidth.thin` | 1px。通常の罫線 |
| `borderWidth.thick` | 3px。引用の左線と一覧カードのアクセント線だけ |
| `focusRing` | `:focus-visible` のリング。幅とオフセットが 2px |

影は使わない。階層はボーダーと面のカラーで作る。`box-shadow` は lint が落とす。

## レイアウト

`breakpoint.ts`。

| トークン | 値 |
| --- | --- |
| `breakpoint.sm` | 640px |
| `breakpoint.lg` | 1080px。本文の右に目次を置ける幅 |
| `contentWidth` | 760px。17px で 1 行が全角 44 文字 |

分岐は `min-width` に統一し、狭いほうを既定として書く。生の `@media` は書かず `mediaUp('sm')` を通す。

## モーション

`motion.ts` と `transition.ts`。

| トークン | 値 |
| --- | --- |
| `duration.fast` | 150ms。hover や focus の色の変化 |
| `duration.base` | 250ms。面の入れ替わりや、少し距離のある動き |
| `easing` | `ease-out` の 1 種類 |
| `reducedMotion` | 動きを減らす設定の読者への分岐 |

`transition: all` は書かない。`transition(['color', 'background-color'], 'base')` のように、動かすプロパティを名指しする。

## リンク

`link.ts` に 2 種類だけ置いてある。

| トークン | どこで使うか |
| --- | --- |
| `bodyLinkCss` | 文章の中に置くリンク。薄い下線を常に引き、hover と focus で `accent` まで濃くする |
| `hoverUnderlineLinkCss` | 単独で置くリンク。下線を透明にしておき hover で現れさせる |

どちらも hover で下線を太くし、背後に `surfaceSubtle` を敷く。文字の色は動かさない。`accent` は白地で 4.91 対 1 しかなく、薄くすると本文の基準を割る。

## トークンにしないもの

部品ひとつの都合で決まる寸法は、トークンにしても引く先が 1 箇所にしかない。アバターの直径、リンクカードのサムネイルの高さ、テーマの一覧の幅などがこれにあたる。

`scripts/check-style-tokens.ts` はこの区別を、プロパティで付けている。`padding`、`border-radius`、`font-size` のようにページ全体のリズムを決めるものは生の値を落とし、`width` と `height` は見ない。

落ちた値がどうしてもトークンにならないときは、同じファイルの `exceptions` に理由を書いて足す。使われなくなった項目が残っていると、それも検査が落とす。
