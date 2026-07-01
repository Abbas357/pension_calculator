import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Trash2, X, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { PENSION_TYPES } from '@/lib/pension/constants'
import type { SavedUser } from '@/lib/storage'

interface Props {
  savedUsers: SavedUser[]
  onSelect: (user: SavedUser) => void
  onClear: () => void
  onDelete: (user: SavedUser) => void
}

const PAGE_SIZE = 10

export function SavedUsersPanel({ savedUsers, onSelect, onClear, onDelete }: Props) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? savedUsers.filter((u) => u.name.toLowerCase().includes(q)) : savedUsers
  }, [savedUsers, query])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)

  const pageItems = useMemo(
    () => filteredUsers.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE),
    [filteredUsers, currentPage],
  )

  if (savedUsers.length === 0) return null

  return (
    <Card className="border-white/20 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <Users className="size-4" /> Saved Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            placeholder="Search people..."
            className="h-8 pl-8 text-sm"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">No matching users.</p>
        ) : (
          pageItems.map((user) => {
            const ptypeLabel = PENSION_TYPES.find((p) => p.value === user.form.ptype)?.label
            return (
              <div
                key={user.id}
                className="group relative w-full rounded-lg border border-border/60 bg-background/40 pr-8 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
              >
                <button type="button" onClick={() => onSelect(user)} className="block w-full px-3 py-2 text-left">
                  <div className="truncate font-medium">{user.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{ptypeLabel}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(parseISO(user.savedAt), 'dd MMM yyyy, HH:mm')}
                  </div>
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${user.name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(user)
                  }}
                  className="absolute right-1.5 top-1.5 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )
          })
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={currentPage === totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full text-destructive hover:text-destructive"
          onClick={onClear}
        >
          <Trash2 className="size-3.5" /> Clear
        </Button>
      </CardContent>
    </Card>
  )
}
