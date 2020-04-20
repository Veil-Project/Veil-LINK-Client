import React from 'react'
import Button from './UI/Button'
import Dialog from './Dialog'

interface ConfirmProps {
  title: string
  message?: string
  cancelLabel: string
  submitLabel: string
  onSubmit(): void
  onCancel(): void
}

const Confirm = ({
  title,
  message,
  cancelLabel,
  submitLabel,
  onCancel,
  onSubmit,
}: ConfirmProps) => {
  return (
    <Dialog title={title} message={message}>
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={onCancel}>{cancelLabel}</Button>
        <Button primary onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </Dialog>
  )
}

export default Confirm
