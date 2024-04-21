import type { Env } from 'hono'
import { Fragment } from 'hono/jsx/jsx-runtime'
import { ssgParams } from 'hono/ssg'
import { createRoute } from 'honox/factory'
import { Heading } from '../../../../../components/Heading'
import { Pagination } from '../../../../../components/Pagination'
import { PostSummarySection } from '../../../../../components/PostSummarySection'
import type { Head } from '../../../../../global'
import {
  getCategories,
  getCategoryPosts,
  getMaxPageNumber,
} from '../../../../../lib/posts'

const param = ssgParams<Env>(c => {
  const params: { id: string; num: string }[] = []
  getCategories().forEach((category, _) => {
    const maxPageNumber = getMaxPageNumber(category.posts)
    for (let num = 1; num <= maxPageNumber; num++) {
      // 1ページ目はトップページなので生成する必要がない
      if (num <= 1) {
        continue
      }
      params.push({ id: category.id, num: num.toString() })
    }
  })
  console.log(params)
  return params
})

export default createRoute(param, c => {
  const categoryId = c.req.param('id')
  const numStr = c.req.param('num')
  const num = Number.parseInt(numStr)
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
      <Heading>{`Category ${category.name}`}</Heading>
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
