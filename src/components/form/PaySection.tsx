import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Combobox } from './Combobox'
import { FormField, FormSection } from './FormField'
import { BPS_OPTIONS } from '@/lib/pension/constants'
import type { PensionFormInput } from '@/lib/pension/types'
import { cn } from '@/lib/utils'

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
  const [showMore, setShowMore] = useState(false)

  return (
    <FormSection title="Pay Details">
      <div className="space-y-3">
        <FormField label="BPS / Grade" htmlFor="bps">
          <Combobox
            id="bps"
            value={form.bps ? String(form.bps) : ''}
            onChange={(v) => setField('bps', Number(v))}
            options={BPS_COMBOBOX_OPTIONS}
            searchPlaceholder="Search BPS..."
          />
        </FormField>
        <FormField label="Last Basic Pay" hint={payWarning ?? undefined}>
          {numberField(form, setField, 'basicPay', 'Without allowances')}
        </FormField>
        {(showMore || !!form.specialPay) && (
          <FormField label="Special Pay">{numberField(form, setField, 'specialPay', 'If allowed')}</FormField>
        )}
        {(showMore || !!form.personalPay) && (
          <FormField label="Personal Pay">{numberField(form, setField, 'personalPay', 'If allowed')}</FormField>
        )}
        {(showMore || !!form.qualificationPay) && (
          <FormField label="Qualification Pay">
            {numberField(form, setField, 'qualificationPay', 'If allowed')}
          </FormField>
        )}
        {(showMore || !!form.overseasPay) && (
          <FormField label="Overseas Pay">{numberField(form, setField, 'overseasPay', 'If allowed')}</FormField>
        )}
        {(showMore || !!form.spa) && (
          <FormField label="Senior Post Allowance">{numberField(form, setField, 'spa', 'If allowed')}</FormField>
        )}
        {form.bps > 19 && (showMore || !!form.orderlyAllowance) && (
          <FormField label="Orderly Allowance">
            {numberField(form, setField, 'orderlyAllowance', 'If allowed')}
          </FormField>
        )}
        {(showMore || !!form.otherPensionablePay) && (
          <FormField label="Other Pensionable Pay">
            {numberField(form, setField, 'otherPensionablePay', 'If allowed')}
          </FormField>
        )}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setShowMore((prev) => !prev)}
          className="w-full px-6 text-muted-foreground hover:text-foreground"
        >
          {showMore ? 'Show Less Pay Options' : 'Show All Pay Options'}
          <ChevronDown className={cn('transition-transform duration-200', showMore && 'rotate-180')} />
        </Button>
      </div>
    </FormSection>
  )
}
