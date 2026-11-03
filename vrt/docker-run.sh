#!/usr/bin/env bash
set -euo pipefail

IMAGE="mcr.microsoft.com/playwright:v1.64.1-noble"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

docker run --rm --platform linux/arm64 \
  -v "${REPO_ROOT}:/work" \
  -v blog-vrt-node-modules-arm64:/work/node_modules \
  -v blog-vrt-pnpm-store-arm64:/pnpm-store \
  -w /work \
  -e CI=1 \
  -e PNPM_HOME=/pnpm \
  -e PATH=/pnpm:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
  "${IMAGE}" \
  bash -c "
    set -euo pipefail
    npm install -g pnpm@10.8.0
    pnpm config set store-dir /pnpm-store
    pnpm install --frozen-lockfile
    ./vrt/install-fonts.sh
    pnpm build
    pnpm exec playwright test $*
  "
