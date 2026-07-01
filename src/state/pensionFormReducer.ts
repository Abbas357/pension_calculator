import { defaultRetirementDate } from '@/lib/pension/dateMath'
import type { PensionFormInput } from '@/lib/pension/types'
import { initialFormState, type PensionUiState } from './initialFormState'

export type PensionFormAction =
  | {
      type: 'SET_FIELD'
      field: keyof PensionFormInput
      value: PensionFormInput[keyof PensionFormInput]
    }
  | { type: 'HYDRATE'; state: PensionUiState }
  | { type: 'RESET' }

export function pensionFormReducer(
  state: PensionUiState,
  action: PensionFormAction,
): PensionUiState {
  switch (action.type) {
    case 'SET_FIELD': {
      const next = { ...state, [action.field]: action.value }

      // Keep DOR synced to DOB + 60 years (superannuation age) until the user edits DOR
      // themselves. Previously this only ran once (while dor was empty), so a stray
      // intermediate value while typing DOB — e.g. from a date input firing onChange before
      // all digits are entered — could "lock in" a wrong DOR that never updated again.
      if (action.field === 'dob' && typeof action.value === 'string' && action.value && state.dorAutoFilled) {
        next.dor = defaultRetirementDate(action.value)
      }
      if (action.field === 'dor') {
        next.dorAutoFilled = false
      }

      return next
    }
    case 'HYDRATE':
      return action.state
    case 'RESET':
      return initialFormState
    default:
      return state
  }
}
