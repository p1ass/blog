import { format } from '@formkit/tempo'

const timeZone = 'Asia/Tokyo'

export const parseDate = (str: string) => new Date(str)

export const formatDate = (date: Date, pattern: string, locale = 'ja') =>
  format({ date, format: pattern, locale, tz: timeZone })
