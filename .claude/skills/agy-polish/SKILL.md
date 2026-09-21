---
name: agy-polish
description: >-
  Antigravity CLI (agy) の Gemini 3.8 Flash を使って、日本語の文章を自然な表現に推敲し、ファイルを上書きするスキル。
  ユーザーが以下のようなリクエストをした場合に使用すること:
  「推敲して」「日本語を自然にして」「文章を磨いて」「agy で推敲して」。
  blog-writing や article-review から推敲を行う際にも呼び出す。
argument-hint: "[記事スラッグ または ファイルパス]"
---

# Agy Polish

`agy` (Antigravity CLI) に日本語の推敲を任せ、結果を確認してから確定させる。モデルは文章力の高い `gemini-3.8-flash-high` に固定する。

## Step 1: 対象の特定

- スラッグが渡された場合: `app/routes/posts/<スラッグ>/index.mdx`
- ファイルパスが渡された場合: 指定されたファイル
- 何も渡されなかった場合: `git status` から変更中の `.md` / `.mdx` を探す。複数見つかった場合はユーザーに確認する

パスは絶対パスに解決する。

## Step 2: バックアップ

未コミットの下書きでも差分を取れるよう、推敲前のファイルをスクラッチパッドに複製しておく。

```bash
cp -f "<絶対パス>" "<スクラッチパッド>/before-<ファイル名>"
```

## Step 3: agy による推敲

次のコマンドをリポジトリのルートで実行する。推敲には数分かかるため、Bash のタイムアウトは 600000 ms にする。

```bash
agy -p "<リポジトリのルート>/CLAUDE.md を読み、そのルールに従って <絶対パス> のファイルを日本語として自然に推敲してください。その後上書き保存し、pnpm exec textlint <絶対パス> の指摘がなくなるまで修正してください" \
  --model gemini-3.8-flash-high \
  --mode accept-edits \
  --add-dir "<リポジトリのルート>" \
  --add-dir "<対象ファイルのディレクトリ>" \
  --print-timeout 9m
```

`--mode accept-edits` と `--add-dir` は必ず指定する。`--add-dir` は CLAUDE.md と対象ファイルの両方を読めるように指定する。省略すると headless モードでファイルの読み書き権限が自動で拒否され、ファイルが変更されないまま正常終了する。実行後にファイルが変わっていない場合は、出力に permission のエラーが含まれていないか確認する。

agy 内で textlint を実行するには、`~/.gemini/antigravity-cli/settings.json` に次の許可ルールが必要となる。`command` の権限エラーで止まった場合は、ユーザーに追加を依頼する。

```json
{ "permissions": { "allow": ["command(pnpm exec textlint)"] } }
```

## Step 4: 差分の検証

```bash
git diff --no-index --word-diff "<スクラッチパッド>/before-<ファイル名>" "<絶対パス>"
pnpm exec textlint "<絶対パス>"
```

差分を 1 箇所ずつ確認し、次に該当する変更は元に戻す。

- CLAUDE.md のルールに違反している変更
- 事実や技術的な意味が変わっている変更
- frontmatter、コード、URL、MDX のコンポーネントやコメントに及んでいる変更
- `.claude/skills/blog-writing/references/style.md` の文体プロファイルから外れる変更（記事の場合）

textlint の指摘が残っている場合は修正する。

## Step 5: 報告

主な変更点と、差し戻した変更とその理由を簡潔に報告する。
