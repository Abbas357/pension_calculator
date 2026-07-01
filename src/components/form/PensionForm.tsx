import type { Dispatch } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { PensionTypeSelector } from './PensionTypeSelector'
import { ProvinceSelector } from './ProvinceSelector'
import { DatesSection } from './DatesSection'
import { EolSection } from './EolSection'
import { PaySection } from './PaySection'
import { CommutationSlider } from './CommutationSlider'
import { FormSectionTitle } from './FormField'
import type { PensionFormAction } from '@/state/pensionFormReducer'
import type { PensionFormInput } from '@/lib/pension/types'

interface Props {
  form: PensionFormInput
  dispatch: Dispatch<PensionFormAction>
  payWarning?: string | null
}

export function PensionForm({ form, dispatch, payWarning }: Props) {
  const setField = <K extends keyof PensionFormInput>(field: K, value: PensionFormInput[K]) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }

  return (
    <Card className="border-white/20 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg">Pension Details</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: 'RESET' })}
          className="text-muted-foreground"
        >
          <RotateCcw className="mr-1 size-3.5" /> Reset
        </Button>
      </CardHeader>
      <CardContent>
        <FormSectionTitle>Pension Type</FormSectionTitle>
        <PensionTypeSelector value={form.ptype} onChange={(v) => setField('ptype', v)} />
        <div className="mt-3">
          <ProvinceSelector value={form.govt} onChange={(v) => setField('govt', v)} />
        </div>

        <DatesSection form={form} setField={setField} />
        <EolSection form={form} setField={setField} />
        <PaySection form={form} setField={setField} payWarning={payWarning} />
        <CommutationSlider form={form} setField={setField} />
      </CardContent>
    </Card>
  )
}
