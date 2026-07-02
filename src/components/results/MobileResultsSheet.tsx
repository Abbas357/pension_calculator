import { forwardRef } from 'react'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ResultsPanel } from './ResultsPanel'
import type { PensionResult } from '@/lib/pension/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  progress: number | null
  result: PensionResult | null
  pensionerName?: string
  onSaveUser?: () => void
  onReset?: () => void
}

export const MobileResultsSheet = forwardRef<HTMLDivElement, Props>(function MobileResultsSheet(
  { open, onOpenChange, progress, result, pensionerName, onSaveUser, onReset },
  ref,
) {
  return (
    <MobileDrawer
      ref={ref}
      side="right"
      open={open}
      onOpenChange={onOpenChange}
      progress={progress}
      title="Pension Calculation"
    >
      <ScrollArea className="min-h-0 flex-1 px-4 pb-4">
        <ResultsPanel result={result} pensionerName={pensionerName} onSaveUser={onSaveUser} onReset={onReset} />
      </ScrollArea>
    </MobileDrawer>
  )
})
