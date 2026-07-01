import { MoneyRow, ResultRow, ResultSectionHeader } from './ResultRow'
import { formatCurrency } from '@/lib/pension/format'
import type { PensionResult } from '@/lib/pension/types'

export function MedicalAllowanceSection({
  medical,
  finalNetPensionPayable,
}: {
  medical: PensionResult['medical']
  finalNetPensionPayable: number
}) {
  return (
    <>
      <ResultSectionHeader>Medical Allowance</ResultSectionHeader>
      <MoneyRow
        label={`${medical.medicalRatePct}% Medical Allowance of 2010`}
        amount={medical.medical2010}
      />
      <MoneyRow
        label={`${medical.medicalIncreasePct}% increase on Medical Allowance`}
        amount={medical.medicalIncreaseAmount}
        striped
      />
      {medical.orderlyAllowance !== null && (
        <MoneyRow label="Orderly Allowance" amount={medical.orderlyAllowance} />
      )}
      <ResultRow
        label="Net Pension Payable Rs."
        value={formatCurrency(finalNetPensionPayable)}
        bold
        bordered
      />
    </>
  )
}
