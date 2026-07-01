import type { Dispatch } from 'react'
import { PensionForm } from '@/components/form/PensionForm'
import { ResultsPanel } from '@/components/results/ResultsPanel'
import { MobileResultsSheet } from '@/components/results/MobileResultsSheet'
import { PrintableReport } from '@/components/print/PrintableReport'
import { EXPORT_NODE_ID } from '@/components/results/ExportActions'
import { ThemeToggle } from './ThemeToggle'
import type { PensionFormAction } from '@/state/pensionFormReducer'
import type { PensionFormInput, PensionResult } from '@/lib/pension/types'

interface Props {
  form: PensionFormInput
  dispatch: Dispatch<PensionFormAction>
  result: PensionResult | null
}

export function AppShell({ form, dispatch, result }: Props) {
  return (
    <>
      <div className="app-visible-root min-h-screen bg-gradient-to-br from-indigo-100 via-white to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <header className="sticky top-0 z-30 border-b border-white/20 bg-white/50 backdrop-blur-lg print:hidden dark:border-white/10 dark:bg-slate-950/50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-lg font-semibold">Pension Calculator</h1>
              <p className="text-xs text-muted-foreground">
                Superannuation · Retiring · Death During Service · Death After Retirement
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 pb-24 lg:pb-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PensionForm form={form} dispatch={dispatch} payWarning={result?.emoluments.payWarning} />
            <div className="hidden lg:block">
              <ResultsPanel result={result} pensionerName={form.name} />
            </div>
          </div>
        </main>

        <MobileResultsSheet result={result} pensionerName={form.name} />
      </div>

      {result && (
        <PrintableReport id={EXPORT_NODE_ID} result={result} pensionerName={form.name} />
      )}
    </>
  )
}
