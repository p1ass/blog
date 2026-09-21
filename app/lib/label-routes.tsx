import type { Env } from 'hono'
import { ssgParams } from 'hono/ssg'
import { createRoute } from 'honox/factory'
import { LabelPostsPage, labelPageTitle } from '../components/LabelPostsPage'
import type { Head } from '../global'
import {
  getLabelPage,
  getLabels,
  getMaxPageNumber,
  type LabelKind,
  labelKindName,
} from './posts'

export function labelParams(kind: LabelKind) {
  return ssgParams<Env>(_c => getLabels(kind).map(label => ({ id: label.id })))
}

export function labelPageParams(kind: LabelKind) {
  return ssgParams<Env>(_c =>
    getLabels(kind).flatMap(label => {
      const maxPageNumber = getMaxPageNumber(label.posts)
      const params: { id: string; num: string }[] = []
      for (let num = 2; num <= maxPageNumber; num++) {
        params.push({ id: label.id, num: num.toString() })
      }
      return params
    }),
  )
}

function renderLabelPage(kind: LabelKind, pageNumber: number | null) {
  return (c: Parameters<Parameters<typeof createRoute>[0]>[0]) => {
    const num = pageNumber ?? Number.parseInt(c.req.param('num') ?? '', 10)
    if (Number.isNaN(num)) {
      return c.notFound()
    }

    const labelPage = getLabelPage(kind, c.req.param('id') ?? '', num)
    if (!labelPage) {
      return c.notFound()
    }

    const title = labelPageTitle(labelPage)
    const head: Head = {
      title: num > 1 ? `${title} (${num} ページ目)` : title,
      description:
        num > 1
          ? `「${labelPage.name}」の${labelKindName[kind]}が付いた記事の一覧の ${num} ページ目です`
          : `「${labelPage.name}」の${labelKindName[kind]}が付いた記事の一覧です`,
    }
    return c.render(<LabelPostsPage labelPage={labelPage} />, head)
  }
}

export function labelRoute(kind: LabelKind) {
  return createRoute(labelParams(kind), renderLabelPage(kind, 1))
}

export function labelPageRoute(kind: LabelKind) {
  return createRoute(labelPageParams(kind), renderLabelPage(kind, null))
}
