import { Fragment } from 'hono/jsx/jsx-runtime'
import { createRoute } from 'honox/factory'
import { Pagination } from '../../../components/Pagination'
import { PostSummarySection } from '../../../components/PostSummarySection'
import { Head } from '../../../global'
import { getCategoryPosts } from '../../../lib/posts'

export default createRoute(c => {
  const categoryId = c.req.param('id')

  const category = getCategoryPosts(categoryId, 1)

  if (!category) {
    return c.notFound()
  }

  const head: Head = {
    title: `Category ${category.name}`,
  }

  return c.render(
    <Fragment>
      <h1>{`Category ${category.name}`}</h1>
      <div>
        {category.posts.map(post => {
          return (
            <PostSummarySection
              frontmatter={post.frontmatter}
              ContentSummary={post.ContentSummary}
              permalink={`${post.id.replace(/\/index\.mdx$/, '')}/`}
            />
          )
        })}
      </div>
      <Pagination
        pageNumber={1}
        hasPrev={category.hasPrev}
        hasNext={category.hasNext}
        basePath={`/categories/${categoryId}`}
      />
    </Fragment>,
    head,
  )
})
