import { forwardRef, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  side: 'left' | 'right'
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Live drag position (0 = closed, 1 = open); null when not being dragged, falls back to `open`. */
  progress: number | null
  title: string
  children: ReactNode
}

export const MobileDrawer = forwardRef<HTMLDivElement, Props>(function MobileDrawer(
  { side, open, onOpenChange, progress, title, children },
  ref,
) {
  const resolvedProgress = progress ?? (open ? 1 : 0)
  const dragging = progress !== null
  const translatePercent = side === 'left' ? (resolvedProgress - 1) * 100 : (1 - resolvedProgress) * 100
  const transition = dragging ? 'none' : 'transform 200ms ease-in-out'

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/10 backdrop-blur-xs lg:hidden',
          resolvedProgress === 0 && 'pointer-events-none',
        )}
        style={{ opacity: resolvedProgress, transition: dragging ? 'none' : 'opacity 200ms ease-in-out' }}
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-hidden={resolvedProgress === 0}
        className={cn(
          'fixed inset-y-0 z-50 flex w-[92vw] max-w-sm flex-col gap-4 bg-popover text-sm text-popover-foreground shadow-lg lg:hidden',
          side === 'left' ? 'left-0 border-r border-border' : 'right-0 border-l border-border',
        )}
        style={{ transform: `translateX(${translatePercent}%)`, transition }}
      >
        <div className="flex items-center justify-between gap-0.5 p-4">
          <h2 className="font-heading text-base font-medium text-foreground">{title}</h2>
          <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={() => onOpenChange(false)}>
            <XIcon />
          </Button>
        </div>
        {children}
      </div>
    </>
  )
})
