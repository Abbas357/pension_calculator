import { useState } from 'react'
import { format, isValid, parseISO } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'

interface DatePickerProps {
  id?: string
  value: string | null // YYYY-MM-DD
  onChange: (value: string | null) => void
}

const MIN_YEAR = 1930
const MAX_YEAR_OFFSET = 40

export function DatePicker({ id, value, onChange }: DatePickerProps) {
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
          data-filled={displayValue ? '' : undefined}
          className="relative h-11 w-full justify-start bg-transparent pl-2.5 pr-9 pt-3.5 pb-1 font-normal dark:bg-input/30"
        >
          <span className="truncate">{displayValue}</span>
          <CalendarIcon className="absolute top-1/2 right-2.5 size-4 -translate-y-1/2 opacity-50" />
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
