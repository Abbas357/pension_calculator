import { useEffect, useRef, useState } from 'react'

interface Options {
  leftEnabled: boolean
  rightEnabled: boolean
  leftOpen: boolean
  rightOpen: boolean
  onLeftOpenChange: (open: boolean) => void
  onRightOpenChange: (open: boolean) => void
  /** Drag beyond this fraction of the drawer's width commits to open on release. */
  commitThreshold?: number
  /** Swipes only fire below this viewport width; desktop already shows both panels inline. */
  maxViewportWidth?: number
}

type Side = 'left' | 'right'
type Mode = 'open' | 'close'

interface DragState {
  resolved: boolean
  rejected: boolean
  side: Side | null
  mode: Mode | null
  startX: number
  startY: number
  width: number
}

const ACTIVATE_PX = 10

function isBlockedTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  return !!target.closest(
    'input, button, select, textarea, a, [role="slider"], [data-slot="slider"], [data-slot="calendar"], [data-horizontal-scroll]',
  )
}

/**
 * Drives the two mobile off-canvas drawers (saved users on the left, results on the right)
 * with a finger-following drag: progress updates continuously on touchmove instead of only
 * committing on release, so the panel can be dragged back and forth before it settles.
 */
export function useSwipeDrawers({
  leftEnabled,
  rightEnabled,
  leftOpen,
  rightOpen,
  onLeftOpenChange,
  onRightOpenChange,
  commitThreshold = 0.5,
  maxViewportWidth = 1024,
}: Options) {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const [leftProgress, setLeftProgress] = useState<number | null>(null)
  const [rightProgress, setRightProgress] = useState<number | null>(null)

  const drag = useRef<DragState | null>(null)
  const progressRef = useRef({ left: leftOpen ? 1 : 0, right: rightOpen ? 1 : 0 })

  const stateRef = useRef({ leftOpen, rightOpen, leftEnabled, rightEnabled })
  stateRef.current = { leftOpen, rightOpen, leftEnabled, rightEnabled }

  const callbacksRef = useRef({ onLeftOpenChange, onRightOpenChange })
  callbacksRef.current = { onLeftOpenChange, onRightOpenChange }

  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      if (window.innerWidth >= maxViewportWidth) return
      if (isBlockedTarget(e.target)) return

      const { leftOpen, rightOpen } = stateRef.current
      const touch = e.touches[0]

      if (leftOpen) {
        drag.current = {
          resolved: true,
          rejected: false,
          side: 'left',
          mode: 'close',
          startX: touch.clientX,
          startY: touch.clientY,
          width: leftRef.current?.offsetWidth ?? 0,
        }
      } else if (rightOpen) {
        drag.current = {
          resolved: true,
          rejected: false,
          side: 'right',
          mode: 'close',
          startX: touch.clientX,
          startY: touch.clientY,
          width: rightRef.current?.offsetWidth ?? 0,
        }
      } else {
        drag.current = {
          resolved: false,
          rejected: false,
          side: null,
          mode: null,
          startX: touch.clientX,
          startY: touch.clientY,
          width: 0,
        }
      }
    }

    function applyProgress(side: Side, progress: number) {
      progressRef.current[side] = progress
      if (side === 'left') setLeftProgress(progress)
      else setRightProgress(progress)
    }

    function handleTouchMove(e: TouchEvent) {
      const state = drag.current
      if (!state || state.rejected) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - state.startX
      const deltaY = touch.clientY - state.startY

      if (!state.resolved) {
        if (Math.abs(deltaX) < ACTIVATE_PX) return
        if (Math.abs(deltaX) < Math.abs(deltaY) * 1.5) {
          state.rejected = true
          return
        }

        const { leftEnabled, rightEnabled } = stateRef.current
        if (deltaX > 0 && leftEnabled) {
          state.resolved = true
          state.side = 'left'
          state.mode = 'open'
          state.width = leftRef.current?.offsetWidth ?? 0
        } else if (deltaX < 0 && rightEnabled) {
          state.resolved = true
          state.side = 'right'
          state.mode = 'open'
          state.width = rightRef.current?.offsetWidth ?? 0
        } else {
          state.rejected = true
          return
        }
      }

      if (!state.width) return
      if (Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return // treat as vertical scroll, don't drag

      let progress: number
      if (state.mode === 'open') {
        progress = state.side === 'left' ? deltaX / state.width : -deltaX / state.width
      } else {
        progress = state.side === 'left' ? 1 + deltaX / state.width : 1 - deltaX / state.width
      }
      progress = Math.min(1, Math.max(0, progress))

      // Dragging our own panel — don't let the browser interpret this as an edge-swipe
      // back/forward navigation gesture.
      e.preventDefault()
      applyProgress(state.side as Side, progress)
    }

    function handleTouchEnd() {
      const state = drag.current
      drag.current = null
      if (!state || !state.resolved || !state.side) return

      const side = state.side
      const finalProgress = progressRef.current[side]
      const commit = finalProgress >= commitThreshold

      if (side === 'left') {
        callbacksRef.current.onLeftOpenChange(commit)
        setLeftProgress(null)
      } else {
        callbacksRef.current.onRightOpenChange(commit)
        setRightProgress(null)
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [maxViewportWidth, commitThreshold])

  return { leftRef, rightRef, leftProgress, rightProgress }
}
