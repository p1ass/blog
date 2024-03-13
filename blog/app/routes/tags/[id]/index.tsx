import { Fragment } from 'hono/jsx/jsx-runtime'
import { createRoute } from 'honox/factory'
import { Pagination } from '../../../components/Pagination'
import { PostSummarySection } from '../../../components/PostSummarySection'
import { Head } from '../../../global'
import { getCategoryPosts, getTagPosts } from '../../../lib/posts'

export default createRoute(c => {
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
          return (
            <PostSummarySection
              frontmatter={post.frontmatter}
              summary='TODO'
              permalink={`${post.id.replace(/\/index\.mdx$/, '')}`}
            />
          )
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
