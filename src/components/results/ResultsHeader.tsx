import type { PensionResult } from '@/lib/pension/types'

export function ResultsHeader({ result }: { result: PensionResult }) {
  return (
    <div className="space-y-1 border-b border-white/20 px-4 py-3 dark:border-white/10">
      <div className="text-base font-semibold text-foreground">{result.headerLabel}</div>
      {result.commutationOptedLabel && (
        <div className="text-sm text-muted-foreground">{result.commutationOptedLabel}</div>
      )}
    </div>
  )
}
