import { PostSummarySection } from '../components/PostSummarySection'
import type { Meta } from './types'

export const title = 'ぷらすのブログ'

export default function Top() {
  const posts = import.meta.glob<{ frontmatter: Meta }>('./posts/**/*.mdx', {
    eager: true,
  })
  return (
    <div>
      {Object.entries(posts)?.map(([id, module]) => {
        if (module.frontmatter) {
          return (
            <PostSummarySection
              frontmatter={module.frontmatter}
              summary='TODO'
              permalink={`${id.replace(/\/index\.mdx$/, '')}`}
            />
          )
        }
      })}
    </div>
  )
}
