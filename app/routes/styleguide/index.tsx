import { css } from 'hono/css'
import { Author } from '../../components/Author'
import { BlockLink } from '../../components/markdown/BlockLink'
import { Note } from '../../components/markdown/Note'
import { Pagination } from '../../components/Pagination'
import { ShareButtons } from '../../components/ShareIcons'
import * as brandTokens from '../../styles/brand'
import { breakpoint } from '../../styles/breakpoint'
import * as colorTokens from '../../styles/color'
import { accent, border, surfaceSubtle, textMuted } from '../../styles/color'
import { duration, easing } from '../../styles/motion'
import { accent as accentPalette, neutral } from '../../styles/palette'
import { borderWidth, radius } from '../../styles/shape'
import { blockGap, space } from '../../styles/spacing'
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} from '../../styles/typography'
import { verticalRhythmUnit } from '../../styles/variables'

export const title = 'Style Guide'

// 記事ではないので検索結果に出さない。robots.txt でも弾いている。
export const noindex = true

const sectionCss = css`
  margin-bottom: ${verticalRhythmUnit * 2}rem;
`

const swatchListCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${verticalRhythmUnit * 0.5}rem;
  margin-bottom: ${verticalRhythmUnit}rem;
  padding: 0;
  list-style: none;
`

const swatchCss = css`
  border: 1px solid ${border};
  border-radius: ${verticalRhythmUnit * 0.25}rem;
  overflow: hidden;
`

const swatchChipCss = css`
  height: ${verticalRhythmUnit * 2}rem;
`

const swatchLabelCss = css`
  padding: ${verticalRhythmUnit * 0.25}rem ${verticalRhythmUnit * 0.5}rem;
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

// 見出しの直下に置く、その節が何を見せているかの一行。
const captionCss = css`
  color: ${textMuted};
  font-size: 0.85rem;
  margin: 0 0 ${verticalRhythmUnit * 0.5}rem;
`

const tokenTableCss = css`
  border-collapse: collapse;
  width: 100%;
  margin-bottom: ${verticalRhythmUnit}rem;

  & th,
  & td {
    border: 1px solid ${border};
    padding: ${verticalRhythmUnit * 0.25}rem ${verticalRhythmUnit * 0.5}rem;
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
  // 見本の欄に何を出すか。値だけ見せれば足りるものは省く
  sample?: (value: string) => unknown
  tokens: Record<string, string | number>
}

// トークンの定義をそのまま反復して表にする。定義を足せばこのページにも
// 出るので、一覧の更新漏れが起きない。
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

// styles/*.ts の export をそのまま並べる。トークンを足したらこのページにも
// 自動で出るので、一覧の更新漏れが起きない。
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
        <h2>色</h2>

        <h3>パレット</h3>
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

        <h3>セマンティックトークン</h3>
        <p class={captionCss}>
          app/styles/color.ts の export。値はテーマごとに差し替わる。
        </p>
        <ul class={swatchListCss}>{swatchesOf(colorTokens)}</ul>

        <h3>ブランド色</h3>
        <p class={captionCss}>
          app/styles/brand.ts の export。他社の色なのでテーマで変えない。
        </p>
        <ul class={swatchListCss}>{swatchesOf(brandTokens)}</ul>
      </section>

      <section class={sectionCss}>
        <h2>タイポグラフィ</h2>

        <h3>大きさ</h3>
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

        <h3>太さ</h3>
        <TokenTable
          tokens={fontWeight}
          sample={value => (
            <span style={`font-weight: ${value}`}>あア亜 Ag 123</span>
          )}
        />

        <h3>書体</h3>
        <TokenTable
          tokens={fontFamily}
          sample={value => (
            <span style={`font-family: ${value}`}>あア亜 Ag 123</span>
          )}
        />

        <h3>いま当たっているスタイル</h3>
        <p class={captionCss}>
          このページの h1 が見出しの最上位。以下に h2 から h6 を並べる。
        </p>

        <h2>h2 見出し Heading Level 2</h2>
        <h3>h3 見出し Heading Level 3</h3>
        <h4>h4 見出し Heading Level 4</h4>
        <h5>h5 見出し Heading Level 5</h5>
        <h6>h6 見出し Heading Level 6</h6>

        <p>
          本文の段落。和文と欧文が混ざる技術ブログなので、Ascender と Descender
          の噛み合いを確認する。ISUCON、gRPC、OAuth 2.0
          のような略語や数字も混ぜてある。行長と行間の確認のために、
          この段落は折り返しが起きる程度の長さにしてある。
        </p>
        <p>
          2 つ目の段落。段落どうしの間隔を見るために置いている。
          <strong>strong による強調</strong>と<em>em による強調</em>と
          <code>インラインコード</code>を含む。
        </p>
      </section>

      <section class={sectionCss}>
        <h2>本文の要素</h2>

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
        </p>
      </section>

      <section class={sectionCss}>
        <h2>コンポーネント</h2>

        <h3>Note</h3>
        <Note>
          <p>補足を書くための囲み。</p>
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
      </section>

      <section class={sectionCss}>
        <h2>余白</h2>
        <p class={captionCss}>app/styles/spacing.ts。4px グリッドの幾何列。</p>
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
        <h2>角丸と境界線</h2>
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
        <h2>動き</h2>
        <p class={captionCss}>
          app/styles/motion.ts。イージングは {easing} の 1 種類に統一する。
        </p>
        <TokenTable tokens={duration} />
      </section>

      <section class={sectionCss}>
        <h2>画面幅</h2>
        <p class={captionCss}>
          app/styles/breakpoint.ts。向きは min-width に統一し、生の @media
          は書かない。
        </p>
        <TokenTable tokens={breakpoint} />
      </section>
    </div>
  )
}
