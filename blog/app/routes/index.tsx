import { parse } from '@formkit/tempo'
import { PostSummarySection } from '../components/PostSummarySection'
import type { Meta } from './types'

export const title = 'ぷらすのブログ'

function sortByDateDesc():
  | ((
      a: [string, { frontmatter: Meta }],
      b: [string, { frontmatter: Meta }],
    ) => number)
  | undefined {
  return ([_aid, aPost], [_bid, bPost]) => {
    const aDate = parse(
      aPost.frontmatter.date,
      'YYYY-MM-DDTHH:mm:ss',
      'Asia/Tokyo',
    )
    const bDate = parse(
      bPost.frontmatter.date,
      'YYYY-MM-DDTHH:mm:ss',
      'Asia/Tokyo',
    )
    return aDate.getTime() < bDate.getTime() ? 1 : -1
  }
}

export default function Top() {
  const posts = import.meta.glob<{ frontmatter: Meta }>('./posts/**/*.mdx', {
    eager: true,
  })

  return (
    <div>
      {Object.entries(posts)
        .sort(sortByDateDesc())
        .map(([id, module]) => {
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
