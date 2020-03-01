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
import Modal from 'components/UI/Modal'
import JsonViewer from 'components/JsonViewer'
import { useStore } from 'store'
import PasswordPrompt from 'components/PasswordPrompt'
import RPC_ERRORS from 'constants/rpcErrors'

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
  const [requiresPassword, setRequiresPassword] = useState()
  const [password, setPassword] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [commandHistory, setCommandHistory] = useState<Command[]>([
    { input: '' },
  ])

  const { state, effects } = useStore()
  const messages = state.daemon.stdout

  useHotkeys('Meta+l', () => {
    if (isLoading) return
    setCurrentIndex(0)
    setCommandHistory([{ input: '' }])
  })
  useHotkeys('Escape', () => {
    if (isLoading) return
    navigate('/')
  })
  useHotkeys('Enter', () => {
    if (isLoading && !password) return
    submitCommand()
  })
  useHotkeys('Control+c', () => {
    setPassword(null)
    setRequiresPassword(false)
    setIsLoading(false)
    resetCommand()
    setCurrentIndex(commandHistory.length - 1)
  })
  useHotkeys('ArrowUp', () => {
    if (isLoading) return
    setCurrentIndex(Math.max(currentIndex - 1, 0))
  })
  useHotkeys('ArrowDown', () => {
    if (isLoading) return
    setCurrentIndex(Math.min(currentIndex + 1, commandHistory.length - 1))
  })

  const sendCommand = async (command: string): Promise<any> => {
    const response = await effects.rpc.sendCommand(command)
    return response || 'Command sent successfully'
  }

  const submitCommand = async () => {
    setIsLoading(true)

    const command = commandHistory[currentIndex].input

    const newHistory = [...commandHistory]
    const lastEntry = newHistory[newHistory.length - 1]
    const currentEntry = newHistory[currentIndex]

    if (currentEntry.command) {
      // Reset the original command
      currentEntry.input = currentEntry.command
    }

    lastEntry.input = lastEntry.command = command
    newHistory.push({ input: '' })

    try {
      if (password) await effects.rpc.unlockWallet(password)
      lastEntry.reply = await sendCommand(command)
    } catch (e) {
      switch (e.code) {
        case RPC_ERRORS.RPC_WALLET_UNLOCK_NEEDED:
          setRequiresPassword(true)
          return
        case RPC_ERRORS.RPC_WALLET_PASSPHRASE_INCORRECT:
        default:
          lastEntry.error = e
      }
    } finally {
      setPassword(null)
      if (password) {
        setRequiresPassword(false)
        await effects.rpc.lockWallet()
      }
    }

    setCommandHistory(newHistory)
    setCurrentIndex(newHistory.length - 1)
    setIsLoading(false)

    inputRef.current?.focus()
  }

  const resetCommand = () => {
    const newHistory = [...commandHistory]
    const lastEntry = newHistory[newHistory.length - 1]
    lastEntry.input = lastEntry.command = ''
    setCommandHistory(newHistory)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newCommands = [...commandHistory]
    newCommands[currentIndex].input = e.target.value
    setCommandHistory(newCommands)
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

        {requiresPassword ? (
          <div className="flex items-center text-white">
            <span className="mr-2">Password:</span>
            <input
              type="password"
              className="w-full text-white bg-transparent outline-none font-mono"
              style={{ caretColor: '#8adeff' }}
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        ) : isLoading ? (
          <div className="text-gray-300">{messages[0] || 'Please wait…'}</div>
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
