# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

[blog.p1ass.com](https://blog.p1ass.com) のソースコード。HonoX + MDX で書いた記事を SSG し、Cloudflare Pages へ配信する。

## 用語

型名、変数名、コミットメッセージ、ドキュメントで同じ語を使う。同義語を混ぜると、同じものを指しているかどうかがコードから読み取れなくなる。

<!-- 使わない語そのものを表に並べるため、辞書の検査を外す -->
<!-- textlint-disable @textlint-ja/morpheme-match -->

| 使う | 指すもの | 使わない |
| --- | --- | --- |
| Post | 1 本の記事 | Article, Entry, Blog |
| Slug | 記事を見分けるキー。ディレクトリ名がそのまま Slug になる | ID, Path, Permalink |
| Permalink | 記事の恒久的な URL。Slug から導出する | URL, Link, Href |
| Frontmatter | 記事の先頭に置く、記事そのものについての情報 | Meta, Metadata, Header |
| Description | Frontmatter に書く、記事を 1 文で説明する装飾のないテキスト | — |
| ContentSummary | 一覧に載せる記事の冒頭。Excerpt Marker より前 | Excerpt, Summary, 概要 |
| Excerpt Marker | 本文中に置く `{/* <!--more--> */}` | More tag, 区切り |
| Label | 記事に貼るしるし。Category と Tag の上位概念 | Taxonomy, Term, 分類 |
| LabelKind | Label の種類。`category` と `tag` の 2 つ | Type, Kind |
| LabelId | Label を見分けるキー。URL に現れる | Slug (Slug は Post のもの) |
| LabelPage | ある Label が付いた記事の 1 ページぶん | — |
| Category | 記事の主題を 1 つだけ表す Label。記事は必ず 1 つ持つ | Genre, Section, ジャンル |
| Tag | 記事に登場する話題を表す Label。記事は 0 個以上持つ | Keyword, Topic, キーワード |
| OGP | 参照した外部ページが名乗るタイトル・説明・画像 | Metadata, Preview, Card data |
| OGP Cache | 取得済みの OGP をリポジトリに保存したもの | Snapshot, Store |
| OG Image | 記事が SNS で共有されたときに表示される画像 | OGP 画像, Thumbnail |
| Theme | 配色の切り替え状態。`system` / `light` / `dark` | Mode, Color scheme |
| Color Token | 色を役割で呼ぶための名前 | Palette, Color variable |
| TOC | 記事本文の見出しから作る目次 | Table of contents, Index, Outline |

<!-- textlint-enable @textlint-ja/morpheme-match -->

「ダークモード」と「目次」は機能名や UI 上の表記としては使う。状態や型の名前としては使わない。

見た目にまつわる語 (カラー、スペーシング、ボーダーなど) は [DESIGN.md](DESIGN.md#terminology) にある。

## コマンド

```shell
pnpm install
pnpm dev                     # Vite 開発サーバー
pnpm build                   # client ビルド → SSG ビルド (2 パス)
pnpm preview                 # ビルド済み dist を wrangler pages dev で確認
pnpm lint                    # biome check .
pnpm lint:fix                # biome check --fix .
pnpm lint:style              # CSS に生の値が書かれていないか
pnpm lint:text               # textlint
pnpm test                    # vitest
pnpm vrt                     # 見た目の回帰テスト (Docker が要る)
pnpm vrt:update              # 基準画像を撮り直す
pnpm install:playwright      # rehype-mermaid が使う chromium を入れる
```

Mermaid 図は rehype-mermaid がビルド時に Playwright の chromium でレンダリングする。chromium が未インストールだとビルドが失敗するため、初回は `pnpm install:playwright` を実行する。

CI では、Biome の lint (`biome ci .`)、`pnpm lint:style`、`pnpm test`、変更されたファイルへの textlint、push ごとの build + Cloudflare Pages デプロイ、見た目の回帰テストが回る。

`scripts/` の実行ファイルは TypeScript で書き、[Node の型剥がし](https://nodejs.org/api/typescript.html#type-stripping)でそのまま動かす。`node scripts/check-style-tokens.ts` のように直接呼べる。フラグ無しで有効になるのは Node 22.18 以降。

## アーキテクチャ

### ルーティングと SSG

`app/routes/` 配下のファイル配置がそのまま URL になる (HonoX のファイルベースルーティング)。エントリポイントは `app/server.ts`、`@hono/vite-ssg` が全ルートを静的 HTML として `dist/` に出力する。

動的セグメント (`categories/[id]`、`tags/[id]`、`page/[num]`) は `ssgParams()` でビルド時にパラメータを列挙する。カテゴリやタグを増やしても、列挙元は記事の frontmatter なので追加の設定は要らない。

`index.xml.ts` (RSS)、`sitemap.xml.ts`、`robots.txt.ts` も同じ仕組みで生成する。

### 記事の実体

記事は `app/routes/posts/<slug>/index.mdx` に置く。画像は同じディレクトリに co-location する。

frontmatter の型は `app/routes/posts/types.ts` の `Frontmatter` で定義する (`title` / `date` / `description` / `categories` / `tags?` / `ogImage?`)。`categories[0]` がカテゴリ一覧のグルーピングキーになる。

`{/* <!--more--> */}` が ContentSummary の終わりを示す Excerpt Marker になる。`PostSummarySection` が mdx ファイルを `fs.readFileSync` で読み、このマーカーより前を `MarkdownRenderer` でその場でコンパイルして表示する。記事を書くときは必ずこのマーカーを入れる。

### 記事データの集約

`app/lib/posts.ts` が `import.meta.glob('../routes/posts/**/*.mdx', { eager: true })` で全記事を読み込み、日付降順のリストを module スコープで一度だけ構築する。ページネーション、カテゴリ、タグ、前後記事へのリンクの導出元は、すべてこのリストになる。記事一覧に関わる処理を足すときは、ここに関数を追加する。

### MDX のレンダリングの流れ

MDX には 2 つの流れがあり、プラグイン構成が異なる。

1. 記事本体: `vite.config.ts` の `@mdx-js/rollup` がビルド時に変換する。プラグインは `app/lib/mdx.ts` の `remarkPlugins` / `rehypePlugins` と共通。
2. 一覧の抜粋: `app/components/MarkdownRenderer.tsx` が `@mdx-js/mdx` の `compile` + `run` を実行時に呼ぶ。remark/rehype プラグインは適用されず、画像パスは文字列の置き換えで解決するワークアラウンドを入れている。

どちらも `app/lib/mdx-components.tsx` の `useMDXComponents()` を provider として使う。MDX から使えるカスタムコンポーネント (`ExLinkCard` / `BlockLink` / `Note` / `Twitter`) と、`img` や `pre` などの組み込みタグの差し替えはここで登録する。

### 画像パスの扱い

開発時とビルド後で画像の配置が変わるため、パス解決に分岐が入っている。

- ビルド時: `vite-plugin-static-copy` が `app/routes/posts/**/*.{png,jpg,jpeg,webp}` を `dist/posts/<slug>/` にコピーする。
- 実行時: `mdx-components.tsx` の `Image` と `MarkdownRenderer` が `import.meta.env.PROD` で分岐し、`/app/routes/posts/...` と `/posts/...` を切り替える。

画像を扱うコードを触るときは、両方の分岐を揃えて変更する。

### スタイリング

見た目の決めごとは [DESIGN.md](DESIGN.md) にある。[design.md](https://github.com/google-labs-code/design.md) 形式で、front matter がトークン、本文がその理由になっている。書くときの手順は `.claude/skills/design-system/` の Skill にある。

hono/css の `css` テンプレートリテラルで CSS-in-JS を書く。値は `app/styles/` のトークンを参照する。色は `color.ts` の役割名、余白は `spacing.ts` の `space`、角丸とボーダーは `shape.ts`、画面幅の分岐は `breakpoint.ts` の `mediaUp()` を使う。

生の値は `scripts/check-style-tokens.ts` が落とす。対象と例外の書き方は「生の値のチェック」にある。

グローバルスタイルは `app/routes/_renderer.tsx` の `:-hono-global` ブロックに集約する。ここには `app/styles/highlight.ts` から取り込む highlight.js のテーマも含む。テーマは [highlight.js](https://github.com/highlightjs/highlight.js) の `atom-one-dark.css` を写したもので、配布元の帰属表示を `highlight.ts` に残してある。

#### hono/css の制約

踏むと見た目が破綻するうえ、原因が読み取りにくい。

- **`${...}` は最後に置く。** hono/css は `&:hover` をそのまま出力し、入れ子の解決はブラウザに任せる。取り込んだスタイルが `&:hover` を持つと、その後ろに書いた宣言が入れ子の外へ出て捨てられる。
- **`text-decoration` のショートハンドを書かない。** `text-decoration-color` を初期値に戻すので、取り込む側が先に書いた色が消える。`text-decoration-line` なら順序に関わらず残る。
- **クラスを `${...}` でセレクタの位置に差し込まない。** クラス名ではなく中身の宣言そのものへ展開されることがある。単独のセレクタでは名前として出て、カンマで 2 つ並べた側では展開された。中の要素は素のクラス名で指し、クラスは `cx()` で足す。テンプレートリテラルで文字列としてつなぐと、SSR の最中に `document is not defined` で落ちる。
- **`:-hono-global` の中に複数行のコメントを書かない。** 判定が `/^:-hono-global{(.*)}$/` で `.` は改行に一致しないため、改行が残るとブロックごと展開されず CSS 全体が無効になる。説明はテンプレートの外に書く。
- **CSS のコメントに波括弧を書かない。** 最小化はコメントを読み飛ばさないので、`{` や `}` が対応付けを狂わせる。
- **補間した値に二重引用符を入れない。** エスケープされて宣言ごと無効になる。テンプレートに直接書いた文字列は素通しなので、値を定数へ切り出したときに初めて表面化する。
- **プラグインが吐くクラス名を当てにしない。** 脚注の見出しは remark が `<h2 class="sr-only">` を出力するが、CSS 側に定義がないことは出力を読むまで分からない。頼る前に生成物を検索する。

### レイアウト

- `app/routes/_renderer.tsx`: 全ページ共通の `<head>`、OGP メタタグ、ヘッダー、フッター。
- `app/routes/posts/_renderer.tsx`: 記事ページ用。タイトル、日付、シェアボタン、前後記事リンクを追加する。

`c.render()` の第 2 引数に渡す `Head` 型は `app/global.d.ts` で `ContextRenderer` を拡張して定義する。

### 島

`app/islands/` に置いたコンポーネントはブラウザで水和する。今あるのは `ThemePicker` だけ。

**同じページに 2 つめの島を置いても水和しない。** SSR のとき、先に描かれた島より後ろの島は `honox-island` に包まれないまま出る。hono/jsx の文脈が最初の島の後ろへ漏れているためで、こちらでは直せない。ヘッダーの `ThemePicker` は必ず先に描かれるので、記事本文やフッターへ置いた島は動かない。

ブラウザでだけ動かしたい処理は、島にせず `app/client.ts` から呼ぶ。ツイートの埋め込み (`app/lib/twitter-embed.ts`) がその形で、SSR は素の blockquote を出し、client.ts が widgets.js を読んで差し替える。

### 外部依存

リンクカードの OGP は、リポジトリの `ogp-cache.json` を参照する (`app/lib/ogp.ts`)。ビルドのたびに取得すると、同じコードに対して見た目の回帰テストが落ちたり通ったりする。更新は `pnpm ogp:refresh` の手動実行。

取得は `app/lib/ogp-fetch.ts` が自前で行う。リンク先の HTML を取り、meta タグから `title`、`description`、`image` の 3 つだけを読む。文字コードは Content-Type ヘッダか meta の charset に従う。以前は自前の別サービスに問い合わせていたが、取るものが meta タグだけなので、サービスが生きているかどうかにビルドが左右される形をやめた。解析は `app/lib/ogp-fetch.test.ts` で見る。

キャッシュに無い URL だけ、ビルド時に取得する。リンクカードを足した直後だけこの流れを通る。取得に失敗しても例外は投げず、素のリンクにフォールバックする。投げると `@hono/vite-ssg` がページの代わりに "Internal Server Error" を書き出し、ビルドが成功したままその記事だけ本番から消える。

### OG 画像

記事の OG 画像は `scripts/generate-og-images.ts` が `public/posts/<slug>/og.png` へ生成する。satori で SVG を組み、resvg で PNG にする。タイトルは左揃えで、上下の中央に置く。frontmatter に `ogImage` を書いた記事は、その指定を使うので生成しない。

生成した画像はリポジトリにコミットする。ビルドの環境やフォントが変わって絵が動いたら、PR の差分で気づける。基準画像を 36 枚コミットしている見た目の回帰テストと同じ扱いにしてある。

生成はビルドのたびに回す。`pnpm build` は vite より先にこのスクリプトを実行し、`public/` の中身は vite がそのまま `dist/` へコピーする。記事を足したその回のビルドから画像が出るので、生成し忘れが起きない。

フォントは `fonts/` の Gen Interface JP を埋め込む。見た目の回帰テストのコンテナに入れるのと同じものなので、撮影した画像と同じ字面で出る。読者の環境のフォントには左右されない。

改行は budoux が返す文節で決める。satori に任せると幅が尽きた場所で折り返して「参加し|て」のような切れ方になる。文字の大きさは、タイトルだけを satori に描かせて高さを測り、収まる中でいちばん大きいものを選ぶ。

色は `app/styles/theme.ts` の明るいテーマを参照する。OG 画像は SNS の白い枠の中に出るので、読者のテーマには従わない。

## ハーネス

DESIGN.md の決めごとを、人が覚えている必要のない形にするための仕掛け。

| ハーネス | 何を守るか | いつ回るか |
| --- | --- | --- |
| 見た目の回帰テスト | ページの見た目が意図せず変わっていないこと | `pnpm vrt`、CI |
| スタイルガイド | トークンとコンポーネントが 1 ページで見渡せること | `/styleguide` |
| ビルド結果のチェック | 記事が全部出ていること、OG 画像に実体があること、本文に知らない要素が出ていないこと | `pnpm build` の最後 |
| 生の値のチェック | CSS がトークンを通していること | `pnpm lint:style`、CI |
| コントラストの検証 | 両テーマで WCAG 2.2 AA を満たすこと | `pnpm test`、CI |

### 見た目の回帰テスト

ビルドから撮影までを Playwright 公式イメージ (linux/amd64) で完結させ、CI も同じイメージで回す。9 ページを、デスクトップとモバイル × ライトとダークの 4 組で撮り、36 枚の基準画像を `vrt/__screenshots__/` にコミットする。Docker が要る。ホストが macOS だとヒラギノで描かれるため、直接 Playwright を回すと CI と一致しない。

撮る対象はトップ、カテゴリ一覧、タグ一覧、スタイルガイド、記事 5 本。記事は要素を網羅するように選んである。`java-catch-up` が表とコードと画像とリンクカード、`isucon11` が横に長いコードブロック、`isucon13` が Mermaid 図、`oauth-2-for-browser-apps` が Note、`enum` が脚注にあたる。

`threshold` と `maxDiffPixels`、それに再試行はすべて 0 にしてある。[`toHaveScreenshot` の既定値](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1)である `threshold` 0.2 では色の変更を検出できない。accent を `#4172b5` から `#4172b8` に変えても、当時の 18 枚 (ダークを足す前の枚数) のうち 16 枚が素通りした。再試行を残さないのは、撮影の揺れとデザインの変更が同じ「落ちた」で混ざるためだ。揺れがないなら、落ちたことがそのまま変更を意味する。

揺れを消すために、撮影側にも仕掛けがある。素の Playwright イメージには和文フォントがなく `sans-serif` が中国語のフォントに解決されるため、Gen Interface JP をイメージに入れ、`vrt/local.conf` で解決先を固定してある。最初の fullPage 撮影はページ高さを変える (可視域の外にあった外部画像がまとめて読み込みに行く) ので、捨てる 1 枚を先に撮る。外部画像は abort せず、決まったプレースホルダを返す。遮断すると、読み込みに失敗した画像の描画が実行ごとに揺れる。

撮影のときの注意が 3 つある。

- **ホストで `pnpm build` を回さない。** コンテナはリポジトリをそのままマウントしていて `dist/` を共有する。撮影の途中でホストが `dist/` を作り直すと、そのとき出力が揃っていない記事が 404 になり、基準画像の更新がその記事だけ飛ぶ。
- **基準画像を受け入れる前に実物を開く。** 回帰テストは変化を検出するが、良し悪しは判断しない。全ページが一斉に変わる変更では、少なくともスタイルガイドとトップと記事の 3 枚を見る。
- **Mermaid の図はビルドのたびにわずかに動くことがある。** `rehype-mermaid` はビルド時に Playwright で文字幅を実測して座標を決める。同じコンテナの中でも 30 ピクセル程度の差が出た。落ちたときは差分の位置を見て、図の中だけなら撮り直す。

### スタイルガイド

`/styleguide` に、トークンと本文要素とコンポーネントを 1 ページに並べる。トークンの定義をそのまま反復して表にするので、トークンを足せばページにも表示される。記事ではないので `noindex` を付け、`robots.txt` からも外す。

見出しは記事本文とカードの両方の文脈で載せる。一方の文脈だけだと、文脈をまたぐ衝突に気づけない。

フォーカスリングと hover したリンクは、当たった状態を固定で描いた見本を別に置く。撮影のときカーソルは乗らず、フォーカスも当たらないので、そのままだと基準画像に写らない。値を二重に持つため、`link.ts` の hover 側を変えたらこの見本も直す。

### ビルド結果のチェック

`scripts/check-build-output.ts` が、ビルドの最後に 3 つを確かめる。

1 つめは全記事に `index.html` があること。`@hono/vite-ssg` はルートが例外を投げても "Internal Server Error" を本文として書き出し、ビルドを成功させる。Content-Type が `text/plain` になるためファイル名が `index.txt` になり、その記事は本番で 404 になるが、ログには何も出ない。

2 つめは `og:image` の指す先に実体があること。参照の `/static/ogp.png` と実体の `public/static/opg.png` で綴りが食い違っていて、フォールバックの画像が長いあいだ 404 を返していた。この種の食い違いは、SNS に流れるまで誰も気づかない。

3 つめは記事本文に知らない要素が出ていないこと。記事は MDX なので、生の HTML を書けば何でも入る。一覧は同じファイルの `allowedElements` にあり、要素ごとにスタイルの置き場所を書いてある。**要素を足すときは、先にスタイルを当ててから一覧に足す。** 順序を逆にすると、このチェックが「見た目を揃える」という役目を失う。

`svg` の中は数えない。Mermaid と埋め込みが持つ領域で、こちらでスタイルを当てないためだ。`foreignObject` の中には `div` や `span` が入るので、要素名だけで外すと本文のものと見分けが付かない。部分木ごと飛ばす。

### 生の値のチェック

`scripts/check-style-tokens.ts` が、CSS に生の値が書かれていないかを見る。

見るのは `` css`` `` と `` keyframes`` `` の中身と、JSX の `style` 属性だけ。範囲は TypeScript のパーサで取り出す。日本語のコメントや記事の本文にも `17px` や `#4172b5` は出てくるが、それは説明であって描画には反映されない。ファイル全体を正規表現で見ると、この区別が付かない。

px・rem・em はトークンを持つプロパティだけ見る。対象は `padding` `margin` `gap` `border` とその周り、`border-radius`、`outline`、`font-size`、`max-width` と `min-width`、下線の太さと offset。`width` や `height` は見ない。コンポーネントひとつの都合で決まる寸法に共通の基準はなく、そこまで縛ると、理由を書いた例外ばかりが並ぶチェックになる。

トークンにできない箇所は、同じファイルの `exceptions` にファイルと種別と値と理由を書いて足す。印を CSS のコメントとして埋め込む形は採らない。hono/css の最小化はコメントを残すので、理由の文がそのまま全ページの CSS に乗る。例外は使われなくなったら落とす。値を直したのに項目が残っていると、次に同じ値を書いたときの抜け道になる。

チェックそのものの取りこぼしは `scripts/check-style-tokens.test.ts` で見る。

### コントラストの検証

`app/styles/theme.test.ts` が役割の組み合わせごとに [WCAG 2.2](https://www.w3.org/TR/WCAG22/) の比を計算する。ライトとダークの両方で回す。テーマを足すときは `themes` に 1 行足すだけで、同じ組み合わせがそのテーマでも検証される。

片方のテーマでしか比を持たない役割は、この表から外して個別のテストへ書く。`brandSurfaceBorder` はライトでは透明で、比較する相手がない。16 進数でない値を渡すと相対輝度が NaN になり比較が静かに通ってしまうので、`relativeLuminance` は形式を確かめて落とす。

`app/styles/brand.ts` は対象外。他社のブランドカラーは動かせないので、比を満たすかどうかをこちらで決められない。

## コーディング規約

フォーマットと lint は Biome でかける。シングルクォート、セミコロン省略、末尾カンマあり、arrow 関数の括弧省略。コミット前に `pnpm lint:fix` を実行する。

記事の日本語は `.textlintrc.json` の `preset-ja-technical-writing` と `preset-ja-spacing` に準拠させる。和文と欧文の間には半角スペースを入れる。対象は記事だけでなく、`docs/` や `CLAUDE.md` を含むすべての Markdown と、ソースコードの日本語コメント。`pnpm lint:text` で回す。CI は変更されたファイルだけを見る。

コードコメントは `textlint/plugins/comment-ja/` の自作プラグインで拾う。設定とルールは記事と共通で、書き方の基準を分けない。対象は `.ts` `.tsx` `.mjs` `.cjs` `.js` `.jsx` (TypeScript のパーサでコメントを抜く) と、`.yaml` `.yml` `.sh` (行頭の `#` の行だけを見る)。日本語を含まない段落、`biome-ignore` や `@ts-` で始まる行は対象から外す。`// textlint-disable` は Markdown と同じように適用される。

`textlint/` 配下は `.textlintignore` で除いてある。辞書は検出したい語そのものをコメントに書いた台帳なので、textlint にかけると警告だらけになる。

コメントの段落は、空のコメント行とコメント以外の行で切れる。連続する行は 1 つの段落としてつなげて見るので、文が行をまたいでいても助詞の重複を拾える。コードの後ろに付く行末コメントだけは、行ごとに独立した段落として扱う。

それでもコメントは一文の途中で改行しない。1 行に複数の文が入ってもよい。次の例のように、幅を詰めるために文を切ると、読むときに前の行へ戻る必要が出る。

```ts
// 悪い例: 「上書きしない」で切れていて、文が次の行に続く
// {platform} を入れて、macOS で撮った画像が Linux の基準画像を上書きしない
// ようにする。リポジトリにコミットするのは -linux のものだけ。

// 良い例: 文の切れ目でだけ改行する
// {platform} を入れて、macOS で撮った画像が Linux の基準画像を上書きしないようにする。リポジトリにコミットするのは -linux のものだけ。
```

AI っぽい日本語は `@textlint-ja/morpheme-match` で検出する。辞書は `textlint/` に 4 つ置き、直訳調の動詞、硬い名詞、定型の言い回し、文体に合わない比喩と口語に分けている。severity は `warning` で、CI は落とさない。

<!-- 辞書の説明として、検出対象の語そのものを例に引く段落 -->
<!-- textlint-disable @textlint-ja/morpheme-match -->

辞書は kuromoji の Token 列で書く。品詞と `basic_form` で照合するため、「効く」を 1 件書けば「効きます」「効かない」に当たり、名詞の「有効」「効率」には当たらない。語を足すときは次の 5 点に気をつける。

<!-- textlint-enable @textlint-ja/morpheme-match -->

- 分かち書きを先に確かめる。「無差別」は `無[接頭詞] + 差別[名詞]` に割れるので 2 トークンで書く。
- 既存 77 記事での出現数を数えてから入れる。自分がすでに使っている語を入れると警告だらけになる。
- マッチャは途中で外れたときに現在のトークンを先頭から試し直さない。複数トークンに割れる語をパターンの先頭に置くと当たらないことがある。
- 分かち書きは前後の語で変わる。「当たり外れ」は単体では `当たり[名詞] + 外れ[名詞]` だが、「たびに当たり外れが」では `に当たり[助詞]` に融合する。この種の語は辞書に向かない。
- 汎用的な名詞は入れない。「絵」をスクリーンショットの意味で禁止しようとすると、「お絵かき」「絵馬」のような本来の意味での使用に当たる。

読点の打ち方だけは辞書ではなく `textlint/rules/short-topic-comma/` の自作ルールで見ている。主題を 5 文字以内で示しただけで読点を打つ形 (「議事録は」の直後など) を指摘する。辞書はトークンの並びしか書けず「文頭から何文字目か」を条件にできないため、辞書に書くと長い条件節の読点まで当たってしまう。ローカルパッケージとして `file:` で参照しているので、`pnpm install` すれば追加のフラグなしで読み込まれる。

`file:` の依存は pnpm が `node_modules` へコピーする。`textlint/rules/` と `textlint/plugins/` を直したら `pnpm install` を回すまで textlint 側に反映されない。直したのに挙動が変わらないときはこれを疑う。

`textlint/ai-japanese.test.ts` に、語ごとの「検出したい例」と「検出してはいけない例」がある。辞書とルールのどちらを触ったときもここに足す。コメントの拾い方は `textlint/comment-ja.test.ts` で見ている。プラグインを触ったときはこちらに足す。

セッション中にユーザーから文章の語や言い回しを指摘されたら、その場で書き直して終わりにせず、辞書に足すところまで進める。辞書がこの指摘を覚えておくための唯一の場所で、入れなければ次のセッションで同じ指摘が出る。手順は上の 5 点と同じ。ただし既存 77 記事での出現数を数えて、ユーザー自身がすでによく使っている語だと分かったら、辞書に入れず数字を示してそう伝える。
