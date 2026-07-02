import { Combobox } from './Combobox'
import { FormField } from './FormField'
import { PENSION_TYPES } from '@/lib/pension/constants'
import type { PensionType } from '@/lib/pension/types'

interface Props {
  value: PensionType
  onChange: (value: PensionType) => void
}

const OPTIONS = PENSION_TYPES.map((pt) => ({ value: pt.value, label: pt.label }))

export function PensionTypeSelector({ value, onChange }: Props) {
  return (
    <FormField label="Type of Pension" htmlFor="ptype">
      <Combobox
        id="ptype"
        value={value}
        onChange={(v) => onChange(v as PensionType)}
        options={OPTIONS}
        searchPlaceholder="Search pension type..."
      />
    </FormField>
  )
}
