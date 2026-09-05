import { z } from 'zod'

// 日付は必ずオフセット付きで書く。オフセットが無い日付はビルドマシンの TZ に
// よって指す瞬間が変わるため、受け付けない。
const isoDateWithOffset = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/,
    'date はオフセット付きの ISO 8601 で書く (例: 2024-04-30T12:00:00+09:00)',
  )
  .refine(v => !Number.isNaN(new Date(v).getTime()), 'date が実在しない日時')

export const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: isoDateWithOffset,
  description: z.string().min(1),
  // 記事の主題を 1 つだけ表す。カテゴリ一覧のグルーピングキーになる。
  category: z.string().min(1),
  tags: z.array(z.string().min(1)).optional(),
  // ルートからのパス (ex. /posts/web-speed-hackathon-2024/ogp.jpg)
  ogImage: z.string().startsWith('/').optional(),
})

export type Frontmatter = z.infer<typeof frontmatterSchema>
