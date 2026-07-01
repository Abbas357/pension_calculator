import type { PensionUiState } from '@/state/initialFormState'

const STORAGE_KEY = 'pension-calculator-form-state-v1'

export function loadPersistedForm(): PensionUiState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && 'ptype' in parsed && 'govt' in parsed) {
      return parsed as PensionUiState
    }
    return null
  } catch {
    return null
  }
}

export function savePersistedForm(state: PensionUiState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — persistence is best-effort.
  }
}

export function clearPersistedForm(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
