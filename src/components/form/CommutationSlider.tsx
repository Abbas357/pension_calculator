import { Slider } from '@/components/ui/slider'
import { FormField, FormSection } from './FormField'
import type { PensionFormInput } from '@/lib/pension/types'

interface Props {
  form: PensionFormInput
  setField: <K extends keyof PensionFormInput>(field: K, value: PensionFormInput[K]) => void
}

export function CommutationSlider({ form, setField }: Props) {
  if (form.ptype === 'ddservice') return null

  return (
    <FormSection title="Commutation">
      <FormField label="Commutation %" plain>
        <div className="flex items-center gap-3">
          <Slider
            min={0}
            max={35}
            step={1}
            value={[form.commutePct]}
            onValueChange={([v]) => setField('commutePct', v)}
            className="flex-1"
          />
          <span className="w-12 shrink-0 text-right font-semibold">{form.commutePct}%</span>
        </div>
      </FormField>
    </FormSection>
  )
}
