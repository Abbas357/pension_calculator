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
        <FormField label="Extraordinary Leave (EOL)">
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
            <FormField label="EOL (Y / M / D)">
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  max={5}
                  placeholder="Years"
                  value={form.eolYears || ''}
                  onChange={(e) => setField('eolYears', Number(e.target.value) || 0)}
                />
                <Input
                  type="number"
                  min={0}
                  max={11}
                  placeholder="Months"
                  value={form.eolMonths || ''}
                  onChange={(e) => setField('eolMonths', Number(e.target.value) || 0)}
                />
                <Input
                  type="number"
                  min={0}
                  max={30}
                  placeholder="Days"
                  value={form.eolDays || ''}
                  onChange={(e) => setField('eolDays', Number(e.target.value) || 0)}
                />
              </div>
            </FormField>
            <p className="text-xs text-muted-foreground sm:ml-[calc(10rem+0.75rem)]">
              Qualifying service is capped at 30 years (70% max). EOL only changes the pension if
              net service falls below 30 years.
            </p>
          </>
        )}
      </div>
    </>
  )
}
