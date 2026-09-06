import { describe, expect, it } from 'vitest'
import { formatDate, parseDate } from './time'

// vitest.config.ts で TZ=UTC を指定しているため、これらは JST 以外のマシンで
// 動かした場合の挙動を検証している
describe('parseDate', () => {
  it('オフセット付きの文字列を、その瞬間として読む', () => {
    expect(parseDate('2024-04-30T12:00:00+09:00').toISOString()).toBe(
      '2024-04-30T03:00:00.000Z',
    )
  })

  it('同じ瞬間を指す別表記が等しくなる', () => {
    expect(parseDate('2024-04-30T12:00:00+09:00').getTime()).toBe(
      parseDate('2024-04-30T03:00:00Z').getTime(),
    )
  })
})

describe('formatDate', () => {
  it('JST の深夜を、その日の日付として表示する', () => {
    // tz を指定しないと UTC マシンでは前日の 2021/11/30 になる
    expect(
      formatDate(parseDate('2021-12-01T00:00:00+09:00'), 'YYYY/MM/DD'),
    ).toBe('2021/12/01')
  })

  it('JST の深夜を、その日の日付として扱う (月をまたぐ場合)', () => {
    expect(
      formatDate(parseDate('2024-05-01T08:00:00+09:00'), 'YYYY/MM/DD'),
    ).toBe('2024/05/01')
  })

  it('24 時間表記で時刻を出す', () => {
    // 12 時間表記の hh を使っていたため、RSS の pubDate が誤った値になっていた
    expect(
      formatDate(parseDate('2018-12-03T22:45:21+09:00'), 'HH:mm:ss', 'en'),
    ).toBe('22:45:21')
  })
})
