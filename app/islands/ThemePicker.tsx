import { useEffect, useState } from 'hono/jsx'
import { CheckIcon, type ThemeChoice, ThemeIcon } from '../components/Icons'

// select は開いた一覧にこちらのスタイルが当たらず、details は記事本文のスタイルとぶつかるので、div と button で開閉を持つ。
// 引き金のアイコンは _renderer.tsx の CSS が data-theme-choice から選ぶ。状態で選ぶと、hydration までは SSR 時のアイコンが残る。
// 適用と保存は head のスクリプトの __applyTheme に任せ、処理を 1 箇所にする。
// 今の選択は描画のたびに data-theme-choice から読む。状態に持つと、先読みした後にほかのページで選び直したテーマが反映されない。
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
  const current = readChoice()

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
