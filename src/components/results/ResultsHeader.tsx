import type { ReactNode } from 'react'
import type { PensionResult } from '@/lib/pension/types'

interface Props {
  result: PensionResult
  pensionerName?: string
  actions?: ReactNode
}

export function ResultsHeader({ result, pensionerName, actions }: Props) {
  return (
    <div className="space-y-2 border-b border-white/20 px-4 py-3 dark:border-white/10">
      {actions}
      <div className="space-y-1">
        {pensionerName && <div className="text-lg font-semibold text-foreground">{pensionerName}</div>}
        <div className="text-base font-semibold text-foreground">{result.headerLabel}</div>
        {result.commutationOptedLabel && (
          <div className="text-sm text-muted-foreground">{result.commutationOptedLabel}</div>
        )}
      </div>
    </div>
  )
}
