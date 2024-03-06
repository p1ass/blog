import { jsxRenderer } from 'hono/jsx-renderer'

export default jsxRenderer(({ children, Layout, frontmatter }) => {
  return (
    <Layout title={frontmatter?.title}>
      <time>{frontmatter?.date}</time>
      <h1>{frontmatter?.title}</h1>
      <div>
        {frontmatter?.tags.map((tag, index) => (
          <span key={index}>#{tag}</span>
        ))}
      </div>
      <div>{children}</div>
    </Layout>
  )
})
