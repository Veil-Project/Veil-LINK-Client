import React, { useState, useEffect, useRef } from 'react'
import Portal from './Portal'
import Button from './UI/Button'
import useHotkeys from '@reecelucas/react-use-hotkeys'

const PasswordPrompt = ({ title, onCancel, onSubmit, disabled }: any) => {
  const [password, setPassword] = useState('')

  const passwordField = useRef<HTMLInputElement>(null)
  useEffect(() => {
    passwordField?.current?.focus()
  }, [passwordField])

  useHotkeys('Enter', () => {
    password && onSubmit(password)
  })

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
      >
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
      </div>
    </Portal>
  )
}

export default PasswordPrompt
