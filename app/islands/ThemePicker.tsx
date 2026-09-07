import { type ThemeChoice, ThemeIcon } from '../components/Icons'

// テーマを選ぶ部品。今の選択のアイコンだけを出し、押すと 3 つの選択肢が開く。
//
// 開く部分は素の select に任せ、透明にしてアイコンの上に重ねる。
// 自前で作ると、開閉、外を押したときの扱い、Esc、矢印キー、フォーカスの戻し先を全部書くことになる。
// select ならブラウザが持っていて、スマホでは OS のピッカーが出る。
//
// 見た目はこのファイルに持たない。アイコンの出し分けは html の data-theme-choice を見た CSS がやり、
// 規則は _renderer.tsx のグローバルブロックにある。CSS で選ぶと、島が水和する前から正しいアイコンが出る。
// 島の状態で持つと、SSR の時点では読者の選択が分からないぶん、水和のときにアイコンが入れ替わる。
//
// 選んだときの処理は head の同期スクリプトが持つ __applyTheme に任せる。
// 適用と保存を 2 箇所に書くと、片方だけ直したときに読み込み直後と選んだ直後で挙動が分かれる。
const choices: ThemeChoice[] = ['system', 'light', 'dark']

const labels: Record<ThemeChoice, string> = {
  system: '端末の設定に合わせる',
  light: 'ライト',
  dark: 'ダーク',
}

export default function ThemePicker() {
  // 水和のときはブラウザの側にいるので、head のスクリプトが置いた選択をそのまま読める。
  // SSR では読者の選択が分からず system になるが、見えているアイコンを決めるのは CSS なので画面には出ない。
  const current =
    typeof document === 'undefined'
      ? 'system'
      : ((document.documentElement.dataset.themeChoice as ThemeChoice) ??
        'system')

  return (
    <div class='theme-picker'>
      {choices.map(choice => (
        <span key={choice} class={`theme-choice theme-choice-${choice}`}>
          <ThemeIcon kind={choice} />
        </span>
      ))}
      <select
        class='theme-select'
        aria-label='テーマ'
        onChange={event =>
          window.__applyTheme?.(
            (event.target as HTMLSelectElement).value as ThemeChoice,
            true,
          )
        }
      >
        {choices.map(choice => (
          <option key={choice} value={choice} selected={current === choice}>
            {labels[choice]}
          </option>
        ))}
      </select>
    </div>
  )
}
