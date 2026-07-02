import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormField, FormSectionTitle } from './FormField'
import type { PensionFormInput } from '@/lib/pension/types'

interface Props {
  form: PensionFormInput
  setField: <K extends keyof PensionFormInput>(field: K, value: PensionFormInput[K]) => void
}

export function EolSection({ form, setField }: Props) {
  return (
    <>
      <FormSectionTitle>Service Adjustment</FormSectionTitle>
      <div className="space-y-3">
        <FormField label="Extraordinary Leave (EOL)" plain>
          <div className="flex items-center gap-2">
            <Switch
              id="eol_toggle"
              checked={form.eolEnabled}
              onCheckedChange={(checked) => setField('eolEnabled', checked)}
            />
            <Label htmlFor="eol_toggle" className="font-normal text-muted-foreground">
              Deduct EOL from qualifying service
            </Label>
          </div>
        </FormField>

        {form.eolEnabled && (
          <>
            <div className="flex gap-2">
              <FormField label="EOL Years" htmlFor="eol_years" className="flex-1">
                <Input
                  id="eol_years"
                  type="number"
                  min={0}
                  max={5}
                  placeholder="0"
                  value={form.eolYears || ''}
                  onChange={(e) => setField('eolYears', Number(e.target.value) || 0)}
                />
              </FormField>
              <FormField label="Months" htmlFor="eol_months" className="flex-1">
                <Input
                  id="eol_months"
                  type="number"
                  min={0}
                  max={11}
                  placeholder="0"
                  value={form.eolMonths || ''}
                  onChange={(e) => setField('eolMonths', Number(e.target.value) || 0)}
                />
              </FormField>
              <FormField label="Days" htmlFor="eol_days" className="flex-1">
                <Input
                  id="eol_days"
                  type="number"
                  min={0}
                  max={30}
                  placeholder="0"
                  value={form.eolDays || ''}
                  onChange={(e) => setField('eolDays', Number(e.target.value) || 0)}
                />
              </FormField>
            </div>
            <p className="text-xs text-muted-foreground">
              Qualifying service is capped at 30 years (70% max). EOL only changes the pension if
              net service falls below 30 years.
            </p>
          </>
        )}
      </div>
    </>
  )
}
