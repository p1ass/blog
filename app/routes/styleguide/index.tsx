import { css } from 'hono/css'
import { Author } from '../../components/Author'
import { BlockLink } from '../../components/markdown/BlockLink'
import { Note } from '../../components/markdown/Note'
import { Pagination } from '../../components/Pagination'
import { PostSummarySection } from '../../components/PostSummarySection'
import { ShareButtons } from '../../components/ShareIcons'
import type { Post } from '../../lib/post-list'
import * as brandTokens from '../../styles/brand'
import { breakpoint, contentWidth } from '../../styles/breakpoint'
import * as colorTokens from '../../styles/color'
import { accent, border, surfaceSubtle, textMuted } from '../../styles/color'
import { bodyLinkCss } from '../../styles/link'
import { duration, easing, reducedMotion } from '../../styles/motion'
import {
  accent as accentPalette,
  neutral,
  tip as tipPalette,
  warning as warningPalette,
} from '../../styles/palette'
import { borderWidth, focusRing, radius } from '../../styles/shape'
import { blockGap, space } from '../../styles/spacing'
import { type Assignment, dark, light } from '../../styles/theme'
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  underline,
} from '../../styles/typography'

export const title = 'Style Guide'

// 記事ではないので検索結果に出さない。robots.txt からも除外している。
export const noindex = true

const sectionCss = css`
  margin-bottom: ${space['2xl']};
`

const swatchListCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${space.sm};
  margin-bottom: ${blockGap};
  padding: 0;
  list-style: none;
`

const swatchCss = css`
  border: 1px solid ${border};
  border-radius: ${radius.sm};
  overflow: hidden;
`

const swatchChipCss = css`
  height: ${space['2xl']};
`

const swatchLabelCss = css`
  padding: ${space.xs} ${space.sm};
  background-color: ${surfaceSubtle};
  border-top: 1px solid ${border};
  font-size: 0.85rem;
  line-height: 1.5;
`

const swatchValueCss = css`
  color: ${textMuted};
  font-size: 0.75rem;
  word-break: break-all;
`

// フォーカスリングは :focus-visible でしか出ないので、当たった状態を固定で描いた見本を置く。
// これがないと、リングの見た目は見た目の回帰テストに写らない。
const focusRingSampleCss = css`
  display: inline-block;
  padding: ${space.xs} ${space.md};
  border-radius: ${radius.sm};
  background-color: ${surfaceSubtle};
  outline: ${focusRing.width} solid ${accent};
  outline-offset: ${focusRing.offset};
`

// hover した状態を固定で描いた見本。link.ts の hover 側と同じ値を書いているので、あちらを変えたらここも直す。
// 見た目の回帰テストは撮影時にカーソルを乗せないため、これがないと hover の見た目が基準画像に写らない。
const linkHoverSampleCss = css`
  color: ${accent};
  background-color: ${surfaceSubtle};
  text-decoration-line: underline;
  text-decoration-color: ${accent};
  text-decoration-thickness: ${underline.hoverThickness};
  text-underline-offset: ${underline.offset};
`

// 見出しの直下に置く、その節が何を見せているかの一行。
const captionCss = css`
  color: ${textMuted};
  font-size: 0.85rem;
  margin: 0 0 ${space.sm};
`

const tokenTableCss = css`
  border-collapse: collapse;
  width: 100%;
  margin-bottom: ${blockGap};

  & th,
  & td {
    border: 1px solid ${border};
    padding: ${space.xs} ${space.sm};
    text-align: left;
    font-size: 0.85rem;
    vertical-align: middle;
  }

  & th {
    background-color: ${surfaceSubtle};
  }

  & code {
    font-size: 0.8rem;
  }
`

type TokenTableProps = {
  // 見本の欄に何を出すか。値だけで足りるものは省く
  sample?: (value: string) => unknown
  tokens: Record<string, string | number>
}

// トークンの定義をそのまま反復して表にする。定義を足せばこのページにも出るので、一覧の更新の抜けが起きない。
function TokenTable({ tokens, sample }: TokenTableProps) {
  return (
    <table class={tokenTableCss}>
      <thead>
        <tr>
          <th>名前</th>
          <th>値</th>
          {sample ? <th>見本</th> : null}
        </tr>
      </thead>
      <tbody>
        {Object.entries(tokens).map(([name, value]) => (
          <tr key={name}>
            <td>
              <code>{name}</code>
            </td>
            <td>
              <code>{String(value)}</code>
            </td>
            {sample ? <td>{sample(String(value))}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// 一覧のカードの見本に使う、固定の記事。
// 実在の記事を引くと、新しい記事を書くたびに基準画像が変わってしまう。
const samplePost: Post = {
  slug: 'sample-post',
  frontmatter: {
    title: 'カードの中の見出しが、章の罫線を持たないことを確かめる',
    date: '2026-09-06T12:00:00+09:00',
    description: '見本',
    category: '開発',
    tags: ['タグ', 'サンプル'],
  },
  MDXContent: () => <p>本文</p>,
  ContentSummary: () => (
    <p>抜粋の段落。一覧では本文のマーカーより前だけを出す。</p>
  ),
}

type SwatchProps = {
  name: string
  value: string
}

function Swatch({ name, value }: SwatchProps) {
  return (
    <li class={swatchCss}>
      <div class={swatchChipCss} style={`background-color: ${value}`} />
      <div class={swatchLabelCss}>
        <div>{name}</div>
        <div class={swatchValueCss}>{value}</div>
      </div>
    </li>
  )
}

// 見本の欄に置く、行の高さに収まる大きさの色の四角。
const chipCss = css`
  width: ${space['2xl']};
  height: ${space.md};
  border: 1px solid ${border};
  border-radius: ${radius.sm};
`

// 役割ごとに、両テーマの値を並べる。
// color.ts の export と theme.ts の割り当ては同じ名前で対応しているので、色の変数から役割名を引き直さずに済む。
function SemanticColorTable() {
  return (
    <table class={tokenTableCss}>
      <thead>
        <tr>
          <th>役割</th>
          <th>明るいテーマ</th>
          <th>暗いテーマ</th>
          <th>見本</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(colorTokens).map(([role, variable]) => (
          <tr key={role}>
            <td>
              <code>{role}</code>
            </td>
            <td>
              <code>{light[role as keyof Assignment]}</code>
            </td>
            <td>
              <code>{dark[role as keyof Assignment]}</code>
            </td>
            <td>
              <div class={chipCss} style={`background-color: ${variable}`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// styles/*.ts の export をそのまま並べる。トークンを足せばこのページにも出るので、一覧の更新の抜けが起きない。
function swatchesOf(module: Record<string, unknown>) {
  return Object.entries(module)
    .filter(([, value]) => typeof value === 'string')
    .map(([name, value]) => (
      <Swatch key={name} name={name} value={value as string} />
    ))
}

export default function StyleGuide() {
  return (
    <div>
      <h1>Style Guide</h1>
      <p class={captionCss}>
        トークンと本文要素とコンポーネントを 1 ページに並べたもの。
        見た目の回帰テストはこのページを撮る。
      </p>

      <section class={sectionCss}>
        <h2>カラー</h2>

        <h3>プリミティブカラー</h3>
        <p class={captionCss}>
          app/styles/palette.ts。色そのものに付けた名前。役割を決めるのは
          theme.ts で、コンポーネントからは直接使わない。
        </p>
        <ul class={swatchListCss}>
          {Object.entries(neutral).map(([step, value]) => (
            <Swatch key={step} name={`neutral-${step}`} value={value} />
          ))}
        </ul>
        <ul class={swatchListCss}>
          {Object.entries(accentPalette).map(([step, value]) => (
            <Swatch key={step} name={`accent-${step}`} value={value} />
          ))}
        </ul>
        <p class={captionCss}>
          warning と tip だけは別の色相を持つ。段は Note
          で使うぶんだけ置いてある。
        </p>
        <ul class={swatchListCss}>
          {Object.entries(warningPalette).map(([step, value]) => (
            <Swatch key={step} name={`warning-${step}`} value={value} />
          ))}
          {Object.entries(tipPalette).map(([step, value]) => (
            <Swatch key={step} name={`tip-${step}`} value={value} />
          ))}
        </ul>

        <h3>セマンティックカラー</h3>
        <p class={captionCss}>
          app/styles/color.ts の
          export。見本は今このページを見ているテーマの色で、 両側の値は
          app/styles/theme.ts の割り当て。
        </p>
        <SemanticColorTable />

        <h3>ブランドカラー</h3>
        <p class={captionCss}>
          app/styles/brand.ts の
          export。他社のブランドカラーなのでテーマで変えない。
        </p>
        <ul class={swatchListCss}>{swatchesOf(brandTokens)}</ul>
      </section>

      <section class={sectionCss}>
        <h2>タイポグラフィ</h2>

        <h3>フォントサイズ</h3>
        <p class={captionCss}>
          app/styles/typography.ts。本文 17px を基準に比 1.2 の等比。
        </p>
        <TokenTable
          tokens={fontSize}
          sample={value => (
            <span style={`font-size: ${value}`}>あア亜 Ag 123</span>
          )}
        />

        <h3>行間</h3>
        <TokenTable tokens={lineHeight} />

        <h3>フォントウェイト</h3>
        <TokenTable
          tokens={fontWeight}
          sample={value => (
            <span style={`font-weight: ${value}`}>あア亜 Ag 123</span>
          )}
        />

        <h3>フォントファミリー</h3>
        <TokenTable
          tokens={fontFamily}
          sample={value => (
            <span style={`font-family: ${value}`}>あア亜 Ag 123</span>
          )}
        />

        <h3>適用例</h3>
        <p class={captionCss}>
          このページの h1 が見出しの最上位。以下に h2 から h6 を並べる。
          記事本文と同じ見え方にするため article で囲んである。
        </p>

        <article>
          <h2>h2 見出し Heading Level 2</h2>
          <h3>h3 見出し Heading Level 3</h3>
          <h4>h4 見出し Heading Level 4</h4>
          <h5>h5 見出し Heading Level 5</h5>
          <h6>h6 見出し Heading Level 6</h6>

          <p>
            本文の段落。和文と欧文が混ざる技術ブログなので、Ascender と
            Descender の噛み合いを確認する。ISUCON、gRPC、OAuth 2.0
            のような略語や数字も混ぜてある。行長と行間の確認のために、
            この段落は折り返しが起きる程度の長さにしてある。
          </p>
          <p>
            2 つ目の段落。段落どうしの間隔を見るために置いている。
            <strong>strong による強調</strong>と<em>em による強調</em>と
            <code>インラインコード</code>を含む。
          </p>
        </article>
      </section>

      <section class={sectionCss}>
        <h2>本文のスタイル</h2>

        <h3>リスト</h3>
        <ul>
          <li>箇条書きの項目</li>
          <li>
            入れ子を持つ項目
            <ul>
              <li>入れ子の項目</li>
              <li>入れ子の項目</li>
            </ul>
          </li>
          <li>3 つ目の項目</li>
        </ul>
        <ol>
          <li>番号付きの項目</li>
          <li>番号付きの項目</li>
          <li>番号付きの項目</li>
        </ol>

        <h3>引用</h3>
        <blockquote>
          <p>引用の中の段落。出典を示すときに使う。</p>
        </blockquote>

        <h3>表</h3>
        <table>
          <thead>
            <tr>
              <th>列 A</th>
              <th>列 B</th>
              <th>列 C</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 行目</td>
              <td>値</td>
              <td>値</td>
            </tr>
            <tr>
              <td>2 行目</td>
              <td>値</td>
              <td>値</td>
            </tr>
            <tr>
              <td>3 行目</td>
              <td>値</td>
              <td>値</td>
            </tr>
          </tbody>
        </table>

        <h3>コードブロック</h3>
        <pre>
          <code class='hljs language-go'>
            <span class='hljs-keyword'>func</span>{' '}
            <span class='hljs-title'>main</span>() {'{\n'}
            {'  '}
            <span class='hljs-built_in'>fmt</span>.Println(
            <span class='hljs-string'>"hello"</span>){'\n'}
            {'}'}
          </code>
        </pre>

        <h3>区切り線</h3>
        <hr />

        <h3>折りたたみ</h3>
        <details>
          <summary>詳細を開く</summary>
          <p>折りたたみの中身。</p>
        </details>

        <h3>リンク</h3>
        <p>
          本文中の <a href='https://blog.p1ass.com'>リンク</a> の見え方。
          脚注の参照は
          <sup>
            <a href='#footnote-sample'>1</a>
          </sup>
          のように出る。
        </p>

        <h3>脚注</h3>
        <p class={captionCss}>
          remark が記事の末尾に置くまとまり。見出しは sr-only で隠す。
          隠さないと英語の「Footnotes」が章の罫線つきで出る。
        </p>
        <section class='footnotes' data-footnotes='true'>
          <h2 class='sr-only'>Footnotes</h2>
          <ol>
            <li id='footnote-sample'>
              <p>
                脚注の中身。本文より小さく、色を落とす。{' '}
                <a href='#footnote-sample'>↩</a>
              </p>
            </li>
          </ol>
        </section>
      </section>

      <section class={sectionCss}>
        <h2>コンポーネント</h2>

        <h3>Note</h3>
        <p class={captionCss}>
          3 種別。既定は info。warning と tip だけ別の色相を持つ。
        </p>
        <Note>
          <p>info。補足を書くための囲み。</p>
        </Note>
        <Note kind='warning'>
          <p>warning。読み飛ばすと困ることを書く。</p>
        </Note>
        <Note kind='tip'>
          <p>tip。知っていると得をすることを書く。</p>
        </Note>

        <h3>BlockLink</h3>
        <BlockLink href='https://blog.p1ass.com'>
          単独の行として置くリンク
        </BlockLink>

        <h3>Author</h3>
        <Author />

        <h3>ShareButtons</h3>
        <ShareButtons title='サンプル記事' permalink='/posts/sample/' />

        <h3>Pagination</h3>
        <Pagination pageNumber={2} hasPrev={true} hasNext={true} />

        <h3>PostSummarySection</h3>
        <p class={captionCss}>
          一覧のカード。タイトルは h2 だが、記事本文ではないので章の罫線は
          持たない。上端のアクセント線とタイトル直下の下線があるため、
          罫線を足すと短い範囲に線が 3 本並ぶ。
        </p>
        <PostSummarySection post={samplePost} />
      </section>

      <section class={sectionCss}>
        <h2>スペーシング</h2>
        <p class={captionCss}>app/styles/spacing.ts。4px の倍数。</p>
        <TokenTable
          tokens={space}
          sample={value => (
            <div
              style={`background-color: ${accent}; height: 8px; width: ${value}`}
            />
          )}
        />
        <p class={captionCss}>
          本文のブロック間は blockGap ({blockGap})。行送りと同じ値にして、
          段落が一定のリズムで流れるようにする。
        </p>
      </section>

      <section class={sectionCss}>
        <h2>角丸とボーダー</h2>
        <p class={captionCss}>app/styles/shape.ts。</p>
        <TokenTable
          tokens={radius}
          sample={value => (
            <div
              style={`background-color: ${surfaceSubtle}; border: 1px solid ${border}; border-radius: ${value}; width: 64px; height: 32px`}
            />
          )}
        />
        <TokenTable
          tokens={borderWidth}
          sample={value => (
            <div style={`border-top: ${value} solid ${border}; width: 96px`} />
          )}
        />
      </section>

      <section class={sectionCss}>
        <h2>状態</h2>

        <h3>フォーカスリング</h3>
        <p class={captionCss}>
          app/styles/shape.ts の focusRing。キーボードで操作したときだけ出す。
          規則は _renderer.tsx に 1 つだけ置き、要素ごとには書かない。
        </p>
        <TokenTable tokens={focusRing} />
        <p class={captionCss}>
          下は、リングが当たった状態を固定で描いた見本。 実際のリングは
          :focus-visible でしか出ないので、
          見た目の回帰テストに写るようにここへ置いている。
        </p>
        <span class={focusRingSampleCss}>フォーカスの当たった要素</span>

        <h3>リンクの状態</h3>
        <p class={captionCss}>
          app/styles/link.ts。文章の中のリンクは薄い下線を常に引き、hover と
          focus で下線を accent まで濃く、太くして、背後に薄い面を敷く。
          前後の記事へのリンクやフッターのように単独で置くリンクは、
          下線を透明にしておき hover で現れさせる。
        </p>
        <TokenTable tokens={underline} />
        <p class={captionCss}>
          hover も :focus-visible と同じく撮影時には当たらないので、
          当たった状態を固定で描いた見本を並べる。
        </p>
        <p>
          <a href='https://blog.p1ass.com' class={bodyLinkCss}>
            平常時のリンク
          </a>
          {' / '}
          <span class={linkHoverSampleCss}>hover したリンク</span>
        </p>
      </section>

      <section class={sectionCss}>
        <h2>モーション</h2>
        <p class={captionCss}>
          app/styles/motion.ts。イージングは {easing} の 1 種類に統一する。
          transition: all は書かず、動かすプロパティを名指しする。
          動きを減らす設定の読者には reducedMotion ({reducedMotion})
          で全停止する。
        </p>
        <TokenTable tokens={duration} />
      </section>

      <section class={sectionCss}>
        <h2>ブレークポイント</h2>
        <p class={captionCss}>
          app/styles/breakpoint.ts。向きは min-width に統一し、生の @media
          は書かない。
        </p>
        <TokenTable tokens={breakpoint} />
        <p class={captionCss}>
          本文の幅は contentWidth ({contentWidth})。17px で 1 行が全角 44
          文字になる。
        </p>
      </section>
    </div>
  )
}
