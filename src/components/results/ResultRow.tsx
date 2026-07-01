import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/pension/format'

export function ResultSectionHeader({ children }: { children: ReactNode }) {
  return (
    <tr>
      <td colSpan={3} className="bg-primary/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
        {children}
      </td>
    </tr>
  )
}

interface ResultRowProps {
  label: ReactNode
  value: ReactNode
  striped?: boolean
  bold?: boolean
  bordered?: boolean
}

export function ResultRow({ label, value, striped, bold, bordered }: ResultRowProps) {
  return (
    <tr className={cn(striped && 'bg-foreground/[0.03]')}>
      <td
        colSpan={2}
        className={cn(
          'px-3 py-1.5 text-sm text-foreground/80',
          bold && 'font-semibold text-foreground',
          bordered && 'border-y border-foreground/20',
        )}
      >
        {label}
      </td>
      <td
        className={cn(
          'px-3 py-1.5 text-right text-sm tabular-nums',
          bold && 'font-semibold',
          bordered && 'border-y border-foreground/20',
        )}
      >
        {value}
      </td>
    </tr>
  )
}

export function MoneyRow(props: Omit<ResultRowProps, 'value'> & { amount: number }) {
  return <ResultRow {...props} value={formatCurrency(props.amount)} />
}
