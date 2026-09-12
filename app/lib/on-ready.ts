// client.ts は async で読み込まれるので、body の解析より先に動くことがある。
// ブラウザでだけ動く処理は、本文が組み上がってから呼ぶ。
export function onReady(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true })
    return
  }
  callback()
}
