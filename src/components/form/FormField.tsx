import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  htmlFor?: string
  children: ReactNode
  className?: string
  hint?: ReactNode
  /** Label above the control instead of floating inside it — for switches, sliders, etc. */
  plain?: boolean
}

export function FormField({ label, htmlFor, children, className, hint, plain }: FormFieldProps) {
  if (plain) {
    return (
      <div className={cn('grid gap-1.5', className)}>
        <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground/80">
          {label}
        </Label>
        {children}
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
    )
  }

  // The label floats when the field is focused, when a text/number input has content
  // (its placeholder is no longer shown), or when a picker trigger sets data-filled.
  return (
    <div className={className}>
      <div
        className={cn(
          'group relative',
          // Make room for the floated label; reveal the real placeholder only once
          // the label has floated out of the way.
          '[&_input]:h-11 [&_input]:pt-3.5 [&_input]:rounded-md [&_button]:rounded-md',
          '[&_input::placeholder]:opacity-0 [&_input::placeholder]:transition-opacity [&_input:focus::placeholder]:opacity-100',
          // Resting border: darker than the theme default for better definition on glass.
          '[&_input]:border-foreground/30 [&_button]:border-foreground/30 dark:[&_button]:border-foreground/30',
          // Active field: Google-style blue border; the 1px ring on top of the 1px
          // border reads as a 2px border without shifting layout.
          '[&_input:focus-visible]:border-blue-600 [&_input:focus-visible]:ring-1 [&_input:focus-visible]:ring-blue-600',
          'dark:[&_input:focus-visible]:border-blue-400 dark:[&_input:focus-visible]:ring-blue-400',
          '[&_button:focus-visible]:border-blue-600 [&_button:focus-visible]:ring-1 [&_button:focus-visible]:ring-blue-600',
          'dark:[&_button:focus-visible]:border-blue-400 dark:[&_button:focus-visible]:ring-blue-400',
          // Keep the blue border while a picker popover is open (focus moves into the portal).
          '[&_button[aria-expanded=true]]:border-blue-600 [&_button[aria-expanded=true]]:ring-1 [&_button[aria-expanded=true]]:ring-blue-600',
          'dark:[&_button[aria-expanded=true]]:border-blue-400 dark:[&_button[aria-expanded=true]]:ring-blue-400',
        )}
      >
        {children}
        <Label
          htmlFor={htmlFor}
          className={cn(
            'pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 font-normal text-muted-foreground transition-all duration-150',
            'group-focus-within:top-1 group-focus-within:translate-y-0 group-focus-within:text-[0.6875rem] group-focus-within:font-medium group-focus-within:tracking-wide group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400',
            'group-has-[input:not(:placeholder-shown)]:top-1 group-has-[input:not(:placeholder-shown)]:translate-y-0 group-has-[input:not(:placeholder-shown)]:text-[0.6875rem] group-has-[input:not(:placeholder-shown)]:font-medium group-has-[input:not(:placeholder-shown)]:tracking-wide',
            'group-has-data-filled:top-1 group-has-data-filled:translate-y-0 group-has-data-filled:text-[0.6875rem] group-has-data-filled:font-medium group-has-data-filled:tracking-wide',
            'group-has-[[aria-expanded=true]]:top-1 group-has-[[aria-expanded=true]]:translate-y-0 group-has-[[aria-expanded=true]]:text-[0.6875rem] group-has-[[aria-expanded=true]]:font-medium group-has-[[aria-expanded=true]]:tracking-wide group-has-[[aria-expanded=true]]:text-blue-600 dark:group-has-[[aria-expanded=true]]:text-blue-400',
          )}
        >
          {label}
        </Label>
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  )
}

export function FormSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 mt-6 bg-foreground/5 px-3 py-2 text-ls font-semibold uppercase tracking-wider text-muted-foreground first:mt-0">
      {children}
    </h3>
  )
}
