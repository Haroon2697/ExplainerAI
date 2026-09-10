import { AlertTriangle } from 'lucide-react'
import { Modal, ModalHeader } from './Modal'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} size="max-w-md" labelledBy="confirm-title">
      <ModalHeader
        id="confirm-title"
        title={title}
        description={description}
        onClose={onCancel}
        icon={
          <div
            className={
              destructive
                ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-100'
                : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100'
            }
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
        }
      />
      <div className="flex items-center justify-end gap-3 rounded-b-2xl bg-ink-50/70 px-6 py-4" data-modal-stagger>
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm} autoFocus>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
