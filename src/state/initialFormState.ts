import type { PensionFormInput } from '@/lib/pension/types'

/** UI-only state layered on top of the pure calculation input: tracks whether the user has
 * manually edited Date of Retirement, so the DOB->DOR auto-fill knows whether it's still safe
 * to keep syncing (see pensionFormReducer.ts). */
export interface PensionUiState extends PensionFormInput {
  dorAutoFilled: boolean
}

export const initialFormState: PensionUiState = {
  ptype: 'superannuation',
  govt: 'kpk',
  name: '',
  dob: null,
  doa: null,
  dor: null,
  dod: null,
  eolEnabled: false,
  eolYears: 0,
  eolMonths: 0,
  eolDays: 0,
  bps: 0,
  basicPay: 0,
  specialPay: 0,
  personalPay: 0,
  qualificationPay: 0,
  overseasPay: 0,
  spa: 0,
  orderlyAllowance: 0,
  otherPensionablePay: 0,
  commutePct: 35,
  dorAutoFilled: true,
}
