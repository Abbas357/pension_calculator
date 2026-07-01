import { useReducer } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { pensionFormReducer } from '@/state/pensionFormReducer'
import { initialFormState } from '@/state/initialFormState'
import { usePensionCalculation } from '@/hooks/usePensionCalculation'

function App() {
  const [form, dispatch] = useReducer(pensionFormReducer, initialFormState)
  const result = usePensionCalculation(form)

  return <AppShell form={form} dispatch={dispatch} result={result} />
}

export default App
