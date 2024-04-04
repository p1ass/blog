type Props = {
  url: string
}

export function Twitter({ url }: Props) {
  return (
    <div>
      <blockquote class='twitter-tweet'>
        <a href={url}>{url}</a>
      </blockquote>
    </div>
  )
}
