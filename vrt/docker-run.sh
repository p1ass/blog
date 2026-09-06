#!/usr/bin/env bash
# 基準画像を CI と同じ環境で撮るためのラッパー。
#
# ホストが macOS だと Hiragino で描かれるため、Linux の CI と一致しない。
# CI も同じイメージの中で動かしているので、ここを通す限り差分は「見た目を変えたかどうか」だけになる。
#
# ビルドから撮影までをこの中で完結させる。
#
#   ./vrt/docker-run.sh                      比較する
#   ./vrt/docker-run.sh --update-snapshots   基準画像を撮り直す
set -euo pipefail

IMAGE="mcr.microsoft.com/playwright:v1.58.1-noble"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# node_modules はプラットフォーム依存のバイナリを含むので、ホストのものをそのまま持ち込まず、コンテナ用のボリュームに分ける。
# CI は linux/amd64 で動く。Apple Silicon でそのまま動かすと arm64 になり、基準画像と一致しないことがある。
# エミュレーションで遅くなるが揃える。
docker run --rm --platform linux/amd64 \
  -v "${REPO_ROOT}:/work" \
  -v blog-vrt-node-modules:/work/node_modules \
  -v blog-vrt-pnpm-store:/pnpm-store \
  -w /work \
  -e CI=1 \
  -e PNPM_HOME=/pnpm \
  -e PATH=/pnpm:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
  "${IMAGE}" \
  bash -c "
    set -euo pipefail
    # ロックファイルを作った版に合わせる。9 系だと patchedDependencies のハッシュ形式が変わり、実行のたびに pnpm-lock.yaml が書き換わる。
    corepack enable
    corepack prepare pnpm@10.8.0 --activate
    pnpm config set store-dir /pnpm-store
    pnpm install --frozen-lockfile
    ./vrt/install-fonts.sh
    # ビルドもこの中で行う。Mermaid の図はビルド時に Playwright で文字幅を実測して座標を決めるため、ホストでビルドすると図の寸法が CI とずれる。
    pnpm build
    pnpm exec playwright test $*
  "
