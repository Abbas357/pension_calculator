import { Card, CardContent } from '@/components/ui/card'
import { ResultsHeader } from './ResultsHeader'
import { ResultsTable } from './ResultsTable'
import { ExportActions } from './ExportActions'
import type { PensionResult } from '@/lib/pension/types'

interface Props {
  result: PensionResult | null
  pensionerName?: string
  onSaveUser?: () => void
  onReset?: () => void
}

export function ResultsPanel({ result, pensionerName, onSaveUser, onReset }: Props) {
  return (
    <Card className="print:hidden border-white/20 bg-white/40 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/30">
      {result ? (
        <>
          <ResultsHeader
            result={result}
            pensionerName={pensionerName}
            actions={<ExportActions result={result} onSave={onSaveUser} onReset={onReset} />}
          />
          <CardContent className="overflow-x-auto px-0" data-horizontal-scroll>
            <ResultsTable result={result} />
          </CardContent>
        </>
      ) : (
        <CardContent className="flex min-h-[16rem] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
          {pensionerName && <p className="text-lg font-semibold text-foreground">{pensionerName}</p>}
          <p className="text-sm font-medium">No results yet</p>
          <p className="text-xs">
            Fill in date of birth, appointment, retirement/death, BPS and basic pay to see the
            pension calculation.
          </p>
        </CardContent>
      )}
    </Card>
  )
}
