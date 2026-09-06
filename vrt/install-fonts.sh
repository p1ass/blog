#!/usr/bin/env bash
# コンテナに VRT 用のフォントを入れる。docker-run.sh と CI の両方から呼ぶ。
set -euo pipefail

FONT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/fonts"

install -d /usr/share/fonts/truetype/gen-interface-jp
cp "${FONT_DIR}"/*.ttf /usr/share/fonts/truetype/gen-interface-jp/

install -d /etc/fonts/conf.d
cp "${FONT_DIR}/local.conf" /etc/fonts/local.conf

fc-cache -f > /dev/null

# 意図した書体に解決できたかをその場で確かめる。ここが崩れると
# 基準画像が丸ごと変わるので、黙って進めない。
resolved="$(fc-match -f '%{family}' 'sans-serif:lang=ja')"
if [ "${resolved}" != "Gen Interface JP" ]; then
  echo "sans-serif が Gen Interface JP に解決されない: ${resolved}" >&2
  exit 1
fi
echo "フォント: sans-serif -> ${resolved}"
