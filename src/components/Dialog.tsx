import React from 'react'
import Portal from './Portal'
import Overlay from './Overlay'

interface DialogProps {
  title: string
  message?: string
  children: any
}

const Dialog = ({ title, message, children }: DialogProps) => {
  return (
    <Portal>
      <Overlay>
        <div className="bg-gray-700 text-white rounded-lg p-6 w-full max-w-sm shadow-lg">
          <div className="mb-6">
            <h1 className="font-semibold">{title}</h1>
            {message && <p className="mt-1 text-gray-300">{message}</p>}
          </div>
          {children}
        </div>
      </Overlay>
    </Portal>
  )
}

export default Dialog
