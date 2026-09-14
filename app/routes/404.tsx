import { NotFound } from '../components/NotFound'

// Cloudflare Pages は 404.html が無いと、存在しない URL にトップページを 200 で返し、Google にソフト 404 と扱われる。
export const noindex = true

export default function NotFoundPage() {
  return <NotFound />
}
