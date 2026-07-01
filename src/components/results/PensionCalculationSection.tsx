import { MoneyRow, ResultRow, ResultSectionHeader } from './ResultRow'
import { formatDateSpaced } from '@/lib/pension/format'
import type { PensionResult } from '@/lib/pension/types'

export function PensionCalculationSection({
  pensionCalc,
}: {
  pensionCalc: PensionResult['pensionCalc']
}) {
  return (
    <>
      <ResultSectionHeader>Pension Calculation</ResultSectionHeader>
      <MoneyRow label={pensionCalc.grossPensionLabel} amount={pensionCalc.grossPension} />
      {pensionCalc.isCommuted && (
        <>
          <MoneyRow
            label={`${pensionCalc.commutePct}% Commuted Portion`}
            amount={pensionCalc.commutedPortion!}
            striped
          />
          <MoneyRow label="Net Pension" amount={pensionCalc.netPension} />
          <ResultRow
            label="Commutation Rate"
            value={pensionCalc.commuttRate!.toFixed(4)}
            striped
          />
          <MoneyRow
            label={pensionCalc.commutationOrGratuityLabel!}
            amount={pensionCalc.commutationOrGratuityAmount!}
            bold
          />
          {pensionCalc.dateOfRestoration && (
            <ResultRow
              label="Date of Restoration"
              value={formatDateSpaced(pensionCalc.dateOfRestoration)}
              striped
            />
          )}
        </>
      )}
    </>
  )
}
