import { Fragment } from 'hono/jsx/jsx-runtime'
import { type LabelPage, labelBasePath, labelHeadingPrefix } from '../lib/posts'
import { Heading } from './Heading'
import { Pagination } from './Pagination'
import { PostSummarySection } from './PostSummarySection'

type Props = {
  labelPage: LabelPage
}

export function labelPageTitle(labelPage: LabelPage): string {
  return `${labelHeadingPrefix[labelPage.kind]} ${labelPage.name}`
}

export function LabelPostsPage({ labelPage }: Props) {
  return (
    <Fragment>
      <Heading>{labelPageTitle(labelPage)}</Heading>
      <div>
        {labelPage.posts.map(post => (
          <PostSummarySection post={post} />
        ))}
      </div>
      <Pagination
        pageNumber={labelPage.pageNumber}
        hasPrev={labelPage.hasPrev}
        hasNext={labelPage.hasNext}
        basePath={`${labelBasePath[labelPage.kind]}/${labelPage.id}`}
      />
    </Fragment>
  )
}
