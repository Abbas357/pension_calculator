import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { FormField, FormSectionTitle } from './FormField'
import { BPS_OPTIONS } from '@/lib/pension/constants'
import type { PensionFormInput } from '@/lib/pension/types'

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
          <Select
            value={form.bps ? String(form.bps) : ''}
            onValueChange={(v) => setField('bps', Number(v))}
          >
            <SelectTrigger id="bps" className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {BPS_OPTIONS.map((bps) => (
                <SelectItem key={bps} value={String(bps)}>
                  BPS-{bps}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
