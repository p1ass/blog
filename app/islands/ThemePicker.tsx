import { useEffect, useState } from 'hono/jsx'
import { CheckIcon, type ThemeChoice, ThemeIcon } from '../components/Icons'

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
