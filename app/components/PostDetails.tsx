import { css } from 'hono/css'
import { labelNameToId, labelPermalink } from '../lib/posts'
import type { Frontmatter } from '../routes/posts/types'
import { text, textMuted } from '../styles/color'
import { blockGap, space } from '../styles/spacing'
import { transition } from '../styles/transition'

const postDetailsCss = css`
  padding-bottom: ${blockGap};
`

const tagCss = css`
  color: ${textMuted};
  text-decoration: none;
  padding: 0 ${space['2xs']};

  ${transition(['color'])}

  &:hover,
  &:focus-visible {
    color: ${text};
  }
`

export function PostDetails({ frontmatter }: { frontmatter: Frontmatter }) {
  return (
    <div class={postDetailsCss}>
      <a
        href={labelPermalink('category', labelNameToId(frontmatter.category))}
        class={tagCss}
      >
        #{frontmatter.category}
      </a>
      {frontmatter.tags?.map((tagName, _) => (
        <a href={labelPermalink('tag', labelNameToId(tagName))} class={tagCss}>
          #{tagName}
        </a>
      ))}
    </div>
  )
}
