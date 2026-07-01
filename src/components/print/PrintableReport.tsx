import { ResultsTable } from '@/components/results/ResultsTable'
import type { PensionResult } from '@/lib/pension/types'

interface Props {
  result: PensionResult
  pensionerName?: string
  id?: string
}

/**
 * Sober, plain-table report used for both printing (@media print) and PNG/PDF export.
 * Deliberately avoids the glassmorphism/backdrop-blur styling used on screen, since that
 * rasterizes and prints poorly — see index.css print rules and src/export/*.
 */
export function PrintableReport({ result, pensionerName, id }: Props) {
  return (
    <div id={id} className="print-report w-[800px] bg-white p-8 text-black">
      <div className="mb-4 border-b-2 border-black pb-3">
        <h1 className="text-xl font-bold">Pension Calculation Report</h1>
        {pensionerName && <p className="mt-1 text-sm">Name: {pensionerName}</p>}
        <p className="mt-1 text-sm">{result.headerLabel}</p>
        {result.commutationOptedLabel && (
          <p className="text-sm">{result.commutationOptedLabel}</p>
        )}
      </div>

      <div className="[&_table]:w-full [&_td]:border [&_td]:border-black/20 [&_td]:px-2 [&_td]:py-1 [&_tr:nth-child(even)]:bg-black/5">
        <ResultsTable result={result} />
      </div>

      <p className="mt-4 text-right text-xs text-black/60">
        Generated {new Date().toLocaleString()}
      </p>
    </div>
  )
}
