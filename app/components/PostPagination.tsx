import { css } from 'hono/css'
import { type PaginationPosts, postPermalink } from '../lib/posts'
import { accent, border } from '../styles/color'
import { hoverUnderlineLinkCss } from '../styles/link'
import { borderWidth } from '../styles/shape'
import { space } from '../styles/spacing'

const postPaginationCss = css`
  border-top: ${borderWidth.thin} solid ${border};
  padding-top: ${space.xl};
  display: inline-flex;
  text-align: center;
  justify-content: space-between;
  width: 100%;
`

// 入れ子の規則を持つ ${...} は最後に置く。その後ろに書いた宣言は入れ子の外へ出て捨てられる。
const leftCss = css`
  max-width: 50%;
  color: ${accent};
  text-align: left;
  ${hoverUnderlineLinkCss}
`

const rightCss = css`
  max-width: 50%;
  color: ${accent};
  text-align: right;
  ${hoverUnderlineLinkCss}
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
