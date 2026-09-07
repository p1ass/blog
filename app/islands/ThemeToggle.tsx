import { type ThemeChoice, ThemeIcon } from '../components/Icons'

// テーマを巡回するボタン。押すたびに system → light → dark → system と回る。
//
// 見た目はこのファイルに持たない。今表示している選択肢は html の data-theme-choice で決まり、
// 規則は _renderer.tsx のグローバルブロックにある。CSS で切り替えると、島が水和する前から正しいアイコンが出る。
// 島の状態で持つと、SSR の時点では読者の選択が分からないぶん、水和のときにアイコンが一瞬入れ替わる。
//
// 押したときの処理も head の同期スクリプトが持つ __applyTheme に任せる。
// 適用と保存を 2 箇所に書くと、片方だけ直したときに読み込み直後と押した直後で挙動が分かれる。
const choices: ThemeChoice[] = ['system', 'light', 'dark']

const labels: Record<ThemeChoice, string> = {
  system: 'テーマ: 端末の設定に合わせる',
  light: 'テーマ: ライト',
  dark: 'テーマ: ダーク',
}

export default function ThemeToggle() {
  const cycle = () => {
    const current = document.documentElement.dataset.themeChoice as
      | ThemeChoice
      | undefined
    const index = current ? choices.indexOf(current) : 0
    window.__applyTheme?.(choices[(index + 1) % choices.length], true)
  }

  return (
    <button type='button' class='theme-toggle' onClick={cycle}>
      {choices.map(choice => (
        <span key={choice} class={`theme-choice theme-choice-${choice}`}>
          <ThemeIcon kind={choice} />
          <span class='sr-only'>{labels[choice]}</span>
        </span>
      ))}
    </button>
  )
}
