import { Card, CardContent } from '@/components/ui/card'
import { ResultsHeader } from './ResultsHeader'
import { ResultsTable } from './ResultsTable'
import { ExportActions } from './ExportActions'
import type { PensionResult } from '@/lib/pension/types'

interface Props {
  result: PensionResult | null
  pensionerName?: string
  onSaveUser?: () => void
}

export function ResultsPanel({ result, pensionerName, onSaveUser }: Props) {
  return (
    <Card className="print:hidden border-white/20 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      {result ? (
        <>
          <ResultsHeader
            result={result}
            pensionerName={pensionerName}
            actions={<ExportActions result={result} onSave={onSaveUser} />}
          />
          <CardContent className="overflow-x-auto px-0">
            <ResultsTable result={result} />
          </CardContent>
        </>
      ) : (
        <CardContent className="flex min-h-[16rem] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
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
