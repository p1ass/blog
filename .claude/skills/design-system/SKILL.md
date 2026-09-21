---
name: design-system
description: >-
  blog.p1ass.com の見た目（UI・スタイル）を変更するためのスキル。
  基本方針は DESIGN.md に記載されており、このスキルはその参照先と作業手順を案内する。
  ユーザーが以下のようなリクエストをした場合に使用すること:
  「コンポーネントを追加して」「スタイルを直して」「見た目を変えて」「色を変えて」
  「余白を調整して」「レスポンシブにして」「ダークモードに対応して」「スタイルガイドに追加して」。
  app/styles/ 配下や css`` を含むファイル、app/routes/_renderer.tsx を編集する際は、
  スキル名が明示されていない場合でも積極的に呼び出すこと。
  記事の執筆には blog-writing、記事の校正には article-review を使用すること。
argument-hint: "[変えたい見た目 または コンポーネント名]"
---

# Design System

blog.p1ass.com の見た目を、デザイントークンの範囲内で変更する。

**全体の方針は [DESIGN.md](../../../DESIGN.md) に、各コンポーネントの見た目はスタイルガイド (`/styleguide`) に定義されている。** このスキルはそこへの案内役であり、設計ルールそのものは保持しない（両方に記載すると情報の同期が崩れるため）。

hono/css の記述制約やテストハーネスの実行方法は [CLAUDE.md](../../../CLAUDE.md) に記載されている。

## 大原則

1. **値はトークンを参照する**。色、寸法、レスポンシブのブレークポイントなどをコンポーネント側で直接定義しない。
2. **2 つのテーマ（ライト／ダーク）を同時に定義する**。ライトテーマだけでしか成立しない値を設定しない。
3. **見た目を変更したら基準画像を再撮影（更新）する**。再撮影する前に実際の画面を開いて確認する。

## 作業の流れ

### 1. DESIGN.md の該当節を読む

コードを書き始める前に、これから変更する領域の節を読む。具体的な値は `app/styles/` にも定義されているが、なぜその値になっているのかの背景・理由は DESIGN.md にのみ記載されている。

| 変更対象 | 読む節 |
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

判断に迷ったら [Do's and Don'ts](../../../DESIGN.md#dos-and-donts) を参照する。頻出の判断基準がまとまっている。

### 2. 既存実装のアタリをつける

`/styleguide` には、デザイントークン、本文要素、コンポーネントが一覧化されている。類似した役割のコンポーネントが既に存在しないか、まずここを確認する。

### 3. 実装する

スタイル値は `app/styles/` のトークンを参照する。DESIGN.md の front matter にあるトークン名と、`app/styles/` の変数名は対応している。

| DESIGN.md の front matter | 実装 |
| --- | --- |
| `colors` のプリミティブ | `app/styles/palette.ts` |
| `colors` のセマンティック | `app/styles/color.ts` の役割名、割り当ては `theme.ts` |
| `typography` | `app/styles/typography.ts` |
| `spacing` | `app/styles/spacing.ts` |
| `rounded` | `app/styles/shape.ts` |
| `components` | 各コンポーネントの `css``` |

新規コンポーネントは `app/components/` 配下に作成する。記事の MDX 内で使用する場合は、`app/lib/mdx-components.tsx` の `useMDXComponents()` に登録する。

記事本文で新しい HTML 要素を使用可能にする場合は、先にスタイルを適用してから `scripts/check-build-output.ts` の `allowedElements` に配置場所とともに追記する。この順序を守る理由については、[CLAUDE.md のビルド結果のチェック](../../../CLAUDE.md#ビルド結果のチェック)を参照のこと。

トークンに定義されていない値が必要になった場合は、次の順序で検討する。

1. **トークンのスケール意図を誤認していないか**。例えば `space.lg` を「コンテキストに応じた大きめの余白」ではなく、単に 24px という絶対値として選んでいないかを確認する。
2. **その値は他の箇所でも再利用されるか**。再利用されるならトークンとして新設し、DESIGN.md の front matter と該当節の双方に追加する。
3. **そのコンポーネント固有の値か**。アバターの直径のような単一コンポーネント固有の値はトークン化しない。`scripts/check-style-tokens.ts` の `exceptions` に理由を明記して追加する（正当な理由を説明できない場合は、既存のトークンで表現すべき値である）。

### 4. スタイルガイドに反映する

トークンは `app/routes/styleguide/index.tsx` の `TokenTable` が定義を走査して自動的に表示する。コンポーネントを追加した場合は、対応するサンプル表示（見本）を追記する。

hover やフォーカス時のスタイルは VRT 撮影時にキャプチャされないため、それらの状態を固定で描画した見本を別途用意する。

### 5. 検証する

```shell
pnpm lint:fix     # biome
pnpm lint:style   # CSS に生の値が無いか
pnpm test         # コントラストなど
pnpm vrt          # ビジュアルリグレッションテスト (Docker が必要)
pnpm lint:text    # textlint
```

`pnpm vrt` が失敗した場合は、差分画像を確認して意図した変更であるかを判断する。意図通りであれば `pnpm vrt:update` で基準画像を再撮影する。再撮影時の注意点については、[CLAUDE.md のリグレッションテスト](../../../CLAUDE.md#リグレッションテスト)を参照のこと。

DESIGN.md の front matter を変更した場合は、フォーマットの検証も行う。

```shell
npx @google/design.md lint DESIGN.md
```

### 6. DESIGN.md を更新する

**設計ルールや規約を変更した場合は、必ず DESIGN.md を更新する。** トークンを追加したなら front matter に 1 行、設計判断が追加されたなら該当節または Do's and Don'ts に 1 項目を追記する。

DESIGN.md の本文には、複数のコンポーネントに横断する共通方針のみを記載する。個々のコンポーネントの寸法や配置は、手順 4 で追加したスタイルガイドの見本で表現する。いつ、どのような理由で変更したかは、PR とコミットログに記録する。
