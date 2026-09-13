import { format } from '@formkit/tempo'

const timeZone = 'Asia/Tokyo'

export const parseDate = (str: string) => new Date(str)

// tz を渡さないとビルドマシンの TZ で整形され、JST の深夜に投稿した記事が前日になる。
export const formatDate = (date: Date, pattern: string, locale = 'ja') =>
  format({ date, format: pattern, locale, tz: timeZone })
