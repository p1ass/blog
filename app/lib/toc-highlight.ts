// 目次の、今いる節のハイライト。ブラウザでだけ動く。
//
// 島にはしない。ヘッダーのテーマの選択が島になっていて、同じページでその後に描かれる島は
// honox-island に包まれず、水和もされない。ツイートの埋め込みと同じ理由で client.ts から呼ぶ。
//
// CSS だけで書ける scroll-target-group と :target-current は、まだ Chrome と Edge にしかない。
// 使うと結局もう 1 本の道が要るので、1 つにまとめて自分で決める。
//
// 今いる節とするのは、画面の上端から少し下に引いた線より上にある最後の見出し。
// 上端そのもので切り替えると、次の節の本文がまだ 1 行も見えないうちに目次だけ先へ進む。
//
// 線の位置は画面の高さの割合ではなく、固定の距離にする。割合にすると、画面の高さが変わったときに
// スクロールしていないのに今いる節が動く。見た目の回帰テストはページ全体を撮るために画面を
// ページの高さまで広げるので、そのとき目次の中の位置が撮影ごとに変わって差分になった。
//
// IntersectionObserver で見出しがその線を跨ぐのを待つ形は採らなかった。一息に飛ぶと
// 跨いだことにならず、通知が来ない。目次のリンクを押したときがまさにその動きで、
// 目次で移動したのに目次のハイライトだけ元の位置に残る。
// スクロールを見て、描画の 1 コマにつき 1 回だけ位置を測る。

import { onReady } from './on-ready'

// 画面の上端から、切り替えの線までの距離。本文 2 行ぶんほど。
const activationOffset = 64

export function setupTocHighlight(): void {
  onReady(() => {
    const links = new Map<string, HTMLAnchorElement[]>()
    for (const link of document.querySelectorAll<HTMLAnchorElement>(
      '[data-toc] a[href^="#"]',
    )) {
      const id = decodeURIComponent(link.hash.slice(1))
      const found = links.get(id)
      if (found) {
        found.push(link)
      } else {
        links.set(id, [link])
      }
    }

    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('article :is(h2, h3)'),
    ).filter(heading => links.has(heading.id))
    if (headings.length === 0) {
      return
    }

    let current: string | null = null
    const update = () => {
      // 見出しは本文の順に並んでいるので、線より上にある最後のものが今いる節になる
      let active: string | null = null
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > activationOffset) {
          break
        }
        active = heading.id
      }
      if (active === current) {
        return
      }

      for (const link of links.get(current ?? '') ?? []) {
        link.removeAttribute('aria-current')
      }
      for (const link of links.get(active ?? '') ?? []) {
        link.setAttribute('aria-current', 'true')
        revealInToc(link)
      }
      if (active === null) {
        rewindTocs()
      }
      current = active
    }

    let scheduled = false
    const schedule = () => {
      if (scheduled) {
        return
      }
      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false
        update()
      })
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  })
}

// 目次そのものがスクロールしているときに、今いる節を目次の中へ入れる。
// scrollIntoView は先祖のスクロールも動かすので、ページごと飛ばないよう自分で寄せる。
function revealInToc(link: HTMLAnchorElement): void {
  const toc = link.closest<HTMLElement>('[data-toc]')
  if (!toc || toc.scrollHeight <= toc.clientHeight) {
    return
  }

  const area = toc.getBoundingClientRect()
  const item = link.getBoundingClientRect()
  if (item.top < area.top) {
    toc.scrollTop += item.top - area.top
  } else if (item.bottom > area.bottom) {
    toc.scrollTop += item.bottom - area.bottom
  }
}

// 最初の見出しより上へ戻ったら、目次も先頭へ戻す。
// 寄せたぶんが残ると、記事の冒頭を読んでいるのに目次だけ途中を映したままになる。
function rewindTocs(): void {
  for (const toc of document.querySelectorAll<HTMLElement>('[data-toc]')) {
    toc.scrollTop = 0
  }
}
