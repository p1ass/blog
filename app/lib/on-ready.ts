// client.ts は async で読み込まれ、body の解析より先に動くことがある。
export function onReady(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true })
    return
  }
  callback()
}
