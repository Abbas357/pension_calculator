import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ResultsPanel } from './ResultsPanel'
import type { PensionResult } from '@/lib/pension/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  result: PensionResult | null
  pensionerName?: string
  onSaveUser?: () => void
}

export function MobileResultsSheet({ open, onOpenChange, result, pensionerName, onSaveUser }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="data-[side=right]:w-[92vw] sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Pension Calculation</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full px-4 pb-4">
          <ResultsPanel result={result} pensionerName={pensionerName} onSaveUser={onSaveUser} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
