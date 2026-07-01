import { Input } from '@/components/ui/input'
import { DatePicker } from './DatePicker'
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
          <DatePicker id="dob" value={form.dob} onChange={(v) => setField('dob', v)} />
        </FormField>
        <FormField label="Date of Appointment" htmlFor="doa">
          <DatePicker id="doa" value={form.doa} onChange={(v) => setField('doa', v)} />
        </FormField>
        {showDor && (
          <FormField label="Date of Retirement" htmlFor="dor">
            <DatePicker id="dor" value={form.dor} onChange={(v) => setField('dor', v)} />
          </FormField>
        )}
        {showDod && (
          <FormField label="Date of Death" htmlFor="dod">
            <DatePicker id="dod" value={form.dod} onChange={(v) => setField('dod', v)} />
          </FormField>
        )}
      </div>
    </>
  )
}
