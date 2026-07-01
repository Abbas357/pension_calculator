import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { FormField } from './FormField'
import { PENSION_TYPES } from '@/lib/pension/constants'
import type { PensionType } from '@/lib/pension/types'

interface Props {
  value: PensionType
  onChange: (value: PensionType) => void
}

export function PensionTypeSelector({ value, onChange }: Props) {
  return (
    <FormField label="Type of Pension" className="items-start">
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as PensionType)}
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {PENSION_TYPES.map((pt) => (
          <Label
            key={pt.value}
            htmlFor={`ptype-${pt.value}`}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm font-normal has-data-checked:border-primary has-data-checked:bg-primary/5"
          >
            <RadioGroupItem value={pt.value} id={`ptype-${pt.value}`} />
            {pt.label}
          </Label>
        ))}
      </RadioGroup>
    </FormField>
  )
}
