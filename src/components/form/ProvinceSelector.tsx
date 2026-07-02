import { Badge } from '@/components/ui/badge'
import { Combobox } from './Combobox'
import { FormField } from './FormField'
import { GOVERNMENTS } from '@/lib/pension/constants'
import type { Government } from '@/lib/pension/types'

interface Props {
  value: Government
  onChange: (value: Government) => void
}

const OPTIONS = GOVERNMENTS.map((g) => ({ value: g.value, label: g.label }))

export function ProvinceSelector({ value, onChange }: Props) {
  const selected = GOVERNMENTS.find((g) => g.value === value)

  return (
    <FormField
      label="Government"
      htmlFor="govt"
      hint={
        selected?.aliasedToKpk ? (
          <Badge variant="outline" className="text-amber-600 dark:text-amber-400">
            Rates pending verification, mirrors KPK
          </Badge>
        ) : undefined
      }
    >
      <Combobox
        id="govt"
        value={value}
        onChange={(v) => onChange(v as Government)}
        options={OPTIONS}
        searchPlaceholder="Search province..."
      />
    </FormField>
  )
}
