import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  htmlFor?: string
  children: ReactNode
  className?: string
  hint?: string
}

export function FormField({ label, htmlFor, children, className, hint }: FormFieldProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-1.5 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-3', className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground/80">
        {label}
      </Label>
      <div>
        {children}
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  )
}

export function FormSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground first:mt-0">
      {children}
    </h3>
  )
}
