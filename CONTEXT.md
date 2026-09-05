# ぷらすのブログ

blog.p1ass.com のドメインモデル。MDX で書いた記事を静的サイトとして配信するにあたり、記事とその分類を表す語彙を定める。

実装の詳細は書かない。「どう作るか」は [CLAUDE.md](./CLAUDE.md)、判断の経緯は [docs/adr/](./docs/adr/) にある。

## Language

### 記事

**Post**:
1 本の記事。Slug で一意に定まり、Frontmatter と本文を持つ。
_Avoid_: Article, Entry, Blog

**Slug**:
記事の同定キー。記事が置かれたディレクトリの名前がそのまま Slug になる (例: `migrate-to-hono`)。URL とファイルパスは Slug から導出する。記事を識別するときは常に Slug を使い、タイトルでは同定しない。
_Avoid_: ID, Path, Permalink

**Frontmatter**:
記事の先頭に置く、記事そのものについての情報。タイトル、公開日、説明、Category、Tag からなる。
_Avoid_: Meta, Metadata, Header

**ContentSummary**:
一覧ページに載せる、記事の冒頭部分。本文中の `{/* <!--more--> */}` マーカーより前がこれにあたる。記事本体と同じ見た目で描画する。
_Avoid_: Excerpt, Summary, Description, 概要

**Description**:
Frontmatter に書く、記事を 1 文で説明する文章。`<meta name="description">` と RSS に使う。ContentSummary とは別物で、こちらは装飾のない素のテキスト。

### 分類

**Label**:
記事に貼るしるし。Category と Tag の上位概念で、種類を LabelKind で区別する。「その Label が付いた記事の一覧」を持つのは Label の側の性質であり、Category と Tag で違いはない。
_Avoid_: Taxonomy, Term, Classification, 分類

**LabelKind**:
Label の種類。`category` と `tag` の 2 つ。
_Avoid_: Type, Kind

**Category**:
記事の主題を 1 つだけ表す Label。記事は必ずちょうど 1 つの Category を持つ。
_Avoid_: Genre, Section, ジャンル

**Tag**:
記事に登場する話題を表す Label。記事は 0 個以上の Tag を持つ。
_Avoid_: Keyword, Topic, キーワード

**LabelId**:
Label の同定キー。URL に現れる。同じ LabelId を持つ Label が 2 つ以上あってはならない。
_Avoid_: Slug (Slug は Post のもの)

**LabelPage**:
ある Label が付いた記事のうち、1 ページ分だけを取り出したもの。全件を持つ Label とは別物として扱う。

### ページ

**Permalink**:
記事の恒久的な URL。Slug から導出する (例: `/posts/migrate-to-hono/`)。
_Avoid_: URL, Link, Href

**Excerpt Marker**:
本文中に置く `{/* <!--more--> */}`。ContentSummary の終わりを示す。
_Avoid_: More tag, 区切り

### 外部リンク

**OGP**:
記事から参照した外部ページについて、そのページ自身が名乗っているタイトル・説明・画像。リンクカードの描画に使う。
_Avoid_: Metadata, Preview, Card data

**OGP Cache**:
取得済みの OGP をリポジトリに保存したもの。リンク先サイトの死活からビルドを切り離す目的で持つ。
_Avoid_: Snapshot, Store

**OG Image**:
記事が SNS で共有されたときに表示される画像。Frontmatter で指定がなければ、記事タイトルから生成する。
_Avoid_: OGP 画像, Thumbnail, Card image

### 見た目

**Theme**:
配色の切り替え状態。`system` / `light` / `dark` の 3 つ。`system` は閲覧者の OS 設定に従う。
_Avoid_: Mode, Color scheme, ダークモード (機能名としては使うが、状態の名前ではない)

**Color Token**:
色を役割で呼ぶための名前 (例: `text`、`surface`、`border`)。見た目そのもの (`gray`、`white`) では呼ばない。Theme が変わっても役割は変わらないため、名前も変わらない。
_Avoid_: Palette, Color variable

**TOC**:
記事本文の見出しから作る目次。
_Avoid_: Table of contents, Index, Outline, 目次 (UI 上の表記としては使う)
