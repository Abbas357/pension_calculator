import { useEffect, useReducer, useRef } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { pensionFormReducer, type PensionFormAction } from '@/state/pensionFormReducer'
import { initialFormState } from '@/state/initialFormState'
import { usePensionCalculation } from '@/hooks/usePensionCalculation'
import { clearPersistedForm, loadPersistedForm, savePersistedForm } from '@/lib/storage'

function App() {
  const [form, baseDispatch] = useReducer(
    pensionFormReducer,
    initialFormState,
    (initial) => loadPersistedForm() ?? initial,
  )
  const result = usePensionCalculation(form)
  const skipNextPersist = useRef(false)

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

  return <AppShell form={form} dispatch={dispatch} result={result} />
}

export default App
