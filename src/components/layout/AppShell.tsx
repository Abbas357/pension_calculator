import type { Dispatch } from 'react'
import { PensionForm } from '@/components/form/PensionForm'
import { ResultsPanel } from '@/components/results/ResultsPanel'
import { MobileResultsSheet } from '@/components/results/MobileResultsSheet'
import { PrintableReport } from '@/components/print/PrintableReport'
import { EXPORT_NODE_ID } from '@/components/results/ExportActions'
import { SavedUsersPanel } from '@/components/users/SavedUsersPanel'
import { Toaster } from '@/components/ui/sonner'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'
import type { PensionFormAction } from '@/state/pensionFormReducer'
import type { PensionFormInput, PensionResult } from '@/lib/pension/types'
import type { SavedUser } from '@/lib/storage'

interface Props {
  form: PensionFormInput
  dispatch: Dispatch<PensionFormAction>
  result: PensionResult | null
  savedUsers: SavedUser[]
  onSaveUser: () => void
  onLoadUser: (user: SavedUser) => void
  onClearUsers: () => void
  onDeleteUser: (user: SavedUser) => void
}

export function AppShell({
  form,
  dispatch,
  result,
  savedUsers,
  onSaveUser,
  onLoadUser,
  onClearUsers,
  onDeleteUser,
}: Props) {
  const hasSavedUsers = savedUsers.length > 0

  return (
    <>
      <div className="app-visible-root min-h-screen bg-gradient-to-br from-indigo-100 via-white to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <header className="sticky top-0 z-30 border-b border-white/20 bg-white/50 backdrop-blur-lg print:hidden dark:border-white/10 dark:bg-slate-950/50">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-lg font-semibold">Pension Calculator</h1>
              <p className="text-xs text-muted-foreground">
                Superannuation · Retiring · Death During Service · Death After Retirement
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:pb-6">
          <div
            className={cn(
              'grid grid-cols-1 gap-6',
              hasSavedUsers ? 'lg:grid-cols-[16rem_minmax(0,1fr)_minmax(0,1fr)]' : 'lg:grid-cols-2',
            )}
          >
            {hasSavedUsers && (
              <div className="hidden lg:block">
                <SavedUsersPanel
                  savedUsers={savedUsers}
                  onSelect={onLoadUser}
                  onClear={onClearUsers}
                  onDelete={onDeleteUser}
                />
              </div>
            )}
            <PensionForm form={form} dispatch={dispatch} payWarning={result?.emoluments.payWarning} />
            <div className="hidden lg:block">
              <ResultsPanel result={result} pensionerName={form.name} onSaveUser={onSaveUser} />
            </div>
          </div>
        </main>

        <MobileResultsSheet result={result} pensionerName={form.name} onSaveUser={onSaveUser} />
        <Toaster position="top-center" />
      </div>

      {result && (
        <PrintableReport id={EXPORT_NODE_ID} result={result} pensionerName={form.name} />
      )}
    </>
  )
}
