import React from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import Button from 'components/UI/Button'

interface ErrorProps {
  message: string
  onDismiss?(): void
}

const Error = ({ message, onDismiss }: ErrorProps) => (
  <div className="m-auto relative flex flex-col items-center">
    <FiAlertCircle size="48" className="text-orange-500" />
    <div className="w-64 text-center mt-4">
      <p>{message}</p>
      {onDismiss && (
        <Button className="mt-4" onClick={onDismiss}>
          Try again
        </Button>
      )}
    </div>
  </div>
)

export default Error
