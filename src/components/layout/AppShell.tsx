import { useEffect, useRef, useState, type Dispatch } from 'react'
import { PensionForm } from '@/components/form/PensionForm'
import { ResultsPanel } from '@/components/results/ResultsPanel'
import { MobileResultsSheet } from '@/components/results/MobileResultsSheet'
import { PrintableReport } from '@/components/print/PrintableReport'
import { EXPORT_NODE_ID } from '@/components/results/ExportActions'
import { SavedUsersPanel } from '@/components/users/SavedUsersPanel'
import { MobileUsersSheet } from '@/components/users/MobileUsersSheet'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Users, ClipboardList } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Footer } from './Footer'
import { cn } from '@/lib/utils'
import { useSwipeDrawers } from '@/hooks/useSwipeDrawers'
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
  const [usersSheetOpen, setUsersSheetOpen] = useState(false)
  const [resultsSheetOpen, setResultsSheetOpen] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)
  const isFirstResult = useRef(true)
  useEffect(() => {
    if (isFirstResult.current) {
      isFirstResult.current = false
      return
    }
    const el = resultsRef.current
    if (!el) return
    el.classList.remove('animate-wobble')
    void el.offsetWidth
    el.classList.add('animate-wobble')
  }, [result, form.name])

  // Only one mobile drawer is ever open at a time — opening one closes the other.
  const openUsersSheet = (open: boolean) => {
    setUsersSheetOpen(open)
    if (open) setResultsSheetOpen(false)
  }
  const openResultsSheet = (open: boolean) => {
    setResultsSheetOpen(open)
    if (open) setUsersSheetOpen(false)
  }

  const {
    leftRef: usersSheetRef,
    rightRef: resultsSheetRef,
    leftProgress: usersSheetProgress,
    rightProgress: resultsSheetProgress,
  } = useSwipeDrawers({
    leftEnabled: hasSavedUsers,
    rightEnabled: true,
    leftOpen: usersSheetOpen,
    rightOpen: resultsSheetOpen,
    onLeftOpenChange: openUsersSheet,
    onRightOpenChange: openResultsSheet,
  })

  return (
    <>
      <div className="app-visible-root min-h-screen bg-gradient-to-br from-indigo-100 via-white to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <header className="sticky top-0 z-30 border-b border-white/20 bg-white/50 backdrop-blur-lg print:hidden dark:border-white/10 dark:bg-slate-950/50">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
            <div className="flex items-center gap-1">
              {hasSavedUsers && (
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="lg:hidden"
                  aria-label="Open saved users"
                  onClick={() => openUsersSheet(true)}
                >
                  <Users />
                </Button>
              )}
              <div>
                <h1 className="text-lg font-semibold">Pension Calculator</h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  Superannuation · Retiring · Death During Service · Death After Retirement
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon-lg"
                className="lg:hidden"
                aria-label="Open results"
                onClick={() => openResultsSheet(true)}
              >
                <ClipboardList />
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6">
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
            <div ref={resultsRef} className="hidden lg:block">
              <ResultsPanel
                result={result}
                pensionerName={form.name}
                onSaveUser={onSaveUser}
                onReset={() => dispatch({ type: 'RESET' })}
              />
            </div>
          </div>
        </main>

        <Footer />

        <MobileUsersSheet
          ref={usersSheetRef}
          open={usersSheetOpen}
          onOpenChange={openUsersSheet}
          progress={usersSheetProgress}
          savedUsers={savedUsers}
          onSelect={onLoadUser}
          onClear={onClearUsers}
          onDelete={onDeleteUser}
        />
        <MobileResultsSheet
          ref={resultsSheetRef}
          open={resultsSheetOpen}
          onOpenChange={openResultsSheet}
          progress={resultsSheetProgress}
          result={result}
          pensionerName={form.name}
          onSaveUser={onSaveUser}
          onReset={() => dispatch({ type: 'RESET' })}
        />
        <Toaster position="top-center" closeButton />
      </div>

      {result && (
        <PrintableReport id={EXPORT_NODE_ID} result={result} pensionerName={form.name} />
      )}
    </>
  )
}
