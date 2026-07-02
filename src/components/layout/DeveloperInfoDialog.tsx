import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { WhatsappIcon, FacebookIcon, MailIcon } from './social-icons'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeveloperInfoDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}dp.jpg`}
              alt="Abbas Khan"
              className="size-14 shrink-0 rounded-full object-cover ring-1 ring-foreground/10"
            />
            <div>
              <DialogTitle>Abbas Khan</DialogTitle>
              <DialogDescription>Web Developer &amp; Programmer</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Web developer and programmer, currently working as Assistant Director IT in the
          Human Resource Management and Administration Department, Government of Khyber
          Pakhtunkhwa.
        </p>

        <div className="flex flex-col gap-2 text-sm">
          <a
            href="mailto:abbaskhan357@gmail.com"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-muted"
          >
            <MailIcon className="size-4 shrink-0 text-muted-foreground" />
            abbaskhan357@gmail.com
          </a>
          <a
            href="https://facebook.com/imAbbasKhan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-muted"
          >
            <FacebookIcon className="size-4 shrink-0 text-muted-foreground" />
            facebook.com/imAbbasKhan
          </a>
          <a
            href="https://wa.me/923130535333"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-muted"
          >
            <WhatsappIcon className="size-4 shrink-0 text-muted-foreground" />
            +92 313 0535333
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
