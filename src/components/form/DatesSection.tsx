import { Input } from '@/components/ui/input'
import { FormField, FormSectionTitle } from './FormField'
import type { PensionFormInput } from '@/lib/pension/types'

interface Props {
  form: PensionFormInput
  setField: <K extends keyof PensionFormInput>(field: K, value: PensionFormInput[K]) => void
}

export function DatesSection({ form, setField }: Props) {
  const showDor = form.ptype !== 'ddservice'
  const showDod = form.ptype === 'ddservice' || form.ptype === 'daretirement'

  return (
    <>
      <FormSectionTitle>Dates</FormSectionTitle>
      <div className="space-y-3">
        <FormField label="Name of Pensioner" htmlFor="pname">
          <Input
            id="pname"
            maxLength={100}
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Optional"
          />
        </FormField>
        <FormField label="Date of Birth" htmlFor="dob">
          <Input
            id="dob"
            type="date"
            value={form.dob ?? ''}
            onChange={(e) => setField('dob', e.target.value || null)}
          />
        </FormField>
        <FormField label="Date of Appointment" htmlFor="doa">
          <Input
            id="doa"
            type="date"
            value={form.doa ?? ''}
            onChange={(e) => setField('doa', e.target.value || null)}
          />
        </FormField>
        {showDor && (
          <FormField label="Date of Retirement" htmlFor="dor">
            <Input
              id="dor"
              type="date"
              value={form.dor ?? ''}
              onChange={(e) => setField('dor', e.target.value || null)}
            />
          </FormField>
        )}
        {showDod && (
          <FormField label="Date of Death" htmlFor="dod">
            <Input
              id="dod"
              type="date"
              value={form.dod ?? ''}
              onChange={(e) => setField('dod', e.target.value || null)}
            />
          </FormField>
        )}
      </div>
    </>
  )
}
