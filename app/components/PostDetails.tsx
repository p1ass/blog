import { css } from 'hono/css'
import { labelNameToId, labelPermalink } from '../lib/posts'
import type { Frontmatter } from '../routes/posts/types'
import { text, textMuted } from '../styles/color'
import { canHover } from '../styles/motion'
import { blockGap, space } from '../styles/spacing'
import { hoverTransition } from '../styles/transition'

const postDetailsCss = css`
  padding-bottom: ${blockGap};
`

const tagCss = css`
  color: ${textMuted};
  text-decoration: none;
  padding: 0 ${space['2xs']};

  ${hoverTransition(['color'])}

  ${canHover} {
    &:hover {
      color: ${text};
    }
  }
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
