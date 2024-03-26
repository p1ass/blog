import { Fragment } from 'hono/jsx/jsx-runtime'
import { createRoute } from 'honox/factory'
import { Pagination } from '../../../components/Pagination'
import { PostSummarySection } from '../../../components/PostSummarySection'
import type { Head } from '../../../global'
import { getTagPosts, getTags } from '../../../lib/posts'
import { ssgParams } from 'hono/ssg'
import type { Env } from 'hono'

const param = ssgParams<Env>(c => {
  return getTags().map(tag => {
    return { id: tag.id }
  })
})

export default createRoute(param, c => {
  const tagId = c.req.param('id')

  const tagPosts = getTagPosts(tagId, 1)

  if (!tagPosts) {
    return c.notFound()
  }

  const head: Head = {
    title: `Tag ${tagPosts.name}`,
  }

  return c.render(
    <Fragment>
      <h1>{`Tag ${tagPosts.name}`}</h1>
      <div>
        {tagPosts.posts.map(post => {
          return <PostSummarySection post={post} />
        })}
      </div>
      <Pagination
        pageNumber={1}
        hasPrev={tagPosts.hasPrev}
        hasNext={tagPosts.hasNext}
        basePath={`/tags/${tagId}`}
      />
    </Fragment>,
    head,
  )
})
