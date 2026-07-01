import { useState } from 'react'
import { format, isValid, parseISO } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  id?: string
  value: string | null // YYYY-MM-DD
  onChange: (value: string | null) => void
  placeholder?: string
}

const MIN_YEAR = 1930
const MAX_YEAR_OFFSET = 40

export function DatePicker({ id, value, onChange, placeholder = 'Pick a date' }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = value ? parseISO(value) : undefined
  const displayValue = selected && isValid(selected) ? format(selected, 'dd MMM yyyy') : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn(
            'w-full justify-start font-normal',
            !displayValue && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-1 size-4" />
          {displayValue ?? placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          startMonth={new Date(MIN_YEAR, 0)}
          endMonth={new Date(new Date().getFullYear() + MAX_YEAR_OFFSET, 11)}
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            onChange(date ? format(date, 'yyyy-MM-dd') : null)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
