import { defaultRetirementDate } from '@/lib/pension/dateMath'
import type { PensionFormInput } from '@/lib/pension/types'
import { initialFormState } from './initialFormState'

export type PensionFormAction =
  | {
      type: 'SET_FIELD'
      field: keyof PensionFormInput
      value: PensionFormInput[keyof PensionFormInput]
    }
  | { type: 'RESET' }

export function pensionFormReducer(
  state: PensionFormInput,
  action: PensionFormAction,
): PensionFormInput {
  switch (action.type) {
    case 'SET_FIELD': {
      const next = { ...state, [action.field]: action.value }

      // Default DOR to DOB + 60 years (superannuation age) the first time DOB is filled.
      if (action.field === 'dob' && typeof action.value === 'string' && action.value && !state.dor) {
        next.dor = defaultRetirementDate(action.value)
      }

      return next
    }
    case 'RESET':
      return initialFormState
    default:
      return state
  }
}
