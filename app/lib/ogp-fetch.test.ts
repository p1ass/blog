import { describe, expect, it } from 'vitest'
import { decodeHtml, parseOgp } from './ogp-fetch'

const base = 'https://example.com/posts/1'

describe('parseOgp', () => {
  it('og: の 3 つを読む', () => {
    const html = `<html><head>
      <meta property="og:title" content="記事のタイトル">
      <meta property="og:description" content="記事の説明">
      <meta property="og:image" content="https://example.com/ogp.png">
    </head></html>`
    expect(parseOgp(html, base)).toEqual({
      title: '記事のタイトル',
      description: '記事の説明',
      image: 'https://example.com/ogp.png',
    })
  })

  it('og:title が無いときは title タグまで下りる', () => {
    const html = '<html><head><title>ページの題</title></head></html>'
    expect(parseOgp(html, base).title).toBe('ページの題')
  })

  it('title すら無いときは URL を出す', () => {
    expect(parseOgp('<html></html>', base).title).toBe(base)
  })

  it('name 属性で書かれた meta も読む', () => {
    const html = `<meta name="description" content="name で書いた説明">
      <meta name="twitter:image" content="https://example.com/twitter.png">`
    const ogp = parseOgp(html, base)
    expect(ogp.description).toBe('name で書いた説明')
    expect(ogp.image).toBe('https://example.com/twitter.png')
  })

  it('og: を twitter: より優先する', () => {
    const html = `<meta name="twitter:title" content="twitter の題">
      <meta property="og:title" content="og の題">`
    expect(parseOgp(html, base).title).toBe('og の題')
  })

  it('同じ property が複数あるときは先に出たものを採る', () => {
    const html = `<meta property="og:image" content="https://example.com/1.png">
      <meta property="og:image" content="https://example.com/2.png">`
    expect(parseOgp(html, base).image).toBe('https://example.com/1.png')
  })

  it('相対パスの画像をページの URL で解決する', () => {
    const html = '<meta property="og:image" content="../ogp.png">'
    expect(parseOgp(html, base).image).toBe('https://example.com/ogp.png')
  })

  it('http でも https でもない画像は捨てる', () => {
    // data: の画像を og:image に書いているページがある。カードに出すと HTML が肥大する
    const html = '<meta property="og:image" content="data:image/png;base64,AA">'
    expect(parseOgp(html, base).image).toBeNull()
  })

  it('実体参照を戻す', () => {
    const html =
      '<meta property="og:title" content="A &amp; B &lt;C&gt; &#39;D&#39; &#x2764;">'
    expect(parseOgp(html, base).title).toBe("A & B <C> 'D' ❤")
  })

  it('改行と連続する空白を 1 つにまとめる', () => {
    const html = `<meta property="og:description" content="1 行目
      2 行目">`
    expect(parseOgp(html, base).description).toBe('1 行目 2 行目')
  })

  it('属性値の中の > で meta タグを切らない', () => {
    // GitHub の PR の説明のように、本文に不等号が入っていることがある
    const html = `<meta property="og:description" content="a -> b">
      <meta property="og:title" content="不等号のあとの題">`
    const ogp = parseOgp(html, base)
    expect(ogp.description).toBe('a -> b')
    expect(ogp.title).toBe('不等号のあとの題')
  })

  it('一重引用符と引用符なしの属性を読む', () => {
    const html = `<meta property='og:title' content='一重引用符の題'>
      <meta property=og:description content=引用符なし>`
    const ogp = parseOgp(html, base)
    expect(ogp.title).toBe('一重引用符の題')
    expect(ogp.description).toBe('引用符なし')
  })

  it('中身が空の meta は無いものとして扱う', () => {
    const html = `<meta property="og:title" content="">
      <title>title タグの題</title>`
    expect(parseOgp(html, base).title).toBe('title タグの題')
  })
})

describe('decodeHtml', () => {
  // Shift_JIS の「日本語」。TextDecoder に渡す名前が反映されているかを見る
  const shiftJisBytes = new Uint8Array([0x93, 0xfa, 0x96, 0x7b, 0x8c, 0xea])
    .buffer

  it('Content-Type ヘッダの文字コードで読む', () => {
    expect(decodeHtml(shiftJisBytes, 'text/html; charset=Shift_JIS')).toBe(
      '日本語',
    )
  })

  it('ヘッダに文字コードが無いときは meta から読む', () => {
    const html = new TextEncoder().encode(
      '<html><head><meta http-equiv="Content-Type" content="text/html; charset=euc-jp">',
    )
    const body = new Uint8Array([
      ...html,
      // EUC-JP の「日本語」
      0xc6,
      0xfc,
      0xcb,
      0xdc,
      0xb8,
      0xec,
    ]).buffer
    expect(decodeHtml(body, 'text/html')).toContain('日本語')
  })

  it('知らない文字コードを名乗るページは UTF-8 として読む', () => {
    const body = new TextEncoder().encode('日本語').buffer
    expect(decodeHtml(body, 'text/html; charset=unknown-8bit')).toBe('日本語')
  })
})
