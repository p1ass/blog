import { useEffect, useState } from 'hono/jsx'
import { CheckIcon, type ThemeChoice, ThemeIcon } from '../components/Icons'

// テーマを選ぶコンポーネント。今の選択のアイコンだけを出し、押すと 3 つの選択肢が開く。
//
// 素の select はやめた。開いた一覧はブラウザの見た目のままで、こちらの色や角丸が当たらない。
// 代わりに開閉を自分で持つ。details と summary も試せるが、記事本文の details に当てたスタイルが
// そのまま効いてしまい、打ち消す宣言が並ぶ。div と button なら要素の名前でぶつからない。
//
// 開いている間だけ、外を押したときと Esc を見る。閉じるときはボタンへフォーカスを戻す。
//
// 引き金のアイコンは html の data-theme-choice を見た CSS が選ぶ。規則は _renderer.tsx にある。
// 島の状態で選ぶと、水和するまで SSR のときのアイコンが出たままになる。
// 一覧の側は開くまで出ないので、そちらの印は状態から付けてよい。
//
// 印はチェックにする。面の濃さで示すと、hover の面より弱く見えて、どちらが今の選択か読み取れない。
//
// 選んだときの処理は head の同期スクリプトが持つ __applyTheme に任せる。
// 適用と保存を 2 箇所に書くと、片方だけ直したときに読み込み直後と選んだ直後で挙動が分かれる。
const choices: ThemeChoice[] = ['system', 'light', 'dark']

const labels: Record<ThemeChoice, string> = {
  system: '端末の設定に合わせる',
  light: 'ライト',
  dark: 'ダーク',
}

function readChoice(): ThemeChoice {
  if (typeof document === 'undefined') {
    return 'system'
  }
  return (
    (document.documentElement.dataset.themeChoice as ThemeChoice) ?? 'system'
  )
}

const triggerId = 'theme-picker-trigger'

export default function ThemePicker() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<ThemeChoice>(readChoice)

  useEffect(() => {
    if (!open) {
      return
    }

    const close = () => setOpen(false)
    const onPointerDown = (event: Event) => {
      const target = event.target as Element | null
      if (!target?.closest('.theme-picker')) {
        close()
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        document.getElementById(triggerId)?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const select = (choice: ThemeChoice) => {
    window.__applyTheme?.(choice, true)
    setCurrent(choice)
    setOpen(false)
    document.getElementById(triggerId)?.focus()
  }

  return (
    <div class='theme-picker'>
      <button
        type='button'
        id={triggerId}
        class='theme-trigger'
        aria-haspopup='true'
        aria-expanded={open ? 'true' : 'false'}
        onClick={() => setOpen(!open)}
      >
        {choices.map(choice => (
          <span key={choice} class={`theme-choice theme-choice-${choice}`}>
            <ThemeIcon kind={choice} />
            <span class='sr-only'>テーマ: {labels[choice]}</span>
          </span>
        ))}
      </button>
      <div class='theme-menu' hidden={!open}>
        {choices.map(choice => (
          <button
            key={choice}
            type='button'
            class='theme-option'
            aria-current={current === choice ? 'true' : undefined}
            onClick={() => select(choice)}
          >
            <ThemeIcon kind={choice} />
            {labels[choice]}
            {current === choice ? (
              <span class='theme-check'>
                <CheckIcon />
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  )
}
