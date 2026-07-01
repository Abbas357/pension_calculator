import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SavedUsersPanel } from './SavedUsersPanel'
import type { SavedUser } from '@/lib/storage'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  savedUsers: SavedUser[]
  onSelect: (user: SavedUser) => void
  onClear: () => void
  onDelete: (user: SavedUser) => void
}

export function MobileUsersSheet({ open, onOpenChange, savedUsers, onSelect, onClear, onDelete }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="data-[side=left]:w-[92vw] sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Saved Users</SheetTitle>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1 px-4 pb-4">
          <SavedUsersPanel
            savedUsers={savedUsers}
            onSelect={(user) => {
              onSelect(user)
              onOpenChange(false)
            }}
            onClear={onClear}
            onDelete={onDelete}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
