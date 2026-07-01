import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ClipboardList } from 'lucide-react'
import { ResultsPanel } from './ResultsPanel'
import type { PensionResult } from '@/lib/pension/types'

interface Props {
  result: PensionResult | null
  pensionerName?: string
}

export function MobileResultsSheet({ result, pensionerName }: Props) {
  return (
    <div className="fixed inset-x-4 bottom-4 z-40 lg:hidden print:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="w-full shadow-lg" size="lg">
            <ClipboardList /> View Results
            {result && (
              <span className="ml-1 font-semibold">
                (Rs. {result.finalNetPensionPayable.toFixed(0)})
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetHeader>
            <SheetTitle>Pension Calculation</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-full px-4 pb-4">
            <ResultsPanel result={result} pensionerName={pensionerName} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
