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
    <FormField label="Government" htmlFor="govt">
      <div className="flex flex-wrap items-center gap-2">
        <Combobox
          id="govt"
          value={value}
          onChange={(v) => onChange(v as Government)}
          options={OPTIONS}
          placeholder="Select government"
          searchPlaceholder="Search province..."
          className="sm:w-64"
        />
        {selected?.aliasedToKpk && (
          <Badge variant="outline" className="text-amber-600 dark:text-amber-400">
            Rates pending verification — mirrors KPK
          </Badge>
        )}
      </div>
    </FormField>
  )
}
