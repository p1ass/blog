import { PostSummarySection } from '../components/PostSummarySection'
import { getPosts } from '../lib/posts'

export const title = 'ぷらすのブログ'

export default function Top() {
  return (
    <div>
      {getPosts().map(([id, module]) => {
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
