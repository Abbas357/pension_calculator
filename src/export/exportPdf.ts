import { jsPDF } from 'jspdf'
import { captureNodeAsPngDataUrl } from './exportImage'

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

export async function exportResultsAsPdf(node: HTMLElement, filename: string): Promise<void> {
  const dataUrl = await captureNodeAsPngDataUrl(node)
  const img = await loadImage(dataUrl)

  const doc = new jsPDF({
    orientation: img.width > img.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [img.width, img.height],
  })

  // jsPDF re-encodes the decoded pixel data itself rather than reusing the PNG's own
  // compression; without an explicit compression level it can produce a PDF an order of
  // magnitude larger than the source PNG.
  doc.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height, undefined, 'SLOW')
  doc.save(filename)
}
