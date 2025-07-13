import type { Env } from 'hono'
import { Fragment } from 'hono/jsx/jsx-runtime'
import { ssgParams } from 'hono/ssg'
import { createRoute } from 'honox/factory'
import { Heading } from '../../../components/Heading'
import { Pagination } from '../../../components/Pagination'
import { PostSummarySection } from '../../../components/PostSummarySection'
import type { Head } from '../../../global'
import { getCategories, getCategoryPosts } from '../../../lib/posts'

const param = ssgParams<Env>(_c => {
  return getCategories().map(category => {
    return { id: category.id }
  })
})

export default createRoute(param, c => {
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
      <Heading>{`Category ${category.name}`}</Heading>
      <div>
        {category.posts.map(post => {
          return <PostSummarySection post={post} />
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
