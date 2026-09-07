import { css } from 'hono/css'

// サイトで使うアイコン。
//
// 以前は Font Awesome の外部 kit を全ページで読んでいた。実際に使っていたのは GitHub、X、info の 3 つだけで、そのために毎回スクリプトを 1 本取りに行っていた。
// 図形をここに書けば、SSG の出力にそのまま入る。
//
// ブランドマークの d は Simple Icons (https://simple-icons.org) から取った。あちらは CC0 なので、そのまま持ってきてよい。
// info、warning、tip と、テーマの system、light、dark は自前で描いた。円や三角と線だけで済む図形なので、外から持ってくる理由がない。

// 文字と並べて置くアイコン。大きさは前後の文字に合わせ、ベースラインから少し下げて字面の中心に揃える。
const inlineIconCss = css`
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  fill: currentColor;
`

const githubPath =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'

const xPath =
  'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z'

// aria-hidden にするのは、どのアイコンもすぐ隣に同じ意味の文字があるため。
// 読み上げると「GitHub GitHub」のように 2 回聞こえる。
export function GitHubIcon() {
  return (
    <svg viewBox='0 0 24 24' class={inlineIconCss} aria-hidden='true'>
      <path d={githubPath} />
    </svg>
  )
}

export function XIcon() {
  return (
    <svg viewBox='0 0 24 24' class={inlineIconCss} aria-hidden='true'>
      <path d={xPath} />
    </svg>
  )
}

// Note の左に置くアイコン。線で描き、太さは 2 に揃える。
// 塗りではなく線にするのは、3 つを並べたときに重さがそろうため。
const noteIconCss = css`
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`

// テーマの選択肢を表すアイコン。太さと大きさは Note のものに揃える。
// system は画面そのものを描く。太陽と月の中間のような図形にすると、どちらでもない状態が伝わらない。
export type ThemeChoice = 'system' | 'light' | 'dark'

export function ThemeIcon({ kind }: { kind: ThemeChoice }) {
  return (
    <svg viewBox='0 0 24 24' class={noteIconCss} aria-hidden='true'>
      {kind === 'system' ? (
        <>
          <rect x='3' y='4' width='18' height='12' rx='2' />
          <path d='M12 16v4' />
          <path d='M8 20h8' />
        </>
      ) : null}
      {kind === 'light' ? (
        <>
          <circle cx='12' cy='12' r='4' />
          <path d='M12 2v2' />
          <path d='M12 20v2' />
          <path d='M4.2 4.2l1.4 1.4' />
          <path d='M18.4 18.4l1.4 1.4' />
          <path d='M2 12h2' />
          <path d='M20 12h2' />
          <path d='M4.2 19.8l1.4-1.4' />
          <path d='M18.4 5.6l1.4-1.4' />
        </>
      ) : null}
      {kind === 'dark' ? (
        <path d='M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z' />
      ) : null}
    </svg>
  )
}

// 一覧の中で今の選択に添えるチェック。文字と並ぶので、Note のものより小さい 16px にする。
const checkIconCss = css`
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`

export function CheckIcon() {
  return (
    <svg viewBox='0 0 24 24' class={checkIconCss} aria-hidden='true'>
      <path d='M4 12.5 9.5 18 20 6.5' />
    </svg>
  )
}

export type NoteKind = 'info' | 'warning' | 'tip'

export function NoteIcon({ kind }: { kind: NoteKind }) {
  return (
    <svg viewBox='0 0 24 24' class={noteIconCss} aria-hidden='true'>
      {kind === 'info' ? (
        <>
          <circle cx='12' cy='12' r='9' />
          <path d='M12 11v5' />
          <path d='M12 8h.01' />
        </>
      ) : null}
      {kind === 'warning' ? (
        <>
          <path d='M12 4 21 19H3Z' />
          <path d='M12 10v4' />
          <path d='M12 17h.01' />
        </>
      ) : null}
      {kind === 'tip' ? (
        <>
          <circle cx='12' cy='9.5' r='5.5' />
          <path d='M9.5 17.5h5' />
          <path d='M10.5 20.5h3' />
        </>
      ) : null}
    </svg>
  )
}
