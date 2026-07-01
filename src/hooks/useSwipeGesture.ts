import { useEffect, useRef } from 'react'

interface SwipeGestureOptions {
  onSwipeRight?: () => void
  onSwipeLeft?: () => void
  /** Minimum horizontal travel (px) before a touch counts as a swipe. */
  minDistance?: number
  /** Swipes only fire below this viewport width; desktop already shows both panels inline. */
  maxViewportWidth?: number
  enabled?: boolean
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  return !!target.closest(
    'input, button, select, textarea, a, [role="slider"], [data-slot="slider"], [data-slot="calendar"]',
  )
}

/** Detects a horizontal swipe gesture on touch devices, ignoring drags that start on interactive controls (sliders, inputs, etc.) or mostly-vertical scrolls. */
export function useSwipeGesture({
  onSwipeRight,
  onSwipeLeft,
  minDistance = 60,
  maxViewportWidth = 1024,
  enabled = true,
}: SwipeGestureOptions) {
  const start = useRef({ x: 0, y: 0, target: null as EventTarget | null })

  useEffect(() => {
    if (!enabled) return

    function handleTouchStart(e: TouchEvent) {
      const touch = e.touches[0]
      start.current = { x: touch.clientX, y: touch.clientY, target: e.target }
    }

    function handleTouchEnd(e: TouchEvent) {
      if (window.innerWidth >= maxViewportWidth) return
      if (isInteractiveTarget(start.current.target)) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - start.current.x
      const deltaY = touch.clientY - start.current.y

      if (Math.abs(deltaX) < minDistance) return
      if (Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return // mostly vertical scroll, ignore

      if (deltaX > 0) onSwipeRight?.()
      else onSwipeLeft?.()
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipeRight, onSwipeLeft, minDistance, maxViewportWidth, enabled])
}
