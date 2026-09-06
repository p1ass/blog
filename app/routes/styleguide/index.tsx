import { css } from 'hono/css'
import { Author } from '../../components/Author'
import { BlockLink } from '../../components/markdown/BlockLink'
import { Note } from '../../components/markdown/Note'
import { Pagination } from '../../components/Pagination'
import { ShareButtons } from '../../components/ShareIcons'
import * as brandTokens from '../../styles/brand'
import * as colorTokens from '../../styles/color'
import { border, surfaceSubtle, text, textMuted } from '../../styles/color'
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
        <h2>余白の基準</h2>
        <p class={captionCss}>
          verticalRhythmUnit ({verticalRhythmUnit}rem) の倍数。
        </p>
        <ul class={swatchListCss}>
          {[0.25, 0.5, 0.75, 1, 1.5, 2].map(scale => (
            <li key={scale} class={swatchCss}>
              <div
                class={swatchChipCss}
                style={`background-color: ${text}; height: ${verticalRhythmUnit * scale}rem`}
              />
              <div class={swatchLabelCss}>
                <div>&times; {scale}</div>
                <div class={swatchValueCss}>
                  {verticalRhythmUnit * scale}rem
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
