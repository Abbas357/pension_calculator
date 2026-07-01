import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileImage, Printer, Loader2 } from 'lucide-react'
import { exportResultsAsPng } from '@/export/exportImage'
import { exportResultsAsPdf } from '@/export/exportPdf'
import { buildExportFilename } from '@/export/exportFilenames'
import type { PensionResult } from '@/lib/pension/types'

const EXPORT_NODE_ID = 'pension-export-capture'

export function ExportActions({ result }: { result: PensionResult }) {
  const [busy, setBusy] = useState<'png' | 'pdf' | null>(null)

  const getExportNode = () => document.getElementById(EXPORT_NODE_ID)

  const handlePng = async () => {
    const node = getExportNode()
    if (!node) return
    setBusy('png')
    try {
      await exportResultsAsPng(node, buildExportFilename('', result.service.dorOrDod, 'png'))
    } finally {
      setBusy(null)
    }
  }

  const handlePdf = async () => {
    const node = getExportNode()
    if (!node) return
    setBusy('pdf')
    try {
      await exportResultsAsPdf(node, buildExportFilename('', result.service.dorOrDod, 'pdf'))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button size="sm" variant="outline" onClick={handlePng} disabled={busy !== null}>
        {busy === 'png' ? <Loader2 className="animate-spin" /> : <FileImage />}
        Download PNG
      </Button>
      <Button size="sm" variant="outline" onClick={handlePdf} disabled={busy !== null}>
        {busy === 'pdf' ? <Loader2 className="animate-spin" /> : <Download />}
        Download PDF
      </Button>
      <Button size="sm" variant="outline" onClick={() => window.print()} disabled={busy !== null}>
        <Printer /> Print
      </Button>
    </div>
  )
}

export { EXPORT_NODE_ID }
