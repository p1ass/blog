type OgpApiResponse = {
  Policy: Policy
  Title: string
  Type: string
  URL: Url
  SiteName: string
  Image: Image[]
  Description: string
  Determiner: string
  Locale: string
  Favicon: string
}

type Policy = {
  TrustedTags: string[]
}

type Url = {
  Source: string
  Scheme: string
  Opaque: string
  User: null
  Host: string
  Path: string
  RawPath: string
  ForceQuery: boolean
  RawQuery: string
  Fragment: string
  Value: string
}

type Image = {
  URL: string
  SURL: string
  Type: string
  Width: number
  Height: number
  Alt: string
}

export async function fetchOgp(url: string): Promise<OgpApiResponse> {
  const res = await fetch(`https://blog-api.p1ass.com/ogp?url=${url}`)
  if (res.status !== 200) {
    console.error(res)
    throw new Error(`failed to fetch ogp: ${url}`)
  }
  const body = await res.json<OgpApiResponse>()
  return body
}
