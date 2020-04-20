import React, { useState, useEffect, useRef } from 'react'
import Portal from './Portal'
import Button from './UI/Button'
import useHotkeys from '@reecelucas/react-use-hotkeys'
import Overlay from './Overlay'

const PasswordPrompt = ({ title, onCancel, onSubmit, disabled }: any) => {
  const [password, setPassword] = useState('')

  const passwordField = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const { current } = passwordField
    if (current && !disabled) {
      current.focus()
      current.setSelectionRange(0, current.value.length)
    }
  }, [passwordField, disabled])

  useHotkeys('Enter', () => {
    password && onSubmit(password)
  })

  return (
    <Portal>
      <Overlay>
        <div className="bg-gray-700 rounded-lg p-6 w-full max-w-xs shadow-lg">
          <header className="text-center mb-4">
            <div className="text-white">{title}</div>
            <div className="text-gray-400">Enter your wallet password:</div>
          </header>
          <div className="bg-gray-500 rounded">
            <input
              autoFocus
              type="password"
              className="block h-10 bg-transparent text-white w-full rounded px-3 placeholder-gray-400 resize-none outline-none"
              placeholder="Password"
              value={password}
              ref={passwordField}
              disabled={disabled}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-4 flex">
            <Button disabled={disabled} className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              primary
              disabled={disabled}
              className="flex-1 ml-4"
              onClick={() => password && onSubmit(password)}
            >
              OK
            </Button>
          </div>
        </div>
      </Overlay>
    </Portal>
  )
}

export default PasswordPrompt
