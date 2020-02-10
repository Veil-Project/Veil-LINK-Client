import React, {
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  useRef,
  useEffect,
  useState,
  memo,
} from 'react'
import { navigate, RouteComponentProps } from '@reach/router'
import useHotkeys from '@reecelucas/react-use-hotkeys'
import api from 'api'
import Modal from 'components/UI/Modal'
import JsonViewer from 'components/JsonViewer'
import { useSelector } from 'react-redux'
import { getDaemonMessage } from 'store/slices/daemon'

interface Command {
  input: string
  command?: string
  reply?: string | object
  error?: { message: string }
}

interface CommandProps {
  command: string
  reply?: string | object
  error?: { message: string }
}

const Command = memo(({ command, reply, error }: CommandProps) => {
  const preventScroll = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()
  }

  const renderCommandReply = (reply: any) => {
    switch (typeof reply) {
      case 'object':
        return <JsonViewer src={reply} />
      default:
        return <pre className="whitespace-pre-wrap">{reply}</pre>
    }
  }

  return (
    <div>
      <div className="flex items-center text-teal-400">
        <span className="mr-2">></span>
        {command}
      </div>
      <div onClick={preventScroll}>
        {reply ? (
          renderCommandReply(reply)
        ) : (
          <pre className="text-red-400">{error && error.message}</pre>
        )}
      </div>
    </div>
  )
})

const Console = (props: RouteComponentProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [commandHistory, setCommandHistory] = useState<Command[]>([
    { input: '' },
  ])

  const message = useSelector(getDaemonMessage)

  useHotkeys('Meta+l', () => {
    if (isLoading) return
    setCurrentIndex(0)
    setCommandHistory([{ input: '' }])
  })
  useHotkeys('Escape', () => {
    navigate('/')
  })

  const sendCommand = async (command: string): Promise<any> => {
    try {
      const response = await api.sendCommand(command)
      return response || 'Command sent successfully'
    } catch (e) {
      if (e.code === -13) {
        const password = await window.promptForInput({
          title: 'Send command',
          label: 'Enter wallet password',
          inputAttrs: {
            type: 'password',
          },
        })

        if (password) {
          await api.unlockWallet(password)
          return await sendCommand(command)
        }
      }

      throw e
    } finally {
      await api.lockWallet()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newCommands = [...commandHistory]
    newCommands[currentIndex].input = e.target.value
    setCommandHistory(newCommands)
  }

  const handleKeyDown = async (
    e: KeyboardEvent<HTMLInputElement> & ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target

    switch (e.key) {
      case 'Enter':
        if (value === '') return

        setIsLoading(true)

        const newHistory = [...commandHistory]
        const lastEntry = newHistory[newHistory.length - 1]
        const currentEntry = newHistory[currentIndex]

        if (currentEntry.command) {
          // Reset the original command
          currentEntry.input = currentEntry.command
        }

        lastEntry.input = lastEntry.command = value
        newHistory.push({ input: '' })

        try {
          lastEntry.reply = await sendCommand(value)
        } catch (e) {
          lastEntry.error = e
        }

        setCommandHistory(newHistory)
        setCurrentIndex(newHistory.length - 1)
        setIsLoading(false)

        inputRef.current?.focus()
        break
      case 'ArrowDown':
        setCurrentIndex(Math.min(currentIndex + 1, commandHistory.length - 1))
        break
      case 'ArrowUp':
        setCurrentIndex(Math.max(currentIndex - 1, 0))
        break
    }
  }

  const inputRef: React.RefObject<HTMLInputElement> = useRef(null)
  const commandsEndRef: React.RefObject<HTMLDivElement> = useRef(null)

  useEffect(() => {
    commandsEndRef.current?.scrollIntoView()
  }, [commandHistory])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.selectionStart = inputRef.current.selectionEnd =
        inputRef.current.value.length
    }
  }, [currentIndex])

  return (
    <Modal onClose={() => navigate('/')} canClose={!isLoading}>
      <label className="block w-full flex flex-col p-4 overflow-y-auto font-mono text-sm">
        <div>
          Welcome to the Veil RPC console.
          <br />
          Use up and down arrows to navigate history, and{' '}
          <span className="inline-flex items-center bg-gray-700 rounded-sm h-6 align-middle -my-2 px-2">
            <span className="text-lg mr-1">⌘</span>L
          </span>{' '}
          to clear screen.
          <br />
          Type <span className="text-teal-400">help</span> for an overview of
          available commands.
          <br />
          For more information on using this console type{' '}
          <span className="text-teal-400">help-console</span>.<br />
        </div>
        <div className="text-red-400">
          WARNING: Scammers have been active, telling users to type commands
          here, stealing their wallet contents. Do not use this console without
          fully understanding the ramifications of a command.
        </div>
        {commandHistory
          .filter(cmd => cmd.command)
          .map((cmd: any, i: number) => (
            <Command {...cmd} key={i} />
          ))}

        {isLoading ? (
          <div className="text-gray-300">{message || 'Please wait…'}</div>
        ) : (
          <div className="flex items-center text-teal-400">
            <span className="mr-2">></span>
            <input
              type="text"
              className="w-full text-teal-400 bg-transparent outline-none font-mono"
              style={{ caretColor: '#8adeff' }}
              autoFocus
              value={commandHistory[currentIndex].input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              ref={inputRef}
            />
          </div>
        )}
      </label>
      <div ref={commandsEndRef} />
    </Modal>
  )
}

export default Console
