import { forwardRef } from 'react'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SavedUsersPanel } from './SavedUsersPanel'
import type { SavedUser } from '@/lib/storage'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  progress: number | null
  savedUsers: SavedUser[]
  onSelect: (user: SavedUser) => void
  onClear: () => void
  onDelete: (user: SavedUser) => void
}

export const MobileUsersSheet = forwardRef<HTMLDivElement, Props>(function MobileUsersSheet(
  { open, onOpenChange, progress, savedUsers, onSelect, onClear, onDelete },
  ref,
) {
  return (
    <MobileDrawer ref={ref} side="left" open={open} onOpenChange={onOpenChange} progress={progress} title="Saved Users">
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
    </MobileDrawer>
  )
})
