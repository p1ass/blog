import { parse } from '@formkit/tempo'

export const parseDate = (str: string) => {
  return parse(str, 'YYYY-MM-DDTHH:mm:ss', 'Asia/Tokyo')
}

// frontmatter の日付は JST 前提だが、オフセットを書いていない記事がある。
// parseDate が返す Date はビルドマシンの TZ に依存してしまうため、
// 機械可読な日時が要る箇所では Date を経由せず文字列として組み立てる。
const hasUtcOffset = /(?:Z|[+-]\d{2}:\d{2})$/

export const toIso8601Jst = (str: string) => {
  return hasUtcOffset.test(str) ? str : `${str}+09:00`
}
