import type { Env } from 'hono'
import { Fragment } from 'hono/jsx/jsx-runtime'
import { ssgParams } from 'hono/ssg'
import { createRoute } from 'honox/factory'
import { Heading } from '../../../../../components/Heading'
import { Pagination } from '../../../../../components/Pagination'
import { PostSummarySection } from '../../../../../components/PostSummarySection'
import type { Head } from '../../../../../global'
import {
  getMaxPageNumber,
  getTagPosts,
  getTags,
} from '../../../../../lib/posts'

const param = ssgParams<Env>(c => {
  const params: { id: string; num: string }[] = []
  getTags().forEach((tag, _) => {
    const maxPageNumber = getMaxPageNumber(tag.posts)
    for (let num = 1; num <= maxPageNumber; num++) {
      // 1ページ目はトップページなので生成する必要がない
      if (num <= 1) {
        continue
      }
      params.push({ id: tag.id, num: num.toString() })
    }
  })
  console.log(params)
  return params
})

export default createRoute(param, c => {
  const tagId = c.req.param('id')
  const numStr = c.req.param('num')
  const num = Number.parseInt(numStr)
  if (Number.isNaN(num)) {
    return c.notFound()
  }

  const tagPosts = getTagPosts(tagId, num)

  if (!tagPosts) {
    return c.notFound()
  }

  const head: Head = {
    title: `Tag ${tagPosts.name}`,
  }

  return c.render(
    <Fragment>
      <Heading>{`Tag ${tagPosts.name}`}</Heading>
      <div>
        {tagPosts.posts.map(post => {
          return <PostSummarySection post={post} />
        })}
      </div>
      <Pagination
        pageNumber={num}
        hasPrev={tagPosts.hasPrev}
        hasNext={tagPosts.hasNext}
        basePath={`/tags/${tagId}`}
      />
    </Fragment>,
    head,
  )
})
