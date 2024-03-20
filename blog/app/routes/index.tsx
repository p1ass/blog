import { Fragment } from 'hono/jsx/jsx-runtime'
import { Pagination } from '../components/Pagination'
import { PostSummarySection } from '../components/PostSummarySection'
import { getPosts } from '../lib/posts'

export default function Top() {
  const pageNum = 1
  const { posts, hasPrev, hasNext } = getPosts(pageNum)
  return (
    <Fragment>
      <div>
        {posts.map(post => {
          return (
            <PostSummarySection
              frontmatter={post.frontmatter}
              ContentSummary={post.ContentSummary}
              permalink={`${post.id.replace(/\/index\.mdx$/, '')}/`}
            />
          )
        })}
      </div>
      <Pagination pageNumber={pageNum} hasPrev={hasPrev} hasNext={hasNext} />
    </Fragment>
  )
}
