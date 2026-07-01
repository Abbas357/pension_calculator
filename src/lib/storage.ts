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

export interface SavedUser {
  id: string
  name: string
  savedAt: string
  form: PensionUiState
}

const SAVED_USERS_KEY = 'pension-calculator-saved-users-v1'

export function loadSavedUsers(): SavedUser[] {
  try {
    const raw = localStorage.getItem(SAVED_USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistSavedUsers(users: SavedUser[]): void {
  try {
    localStorage.setItem(SAVED_USERS_KEY, JSON.stringify(users))
  } catch {
    // ignore
  }
}

/**
 * Saves a snapshot of the current form and returns the updated list. If a saved entry with
 * the same pensioner name already exists (case-insensitive), that entry is edited in place
 * instead of creating a duplicate.
 */
export function saveUser(form: PensionUiState): SavedUser[] {
  const name = form.name.trim() || 'Unnamed'
  const existing = loadSavedUsers()
  const existingIndex = existing.findIndex((u) => u.name.toLowerCase() === name.toLowerCase())

  const entry: SavedUser = {
    id: existingIndex >= 0 ? existing[existingIndex].id : (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : String(Date.now())),
    name,
    savedAt: new Date().toISOString(),
    form,
  }

  const next =
    existingIndex >= 0
      ? existing.map((u, i) => (i === existingIndex ? entry : u))
      : [entry, ...existing]

  persistSavedUsers(next)
  return next
}

/** Removes a single saved user and returns the updated list. */
export function deleteSavedUser(id: string): SavedUser[] {
  const next = loadSavedUsers().filter((u) => u.id !== id)
  persistSavedUsers(next)
  return next
}

export function clearSavedUsers(): void {
  try {
    localStorage.removeItem(SAVED_USERS_KEY)
  } catch {
    // ignore
  }
}
