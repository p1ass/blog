#!/usr/bin/env bash
# 使い方: bash .claude/skills/tech-review/scripts/verify_go_samples.sh app/routes/posts/<slug>/index.mdx
# 断片は前後の文脈に依存するので、package 宣言を持つ標準ライブラリだけのブロックに限って検証する。

set -uo pipefail

ARTICLE="${1:-}"
if [[ -z "$ARTICLE" || ! -f "$ARTICLE" ]]; then
  echo "usage: $0 <article.mdx>" >&2
  exit 2
fi

if ! command -v go >/dev/null 2>&1; then
  echo "go が見つかりません。静的レビューに切り替えてください。" >&2
  exit 3
fi

WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

python3 - "$ARTICLE" "$WORKDIR" <<'PYEOF'
import re, sys, os, pathlib

article, workdir = sys.argv[1], sys.argv[2]
text = pathlib.Path(article).read_text(encoding="utf-8")

blocks = re.findall(r"^(`{3,})go[^\n]*\n(.*?)^\1\s*$", text, re.M | re.S)

n = 0
for _fence, body in blocks:
    if not re.search(r"^\s*package\s+\w+", body, re.M):
        continue
    n += 1
    d = os.path.join(workdir, f"sample{n}")
    os.makedirs(d, exist_ok=True)
    pathlib.Path(d, "main.go").write_text(body, encoding="utf-8")

PYEOF

COUNT=$(find "$WORKDIR" -maxdepth 1 -type d -name 'sample*' | wc -l | tr -d ' ')

if [[ "$COUNT" -eq 0 ]]; then
  echo "検証対象の Go コードブロックはありません (package 宣言を持つブロックが見つかりませんでした)。"
  exit 0
fi

echo "検証対象: ${COUNT} 件"
echo "Go バージョン: $(go version)"
echo

FAILED=0
for d in "$WORKDIR"/sample*; do
  name="$(basename "$d")"
  echo "--- $name ---"
  ( cd "$d" && go mod init "$name" >/dev/null 2>&1 )

  if out=$( cd "$d" && go vet ./... 2>&1 ); then
    echo "go vet: OK"
  else
    echo "go vet: NG"
    echo "$out" | sed 's/^/  /'
    FAILED=1
  fi

  if out=$( cd "$d" && go build ./... 2>&1 ); then
    echo "go build: OK"
  else
    echo "go build: NG"
    echo "$out" | sed 's/^/  /'
    FAILED=1
  fi
  echo
done

if [[ "$FAILED" -eq 1 ]]; then
  echo "失敗したブロックがあります。記事が意図的にコードを省略している可能性もあるため、内容を確認してから指摘してください。"
fi

exit 0
