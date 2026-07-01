import { toPng } from 'html-to-image'

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}

export async function captureNodeAsPngDataUrl(node: HTMLElement): Promise<string> {
  return toPng(node, {
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    cacheBust: true,
    // The capture target sits off-screen via `position: fixed; left: -9999px` (see
    // .print-report in index.css) so it stays laid out without being visible on screen.
    // html-to-image clones the node into an SVG foreignObject; a fixed/negative-offset
    // position on the clone resolves outside the foreignObject's box and renders blank,
    // so it must be neutralized on the clone (the live off-screen node is untouched).
    style: { position: 'static', left: 'auto', top: 'auto' },
  })
}

export async function exportResultsAsPng(node: HTMLElement, filename: string): Promise<void> {
  const dataUrl = await captureNodeAsPngDataUrl(node)
  downloadDataUrl(dataUrl, filename)
}
