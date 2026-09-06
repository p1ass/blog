# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

[blog.p1ass.com](https://blog.p1ass.com) のソースコード。HonoX + MDX で書いた記事を SSG し、Cloudflare Pages へ配信する。

## コマンド

```shell
pnpm install
pnpm dev                     # Vite 開発サーバー
pnpm build                   # client ビルド → SSG ビルド (2 パス)
pnpm preview                 # ビルド済み dist を wrangler pages dev で確認
pnpm lint                    # biome check .
pnpm lint:fix                # biome check --fix .
pnpm install:playwright      # rehype-mermaid が使う chromium を入れる
```

テストは存在しない。`pnpm build` が実質の検証手段になる。

Mermaid 図は rehype-mermaid がビルド時に Playwright の chromium でレンダリングする。chromium が未インストールだとビルドが失敗するため、初回は `pnpm install:playwright` を実行する。

CI は Biome の lint (`biome ci .`) と、push ごとの build + Cloudflare Pages デプロイを実行する。

## アーキテクチャ

### ルーティングと SSG

`app/routes/` 配下のファイル配置がそのまま URL になる (HonoX のファイルベースルーティング)。エントリポイントは `app/server.ts`、`@hono/vite-ssg` が全ルートを静的 HTML として `dist/` に出力する。

動的セグメント (`categories/[id]`、`tags/[id]`、`page/[num]`) は `ssgParams()` でビルド時にパラメータを列挙する。カテゴリやタグを増やしても、列挙元は記事の frontmatter なので追加の設定は要らない。

`index.xml.ts` (RSS)、`sitemap.xml.ts`、`robots.txt.ts` も同じ仕組みで生成する。

### 記事の実体

記事は `app/routes/posts/<slug>/index.mdx` に置く。画像は同じディレクトリに co-location する。

frontmatter の型は `app/routes/posts/types.ts` の `Frontmatter` で定義する (`title` / `date` / `description` / `categories` / `tags?` / `ogImage?`)。`categories[0]` がカテゴリ一覧のグルーピングキーになる。

`{/* <!--more--> */}` は一覧ページの抜粋の区切りマーカーとして機能する。`PostSummarySection` が mdx ファイルを `fs.readFileSync` で読み、このマーカーより前を `MarkdownRenderer` でその場でコンパイルして表示する。記事を書くときは必ずこのマーカーを入れる。

### 記事データの集約

`app/lib/posts.ts` が `import.meta.glob('../routes/posts/**/*.mdx', { eager: true })` で全記事を読み込み、日付降順のリストを module スコープで一度だけ構築する。ページネーション、カテゴリ、タグ、前後記事へのリンクはすべてこのリストから導出する。記事一覧に関わる処理を足すときはここに関数を追加する。

### MDX のレンダリングの流れ

MDX には 2 つの流れがあり、プラグイン構成が異なる点に注意する。

1. 記事本体: `vite.config.ts` の `@mdx-js/rollup` がビルド時に変換する。プラグインは `app/lib/mdx.ts` の `remarkPlugins` / `rehypePlugins` を共有する。
2. 一覧の抜粋: `app/components/MarkdownRenderer.tsx` が `@mdx-js/mdx` の `compile` + `run` を実行時に呼ぶ。remark/rehype プラグインは適用されず、画像パスは文字列の置き換えで解決するワークアラウンドを入れている。

どちらも `app/lib/mdx-components.tsx` の `useMDXComponents()` を provider として使う。MDX から使えるカスタムコンポーネント (`ExLinkCard` / `BlockLink` / `Note` / `Twitter`) と、`img` や `pre` などの組み込みタグの差し替えはここで登録する。

### 画像パスの扱い

開発時とビルド後で画像の配置が変わるため、パス解決に分岐が入っている。

- ビルド時: `vite-plugin-static-copy` が `app/routes/posts/**/*.{png,jpg,jpeg,webp}` を `dist/posts/<slug>/` にコピーする。
- 実行時: `mdx-components.tsx` の `Image` と `MarkdownRenderer` が `import.meta.env.PROD` で分岐し、`/app/routes/posts/...` と `/posts/...` を切り替える。

画像を扱うコードを触るときは、両方の分岐を揃えて変更する。

### スタイリング

hono/css の `css` テンプレートリテラルで CSS-in-JS を書く。色は `app/styles/color.ts`、余白は `app/styles/variables.ts` の `verticalRhythmUnit` を基準にした倍数で指定する。ハードコードした色や余白は避け、これらの定数を使う。

グローバルスタイルは `app/routes/_renderer.tsx` の `:-hono-global` ブロックに集約する。ここには highlight.js のテーマも含む。

### レイアウト

- `app/routes/_renderer.tsx`: 全ページ共通の `<head>`、OGP メタタグ、ヘッダー、フッター。
- `app/routes/posts/_renderer.tsx`: 記事ページ用。タイトル、日付、シェアボタン、前後記事リンクを追加する。

`c.render()` の第 2 引数に渡す `Head` 型は `app/global.d.ts` で `ContextRenderer` を拡張して定義する。

### 外部依存

`app/lib/ogp.ts` が `https://blog-api.p1ass.com/ogp` を叩いて OGP 情報を取得する (`ExLinkCard` 用)。ビルド時に呼ばれるため、この API が落ちているとビルドが失敗する。同一ビルド内は module スコープの Map でキャッシュする。

## コーディング規約

Biome でフォーマットと lint を行う。シングルクォート、セミコロン省略、末尾カンマあり、arrow 関数の括弧省略。コミット前に `pnpm lint:fix` を実行する。

記事の日本語は `.textlintrc.json` の `preset-ja-technical-writing` と `preset-ja-spacing` に準拠させる。和文と欧文の間には半角スペースを入れる。検査の対象は記事だけでなく、`docs/` や `CLAUDE.md` を含むすべての Markdown。`pnpm lint:text` で回す。CI は変更されたファイルだけを検査する。

AI っぽい日本語は `@textlint-ja/morpheme-match` で検出する。辞書は `textlint/` に 3 つ置き、直訳調の動詞、硬い名詞、定型の言い回しに分けている。severity は `warning` で、CI は落とさない。

<!-- 辞書の説明として、検出対象の語そのものを例に引く段落 -->
<!-- textlint-disable @textlint-ja/morpheme-match -->

辞書は kuromoji の Token 列で書く。品詞と `basic_form` で照合するため、「効く」を 1 件書けば「効きます」「効かない」に当たり、名詞の「有効」「効率」には当たらない。語を足すときは次の 3 点に気をつける。

<!-- textlint-enable @textlint-ja/morpheme-match -->

- 分かち書きを先に確かめる。「無差別」は `無[接頭詞] + 差別[名詞]` に割れるので 2 トークンで書く。
- 既存 77 記事での出現数を数えてから入れる。自分がすでに使っている語を入れると警告だらけになる。
- マッチャは途中で外れたときに現在のトークンを先頭から試し直さない。複数トークンに割れる語をパターンの先頭に置くと当たらないことがある。

読点の打ち方だけは辞書ではなく `textlint/rules/short-topic-comma/` の自作ルールで見ている。主題を 5 文字以内示しただけで読点を打つ形 (「議事録は」の直後に読点を打つような形) を指摘する。辞書はトークンの並びしか書けず「文頭から何文字目か」を条件にできないため、辞書に書くと長い条件節の読点まで当たってしまう。ローカルパッケージとして `file:` で参照しているので、`pnpm install` すれば追加のフラグなしで読み込まれる。

`textlint/ai-japanese.test.ts` に、語ごとの「検出したい例」と「検出してはいけない例」がある。辞書とルールのどちらを触ったときもここに足す。

セッション中にユーザーから文章の語や言い回しを指摘されたら、その場で書き直して終わりにせず、辞書に足すところまでやる。辞書がこの指摘を覚えておくための唯一の場所で、入れなければ次のセッションで同じ指摘が出る。手順は上の 3 点と同じ。ただし既存 77 記事での出現数を数えた結果、ユーザー自身がすでによく使っている語だと分かった場合は辞書に入れず、数字を示してそう伝える。
