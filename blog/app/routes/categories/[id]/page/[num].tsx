import { Fragment } from 'hono/jsx/jsx-runtime'
import { createRoute } from 'honox/factory'
import { Pagination } from '../../../../components/Pagination'
import { PostSummarySection } from '../../../../components/PostSummarySection'
import { Head } from '../../../../global'
import { getCategoryPosts } from '../../../../lib/posts'

export default createRoute(c => {
  const categoryId = c.req.param('id')
  const numStr = c.req.param('num')
  const num = parseInt(numStr)
  if (Number.isNaN(num)) {
    return c.notFound()
  }

  const category = getCategoryPosts(categoryId, num)

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
          return <PostSummarySection post={post} />
        })}
      </div>
      <Pagination
        pageNumber={num}
        hasPrev={category.hasPrev}
        hasNext={category.hasNext}
        basePath={`/categories/${categoryId}`}
      />
    </Fragment>,
    head,
  )
})
