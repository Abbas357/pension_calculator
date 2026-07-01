import { Input } from '@/components/ui/input'
import { Combobox } from './Combobox'
import { FormField, FormSectionTitle } from './FormField'
import { BPS_OPTIONS } from '@/lib/pension/constants'
import type { PensionFormInput } from '@/lib/pension/types'

const BPS_COMBOBOX_OPTIONS = BPS_OPTIONS.map((bps) => ({ value: String(bps), label: `BPS-${bps}` }))

interface Props {
  form: PensionFormInput
  setField: <K extends keyof PensionFormInput>(field: K, value: PensionFormInput[K]) => void
  payWarning?: string | null
}

function numberField(
  form: PensionFormInput,
  setField: Props['setField'],
  field: keyof PensionFormInput,
  placeholder: string,
) {
  const value = form[field] as number
  return (
    <Input
      type="number"
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => setField(field, (Number(e.target.value) || 0) as PensionFormInput[typeof field])}
    />
  )
}

export function PaySection({ form, setField, payWarning }: Props) {
  return (
    <>
      <FormSectionTitle>Pay Details</FormSectionTitle>
      <div className="space-y-3">
        <FormField label="BPS / Grade" htmlFor="bps">
          <Combobox
            id="bps"
            value={form.bps ? String(form.bps) : ''}
            onChange={(v) => setField('bps', Number(v))}
            options={BPS_COMBOBOX_OPTIONS}
            placeholder="Select grade"
            searchPlaceholder="Search BPS..."
          />
        </FormField>
        <FormField label="Last Basic Pay" hint={payWarning ?? undefined}>
          {numberField(form, setField, 'basicPay', 'Without allowances')}
        </FormField>
        <FormField label="Special Pay">{numberField(form, setField, 'specialPay', 'If allowed')}</FormField>
        <FormField label="Personal Pay">{numberField(form, setField, 'personalPay', 'If allowed')}</FormField>
        <FormField label="Qualification Pay">
          {numberField(form, setField, 'qualificationPay', 'If allowed')}
        </FormField>
        <FormField label="Overseas Pay">{numberField(form, setField, 'overseasPay', 'If allowed')}</FormField>
        <FormField label="Senior Post Allowance">{numberField(form, setField, 'spa', 'If allowed')}</FormField>
        {form.bps > 19 && (
          <FormField label="Orderly Allowance">
            {numberField(form, setField, 'orderlyAllowance', 'If allowed')}
          </FormField>
        )}
        <FormField label="Other Pensionable Pay">
          {numberField(form, setField, 'otherPensionablePay', 'If allowed')}
        </FormField>
      </div>
    </>
  )
}
