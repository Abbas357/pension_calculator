import { useState } from 'react'
import { DeveloperInfoDialog } from './DeveloperInfoDialog'
import { WhatsappIcon, XIcon } from './social-icons'

export function Footer() {
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <>
      <footer className="print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-4 text-xs text-muted-foreground">
          <span>
            Developed by{' '}
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Abbas Khan
            </button>
          </span>
          <span aria-hidden="true">·</span>
          <a
            href="https://wa.me/923130535333"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <WhatsappIcon className="size-3.5" />
            WhatsApp
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://x.com/abbas877"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <XIcon className="size-3.5" />
            X
          </a>
        </div>
      </footer>
      <DeveloperInfoDialog open={infoOpen} onOpenChange={setInfoOpen} />
    </>
  )
}
