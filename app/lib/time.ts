import { format } from '@formkit/tempo'

const timeZone = 'Asia/Tokyo'

// frontmatter の日付はオフセット付きの ISO 8601 に統一しているため、
// Date のコンストラクタだけで一意な瞬間に定まる。
export const parseDate = (str: string) => new Date(str)

// tz を渡さないと、ビルドマシンの TZ で整形される。JST の深夜に投稿した記事が
// UTC のビルドマシンでは前日として表示されてしまうので、必ず明示する。
export const formatDate = (date: Date, pattern: string, locale = 'ja') =>
  format({ date, format: pattern, locale, tz: timeZone })
