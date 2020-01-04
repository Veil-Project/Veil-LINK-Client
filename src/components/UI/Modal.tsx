import React from 'react'

interface ModalProps {
  children: any
}

const Modal = ({ children }: ModalProps) => (
  <div className="w-full max-w-2xl flex rounded-lg bg-gray-600 border border-gray-800 shadow-lg overflow-hidden relative">
    {children}
  </div>
)

export default Modal