import { MoneyRow, ResultRow, ResultSectionHeader } from './ResultRow'
import { formatCurrency } from '@/lib/pension/format'
import type { PensionResult } from '@/lib/pension/types'

export function AnnualIncreasesSection({
  increases,
  netPensionBaselineLabel,
  netPensionBaselineAmount,
}: {
  increases: PensionResult['increases']
  netPensionBaselineLabel: string
  netPensionBaselineAmount: number
}) {
  return (
    <>
      <ResultSectionHeader>Annual Pension Increases</ResultSectionHeader>
      <MoneyRow label={netPensionBaselineLabel} amount={netPensionBaselineAmount} bold />
      {increases.map((step, i) =>
        step.isFloorRow ? (
          <ResultRow
            key={step.key}
            label={step.floorLabel}
            value={formatCurrency(step.runningTotal)}
            bordered
            bold
          />
        ) : step.visible ? (
          <tr key={step.key} className={i % 2 === 0 ? 'bg-foreground/[0.03]' : undefined}>
            <td className="px-3 py-1.5 text-sm text-foreground/80">
              {step.ratePctLabel} increase of {step.yearLabel}
            </td>
            <td className="px-3 py-1.5 text-right text-sm tabular-nums">
              {formatCurrency(step.increaseAmount)}
            </td>
            <td className="px-3 py-1.5 text-right text-sm tabular-nums">
              {formatCurrency(step.runningTotal)}
            </td>
          </tr>
        ) : null,
      )}
    </>
  )
}
