#!/usr/bin/env bash
# ホストが macOS だとヒラギノで描画されて CI と一致しないので、CI と同じイメージの中でビルドから撮影までを行う。
set -euo pipefail

IMAGE="mcr.microsoft.com/playwright:v1.58.1-noble"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# node_modules はプラットフォーム依存のバイナリを含むので、コンテナ用のボリュームに分ける。arm64 だと基準画像と一致しないことがあるので、CI と同じ amd64 で動かす。
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
    # 別の版の pnpm で入れると pnpm-lock.yaml が書き換わる。
    corepack enable
    corepack prepare pnpm@10.8.0 --activate
    pnpm config set store-dir /pnpm-store
    pnpm install --frozen-lockfile
    ./vrt/install-fonts.sh
    # Mermaid の図はビルド時に文字幅を測って座標を決めるので、ビルドもこの中で行う。
    pnpm build
    pnpm exec playwright test $*
  "
