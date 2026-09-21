---
name: agy-polish
description: >-
  Antigravity CLI (agy) の Gemini 3.8 Flash を使用し、日本語文章を自然な表現に推敲してファイルを上書き更新するスキル。
  ユーザーから「推敲して」「日本語を自然にして」「文章を磨いて」「agy で推敲して」といった依頼があった場合や、
  blog-writing や article-review の工程から推敲を実行する際に呼び出す。
argument-hint: "[記事スラッグ または ファイルパス]"
---

# Agy Polish

`agy` (Antigravity CLI) を使用して日本語文章を推敲する。モデルは表現力に優れた `gemini-3.8-flash-high` に固定する。

## Step 1: 対象ファイルの特定

- スラッグが指定された場合: `app/routes/posts/<スラッグ>/index.mdx`
- ファイルパスが指定された場合: 指定されたファイル
- 引数が渡されなかった場合: `git status` を実行し、変更中の `.md` / `.mdx` ファイルを特定する（複数存在する場合はユーザーに確認する）

※対象ファイルのパスは必ず絶対パスへ解決すること。

## Step 2: バックアップの作成

未コミットの下書き状態でも差分を正しく確認できるよう、推敲前のファイルをスクラッチパッドへ複製しておく。

```bash
cp -f "<絶対パス>" "<スクラッチパッド>/before-<ファイル名>"
```

## Step 3: agy による推敲の実行

リポジトリルートで以下のコマンドを実行する。推敲処理には数分かかる場合があるため、Bash のタイムアウトは 600000 ms（10分）に設定する。

```bash
agy -p "<リポジトリのルート>/CLAUDE.md を読み、そのルールに従って <絶対パス> のファイルを日本語として自然に推敲してください。その後上書き保存し、pnpm exec textlint <絶対パス> の指摘がなくなるまで修正してください" \
  --model gemini-3.8-flash-high \
  --mode accept-edits \
  --add-dir "<リポジトリのルート>" \
  --add-dir "<対象ファイルのディレクトリ>" \
  --print-timeout 9m
```

※ `--mode accept-edits` および `--add-dir` は必須パラメータである。`--add-dir` には `CLAUDE.md` と対象ファイルの両方が読み込めるようディレクトリを指定する。指定しない場合、headless モードでファイルの読み書き権限が自動的に拒否され、ファイルが更新されないまま正常終了する。実行後にファイルが変更されていない場合は、出力ログに Permission エラーが含まれていないか確認する。

また、agy 内で textlint を実行するには `~/.gemini/antigravity-cli/settings.json` への権限追加が必要となる。`command` の権限エラーで停止した場合は、ユーザーに以下の設定追加を依頼する。

```json
{ "permissions": { "allow": ["command(pnpm exec textlint)"] } }
```

## Step 4: 差分の検証

以下のコマンドを実行して差分と textlint の結果を確認する。

```bash
git diff --no-index --word-diff "<スクラッチパッド>/before-<ファイル名>" "<絶対パス>"
pnpm exec textlint "<絶対パス>"
```

変更箇所を 1 箇所ずつ確認し、以下の条件に該当する変更は元に戻す。

- `CLAUDE.md` のルールに違反している変更
- 事実関係や技術的な意味・ニュアンスが変わっている変更
- frontmatter、コードブロック、URL、MDX コンポーネント、コメントに影響が及んでいる変更
- `.claude/skills/blog-writing/references/style.md` の文体プロファイルから外れる変更（記事の場合）

textlint の指摘が残っている場合は、手動で修正を行う。

## Step 5: 結果の報告

主な変更点の要約と、差し戻した変更（およびその理由）を簡潔にユーザーへ報告する。
