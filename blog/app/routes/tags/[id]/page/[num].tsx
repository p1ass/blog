import { Fragment } from 'hono/jsx/jsx-runtime'
import { createRoute } from 'honox/factory'
import { Pagination } from '../../../../components/Pagination'
import { PostSummarySection } from '../../../../components/PostSummarySection'
import { Head } from '../../../../global'
import { getTagPosts } from '../../../../lib/posts'

export default createRoute(c => {
  const tagId = c.req.param('id')
  const numStr = c.req.param('num')
  const num = parseInt(numStr)
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
      <h1>{`Tag ${tagPosts.name}`}</h1>
      <div>
        {tagPosts.posts.map(post => {
          return <PostSummarySection post={post} />
        })}
      </div>
      <Pagination
        pageNumber={num}
        hasPrev={tagPosts.hasPrev}
        hasNext={tagPosts.hasNext}
        basePath={`/tags/${tagId}/`}
      />
    </Fragment>,
    head,
  )
})
