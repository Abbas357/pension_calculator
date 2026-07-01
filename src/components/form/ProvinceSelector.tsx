import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FormField } from './FormField'
import { GOVERNMENTS } from '@/lib/pension/constants'
import type { Government } from '@/lib/pension/types'

interface Props {
  value: Government
  onChange: (value: Government) => void
}

export function ProvinceSelector({ value, onChange }: Props) {
  const selected = GOVERNMENTS.find((g) => g.value === value)

  return (
    <FormField label="Government" htmlFor="govt">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={value} onValueChange={(v) => onChange(v as Government)}>
          <SelectTrigger id="govt" className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GOVERNMENTS.map((g) => (
              <SelectItem key={g.value} value={g.value}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected?.aliasedToKpk && (
          <Badge variant="outline" className="text-amber-600 dark:text-amber-400">
            Rates pending verification — mirrors KPK
          </Badge>
        )}
      </div>
    </FormField>
  )
}
