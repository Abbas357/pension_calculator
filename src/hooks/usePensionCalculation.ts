import { useMemo } from 'react'
import { calculatePension } from '@/lib/pension/calculatePension'
import type { PensionFormInput, PensionResult } from '@/lib/pension/types'

export function usePensionCalculation(form: PensionFormInput): PensionResult | null {
  return useMemo(() => calculatePension(form), [form])
}
