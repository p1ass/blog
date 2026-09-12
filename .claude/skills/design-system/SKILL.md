---
name: design-system
description: >-
  blog.p1ass.com の見た目を変えるSkill。
  方針は DESIGN.md にあり、この Skill はその参照先と作業の順序を案内する。
  ユーザーが以下のようなリクエストをした場合に使用すること:
  「コンポーネントを追加して」「スタイルを直して」「見た目を変えて」「色を変えて」
  「余白を調整して」「レスポンシブにして」「ダークモードに対応して」「スタイルガイドに追加して」。
  app/styles/ 配下、css`` を含むファイル、app/routes/_renderer.tsx を触るときは、
  明示的にスキル名を言及しなくても積極的にトリガーすること。
  記事の執筆は blog-writing、記事の校正は article-review を使うこと。
argument-hint: "[変えたい見た目 または コンポーネント名]"
---

# Design System

blog.p1ass.com の見た目を、デザイントークンの範囲で変える。

**方針は [DESIGN.md](../../../DESIGN.md) に、コンポーネントごとの見た目はスタイルガイド (`/styleguide`) にある。** この Skill はそこへの入口で、決めごとそのものは持たない。両方に書くと片方だけが古くなる。

hono/css の書き方の制約とハーネスの回し方は [CLAUDE.md](../../../CLAUDE.md) にある。

## 大原則

1. **値はトークンから引く**。色と寸法と分岐を、コンポーネントの側で決めない
2. **2 テーマぶんを同時に決める**。明るいテーマだけで成立する値は入れない
3. **見た目を変えたら基準画像を撮り直す**。撮り直す前に実物を開く

## 作業の流れ

### 1. DESIGN.md の該当節を読む

書き始める前に、これから触る領域の節を読む。実際の値は `app/styles/` にもあるが、なぜその値なのかは DESIGN.md にしかない。

| 触るもの | 読む節 |
| --- | --- |
| このサイトが何を目指しているか | [Overview](../../../DESIGN.md#overview) |
| カラー、コントラスト | [Colors](../../../DESIGN.md#colors) |
| 文字の大きさ、行間、見出し | [Typography](../../../DESIGN.md#typography) |
| 余白、本文幅、画面幅の分岐 | [Layout](../../../DESIGN.md#layout) |
| 影、面の重なり | [Elevation & Depth](../../../DESIGN.md#elevation--depth) |
| 角丸、ボーダー | [Shapes](../../../DESIGN.md#shapes) |
| リンク、hover、フォーカス、画像、モーションの方針 | [Components](../../../DESIGN.md#components) |
| ダークモード、テーマの選択 | [Theming](../../../DESIGN.md#theming) |
| アイコン、ブランドマーク | [Iconography](../../../DESIGN.md#iconography) |
| 見出しや本文の言い回し | [Terminology](../../../DESIGN.md#terminology) |

迷ったら [Do's and Don'ts](../../../DESIGN.md#dos-and-donts) を読む。よく踏む判断がまとまっている。

### 2. 既存の当たりを取る

`/styleguide` に、トークンと本文要素とコンポーネントが 1 ページに並んでいる。似た役割のコンポーネントがすでにないか、まずここを見る。

### 3. 書く

値は `app/styles/` のトークンから引く。front matter のトークン名と `app/styles/` の変数名は対応している。

| DESIGN.md の front matter | 実装 |
| --- | --- |
| `colors` のプリミティブ | `app/styles/palette.ts` |
| `colors` のセマンティック | `app/styles/color.ts` の役割名、割り当ては `theme.ts` |
| `typography` | `app/styles/typography.ts` |
| `spacing` | `app/styles/spacing.ts` |
| `rounded` | `app/styles/shape.ts` |
| `components` | 各コンポーネントの `css``` |

新しいコンポーネントは `app/components/` に置く。記事の MDX から使うなら `app/lib/mdx-components.tsx` の `useMDXComponents()` に登録する。

記事本文に新しい HTML 要素が出るようになるなら、先にスタイルを当ててから `scripts/check-build-output.ts` の `allowedElements` に置き場所つきで足す。順序を守る理由は [CLAUDE.md のビルド結果のチェック](../../../CLAUDE.md#ビルド結果のチェック)にある。

トークンにない値が要るときは、次の順で考える。

1. **段の意図を読み違えていないか**。`space.lg` を「大きめの余白」ではなく 24px として引いていないか
2. **その値は他でも使うか**。使うならトークンを足し、DESIGN.md の front matter と該当節の両方に足す
3. **そのコンポーネントひとつの都合か**。アバターの直径のような値はトークンにしない。`scripts/check-style-tokens.ts` の `exceptions` へ理由を書いて足す。理由が書けないなら、それはトークンで書ける値

### 4. スタイルガイドに載せる

トークンは `app/routes/styleguide/index.tsx` の `TokenTable` が定義を反復するので自動で表示される。コンポーネントを足したときは見本を書き足す。

hover やフォーカスは撮影のとき出ない。当たった状態を固定で描いた見本を別に置く。

### 5. 確かめる

```shell
pnpm lint:fix     # biome
pnpm lint:style   # CSS に生の値が無いか
pnpm test         # コントラストなど
pnpm vrt          # 見た目の回帰テスト (Docker が要る)
pnpm lint:text    # textlint
```

`pnpm vrt` が落ちたら、差分画像を見て意図した変更かを判断する。意図どおりなら `pnpm vrt:update` で撮り直す。撮り直す前の注意は [CLAUDE.md の見た目の回帰テスト](../../../CLAUDE.md#見た目の回帰テスト)にある。

DESIGN.md の front matter を触ったときは、形式も確かめる。

```shell
npx @google/design.md lint DESIGN.md
```

### 6. DESIGN.md を直す

**決めごとを変えたなら DESIGN.md を直す。** トークンを足したなら front matter に 1 行、判断が増えたなら該当節か Do's and Don'ts に 1 項目を足す。

DESIGN.md の本文は、複数のコンポーネントにまたがる方針だけを持つ。1 つのコンポーネントの寸法や配置は、手順 4 で足したスタイルガイドの見本が示す。何をいつ変えたかは PR とコミットに残す。
