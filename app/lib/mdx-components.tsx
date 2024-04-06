import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import type { MDXComponents } from 'mdx/types'
import { BlockLink } from '../components/markdown/BlockLink'
import { ExLinkCard } from '../components/markdown/ExLinkCard'
import { Note } from '../components/markdown/Note'
import { StyledPre } from '../components/markdown/StyledPre'
import { Twitter } from '../components/markdown/Twitter'
import {
  backgroundDark,
  blue,
  blueLight,
  border,
  grayLight,
  whiteDark,
} from '../styles/color'
import { verticalRhythmUnit } from '../styles/variables'

export function useMDXComponents(): MDXComponents {
  const components = {
    img: Image,
    pre: StyledPre,
    blockquote: BlockQuote,
    a: Link,
    em: Em,
    table: Table,
    th: Th,
    td: Td,
    ExLinkCard: ExLinkCard,
    BlockLink: BlockLink,
    Note: Note,
    Twitter: Twitter,
  }
  // @ts-ignore
  return components
}

const imageCss = css`
  display: block;
  max-height: 500px;
  max-width: 100%;
  margin: 0 auto;
  border: 1px solid ${border};
`

export function Image(props: PropsWithChildren<Hono.ImgHTMLAttributes>) {
  // 本番ビルドではviteStaticCopyによって画像がコピーされているので、それに合わせたパスになるようにしている
  const src = import.meta.env.PROD
    ? props.src?.replaceAll('/app/routes', '')
    : props.src

  return (
    <a href={src}>
      <img src={src} alt={props.alt} class={imageCss} />
    </a>
  )
}

const blockQuoteCss = css`
  border-left: 0.25rem solid ${border};
  color: ${grayLight};
  margin: 0.8rem 0;
  padding: 0.5rem 1rem;

  p:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 600px) {
    padding: 0 5rem 0 1.25rem;
  }
`

function BlockQuote(props: PropsWithChildren<Hono.BlockquoteHTMLAttributes>) {
  return (
    <blockquote class={blockQuoteCss} cite={props.cite}>
      {props.children}
    </blockquote>
  )
}

const linkCss = css`
  color: ${blue};
`

function Link(props: PropsWithChildren<Hono.AnchorHTMLAttributes>) {
  return (
    <a href={props.href} class={linkCss}>
      {props.children}
    </a>
  )
}

const emCss = css`
  color: ${grayLight};
  display: block;
  font-family: sans-serif;
  font-size: 0.9rem;
  font-style: normal;
  text-align: center;
`

function Em(props: PropsWithChildren<Hono.HTMLAttributes>) {
  return <em class={emCss}>{props.children}</em>
}

const tableCss = css`
  border-spacing: 0;
  border-collapse: collapse;
  
  tr:nth-child(odd) td {
    background: ${backgroundDark};
  }
`

function Table(props: PropsWithChildren<Hono.TableHTMLAttributes>) {
  return (
    <table class={tableCss} align={props.align}>
      {props.children}
    </table>
  )
}

const thTdCss = css`
  border: solid 1px ${border};
  padding: ${verticalRhythmUnit * 0.25}rem ${verticalRhythmUnit * 0.5}rem;
`

function Th(props: PropsWithChildren<Hono.ThHTMLAttributes>) {
  return (
    <th class={thTdCss} align={props.align}>
      {props.children}
    </th>
  )
}

function Td(props: PropsWithChildren<Hono.TdHTMLAttributes>) {
  return (
    <td class={thTdCss} align={props.align}>
      {props.children}
    </td>
  )
}
