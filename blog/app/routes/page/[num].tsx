import { Fragment } from 'hono/jsx/jsx-runtime'
import { createRoute } from 'honox/factory'
import { Pagination } from '../../components/Pagination'
import { PostSummarySection } from '../../components/PostSummarySection'
import { getPosts } from '../../lib/posts'

export default createRoute(c => {
  const numStr = c.req.param('num')
  const num = parseInt(numStr)

  const { posts, hasPrev, hasNext } = getPosts(num)

  return c.render(
    <Fragment>
      <div>
        {posts.map(posts => {
          return (
            <PostSummarySection
              frontmatter={posts.frontmatter}
              summary='TODO'
              permalink={`${posts.id.replace(/\/index\.mdx$/, '')}`}
            />
          )
        })}
      </div>
      <Pagination pageNumber={num} hasPrev={hasPrev} hasNext={hasNext} />
    </Fragment>,
  )
})
