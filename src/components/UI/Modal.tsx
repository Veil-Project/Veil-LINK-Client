import React, { MouseEvent } from 'react'
import { FiX } from 'react-icons/fi'
import Portal from 'components/Portal'
import Overlay from 'components/Overlay'

interface ModalProps {
  children: any
  id?: string
  className?: string
  canClose?: boolean
  hideClose?: boolean
  onClose?(event: MouseEvent<HTMLButtonElement>): void
}

const Modal = ({
  children,
  id = 'modal',
  className,
  onClose,
  canClose,
  hideClose,
}: ModalProps) => (
  <Portal id={id}>
    <Overlay>
      <div
        className={`rounded-lg shadow-lg overflow-hidden relative text-white ${className}`}
        style={{ backgroundColor: '#353b43f8' }}
      >
        {!hideClose && (
          <button
            onClick={onClose}
            disabled={!canClose}
            className={
              'rounded-full h-12 w-12 flex items-center justify-center absolute top-0 right-0 z-50 ' +
              (canClose
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-400 cursor-not-allowed')
            }
          >
            <FiX size="20" />
          </button>
        )}
        {children}
      </div>
    </Overlay>
  </Portal>
)

export default Modal
