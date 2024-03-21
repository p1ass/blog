import { Fragment } from 'hono/jsx/jsx-runtime'
import { createRoute } from 'honox/factory'
import { Pagination } from '../../components/Pagination'
import { PostSummarySection } from '../../components/PostSummarySection'
import { getPosts } from '../../lib/posts'

export default createRoute(c => {
  const numStr = c.req.param('num')
  const num = parseInt(numStr)
  if (Number.isNaN(num)) {
    return c.notFound()
  }

  const { posts, hasPrev, hasNext } = getPosts(num)

  return c.render(
    <Fragment>
      <div>
        {posts.map(post => {
          return <PostSummarySection post={post} />
        })}
      </div>
      <Pagination pageNumber={num} hasPrev={hasPrev} hasNext={hasNext} />
    </Fragment>,
  )
})
