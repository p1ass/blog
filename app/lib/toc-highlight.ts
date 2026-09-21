import { onReady } from './on-ready'

const activationLinePx = 64

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
      let active: string | null = null
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > activationLinePx) {
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

function rewindTocs(): void {
  for (const toc of document.querySelectorAll<HTMLElement>('[data-toc]')) {
    toc.scrollTop = 0
  }
}
