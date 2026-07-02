import { DatePicker } from './DatePicker'
import { FormField, FormSection } from './FormField'
import type { PensionFormInput } from '@/lib/pension/types'

interface Props {
  form: PensionFormInput
  setField: <K extends keyof PensionFormInput>(field: K, value: PensionFormInput[K]) => void
}

export function DatesSection({ form, setField }: Props) {
  const showDor = form.ptype !== 'ddservice'
  const showDod = form.ptype === 'ddservice' || form.ptype === 'daretirement'

  return (
    <FormSection title="Dates">
      <div className="space-y-3">
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
    </FormSection>
  )
}
