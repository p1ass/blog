import { Meta } from '../routes/types'
import { parseDate } from './time'

const posts = import.meta.glob<{ frontmatter: Meta }>('../posts/**/*.mdx', {
  eager: true,
})

function sortByDateDesc():
  | ((
      a: [string, { frontmatter: Meta }],
      b: [string, { frontmatter: Meta }],
    ) => number)
  | undefined {
  return ([_aid, aPost], [_bid, bPost]) => {
    const aDate = parseDate(aPost.frontmatter.date)
    const bDate = parseDate(bPost.frontmatter.date)
    return aDate.getTime() < bDate.getTime() ? 1 : -1
  }
}

export function getPosts() {
  return Object.entries(posts).sort(sortByDateDesc())
}
