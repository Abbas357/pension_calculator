import { useEffect, useReducer, useRef, useState } from 'react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout/AppShell'
import { pensionFormReducer, type PensionFormAction } from '@/state/pensionFormReducer'
import { initialFormState } from '@/state/initialFormState'
import { usePensionCalculation } from '@/hooks/usePensionCalculation'
import {
  clearPersistedForm,
  clearSavedUsers,
  deleteSavedUser,
  loadPersistedForm,
  loadSavedUsers,
  savePersistedForm,
  saveUser,
  type SavedUser,
} from '@/lib/storage'

function App() {
  const [form, baseDispatch] = useReducer(
    pensionFormReducer,
    initialFormState,
    (initial) => loadPersistedForm() ?? initial,
  )
  const result = usePensionCalculation(form)
  const skipNextPersist = useRef(false)
  const [savedUsers, setSavedUsers] = useState<SavedUser[]>(() => loadSavedUsers())

  useEffect(() => {
    if (skipNextPersist.current) {
      skipNextPersist.current = false
      return
    }
    savePersistedForm(form)
  }, [form])

  const dispatch = (action: PensionFormAction) => {
    if (action.type === 'RESET') {
      clearPersistedForm()
      skipNextPersist.current = true
    }
    baseDispatch(action)
  }

  const handleSaveUser = () => {
    const name = form.name.trim() || 'Unnamed'
    const alreadyExists = savedUsers.some((u) => u.name.toLowerCase() === name.toLowerCase())
    setSavedUsers(saveUser(form))
    if (alreadyExists) {
      toast.info(`${name} already exists. Saved details updated.`)
    } else {
      toast.success(`${name} saved.`)
    }
  }

  const handleLoadUser = (user: SavedUser) => {
    dispatch({ type: 'HYDRATE', state: user.form })
  }

  const handleClearUsers = () => {
    clearSavedUsers()
    setSavedUsers([])
    toast.success('All saved users cleared.')
  }

  const handleDeleteUser = (user: SavedUser) => {
    setSavedUsers(deleteSavedUser(user.id))
    toast.success(`${user.name} removed.`)
  }

  return (
    <AppShell
      form={form}
      dispatch={dispatch}
      result={result}
      savedUsers={savedUsers}
      onSaveUser={handleSaveUser}
      onLoadUser={handleLoadUser}
      onClearUsers={handleClearUsers}
      onDeleteUser={handleDeleteUser}
    />
  )
}

export default App
