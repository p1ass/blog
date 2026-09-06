import { css } from 'hono/css'
import { type PaginationPosts, postPermalink } from '../lib/posts'
import { accent, border } from '../styles/color'

const postPaginationCss = css`
  border-top: 0.5px solid ${border};
  padding-top: 2rem;
  display: inline-flex;
  text-align: center;
  justify-content: space-between;
  width: 100%;
`

const leftCss = css`
  text-align: left;
  max-width: 50%;
  color: ${accent};
  text-decoration: none;
`

const rightCss = css`
  text-align: right;
  max-width: 50%;
  color: ${accent};
  text-decoration: none;
`

const emptyPrevCss = css`
  max-width: 50%;
`

type Props = {
  paginationPosts: PaginationPosts
}

export function PostPagination({ paginationPosts }: Props) {
  return (
    <div class={postPaginationCss}>
      {paginationPosts.prevPost ? (
        <a href={postPermalink(paginationPosts.prevPost.slug)} class={leftCss}>
          &#8592; {paginationPosts.prevPost.frontmatter.title}
        </a>
      ) : (
        <div class={emptyPrevCss} />
      )}
      {paginationPosts.nextPost ? (
        <a href={postPermalink(paginationPosts.nextPost.slug)} class={rightCss}>
          {paginationPosts.nextPost.frontmatter.title} &#8594;
        </a>
      ) : null}
    </div>
  )
}
