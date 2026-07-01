import { MoneyRow, ResultRow, ResultSectionHeader } from './ResultRow'
import { formatCurrency } from '@/lib/pension/format'
import type { PensionResult } from '@/lib/pension/types'

export function EmolumentsSection({ emoluments }: { emoluments: PensionResult['emoluments'] }) {
  return (
    <>
      <ResultSectionHeader>Emoluments</ResultSectionHeader>
      <MoneyRow label="Basic Pay" amount={emoluments.basicPay} />
      {emoluments.payWarning && (
        <tr>
          <td colSpan={3} className="px-3 pb-1.5 text-xs text-amber-600 dark:text-amber-400">
            ⓘ {emoluments.payWarning}
          </td>
        </tr>
      )}
      {emoluments.retiringYearIncrement !== null && (
        <MoneyRow label="Retiring Year Increment" amount={emoluments.retiringYearIncrement} striped />
      )}
      {emoluments.specialPay > 0 && <MoneyRow label="Special Pay" amount={emoluments.specialPay} />}
      {emoluments.personalPay > 0 && (
        <MoneyRow label="Personal Pay" amount={emoluments.personalPay} striped />
      )}
      {emoluments.qualificationPay > 0 && (
        <MoneyRow label="Qualification Pay" amount={emoluments.qualificationPay} />
      )}
      {emoluments.overseasPay > 0 && (
        <MoneyRow label="Overseas Pay" amount={emoluments.overseasPay} striped />
      )}
      {emoluments.spa > 0 && <MoneyRow label="Senior Post Allowance" amount={emoluments.spa} />}
      {emoluments.otherPensionablePay > 0 && (
        <MoneyRow label="Other" amount={emoluments.otherPensionablePay} striped />
      )}
      <ResultRow
        label="Total Emoluments"
        value={formatCurrency(emoluments.totalEmoluments)}
        bold
        bordered
      />
    </>
  )
}
