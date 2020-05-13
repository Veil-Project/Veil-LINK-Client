import React, {
  ChangeEvent,
  MouseEvent,
  useRef,
  useEffect,
  useState,
  memo,
} from 'react'
import RpcClient from 'lib/veild-rpc'
import useHotkeys from '@reecelucas/react-use-hotkeys'
import Modal from 'components/UI/Modal'
import JsonViewer from 'components/JsonViewer'
import { useStore } from 'store'
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

const Console = () => {
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [password, setPassword] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [commandHistory, setCommandHistory] = useState<Command[]>([
    { input: '' },
  ])
  const [autoCompleteCommands, setAutoCompleteCommands] = useState<string[]>([])
  const [autoCompleteIndex, setAutoCompleteIndex] = useState(0)

  const { state, effects, actions } = useStore()
  const message = [...state.daemon.stdout].reverse()[0]
  const currentCommand = commandHistory[currentIndex].input
  const currentAutoCompleteCommand = autoCompleteCommands[autoCompleteIndex]

  useHotkeys('Meta+l', () => {
    if (isLoading) return
    setCurrentIndex(0)
    setCommandHistory([{ input: '' }])
  })
  useHotkeys('Enter', () => {
    if (isLoading && !password) return
    submitCommand()
  })
  useHotkeys('Control+c', () => {
    setPassword(undefined)
    setRequiresPassword(false)
    setIsLoading(false)
    resetCommand()
    setCurrentIndex(commandHistory.length - 1)
  })
  useHotkeys('ArrowUp', () => {
    if (isLoading) return
    if (autoCompleteCommands.length) {
      setAutoCompleteIndex(Math.max(autoCompleteIndex - 1, 0))
    } else {
      setCurrentIndex(Math.max(currentIndex - 1, 0))
    }
  })
  useHotkeys('ArrowDown', () => {
    if (isLoading) return
    if (autoCompleteCommands.length) {
      setAutoCompleteIndex(
        Math.min(autoCompleteIndex + 1, autoCompleteCommands.length - 1)
      )
    } else {
      setCurrentIndex(Math.min(currentIndex + 1, commandHistory.length - 1))
    }
  })
  useHotkeys(['Tab', 'ArrowRight'], () => {
    if (isLoading) return
    if (currentAutoCompleteCommand) {
      setCurrentCommand(currentAutoCompleteCommand)
    }
  })

  const setCurrentCommand = (command: string) => {
    const newCommands = [...commandHistory]
    newCommands[currentIndex].input = command
    setCommandHistory(newCommands)
  }

  const sendCommand = async (command: string): Promise<any> => {
    const response = await effects.rpc.sendCommand(command)
    return response || 'Command sent successfully'
  }

  const submitCommand = async () => {
    const command = currentAutoCompleteCommand || currentCommand
    if (!command || command === '') return

    console.log(currentIndex, command)

    if (command === 'exit') {
      actions.app.closeModal()
      return
    }

    setIsLoading(true)

    const newHistory = [...commandHistory].map(h => ({ ...h }))
    const lastEntry = newHistory[newHistory.length - 1]
    const currentEntry = newHistory[currentIndex]

    if (currentEntry.command) {
      // Reset the original command if editing history
      currentEntry.input = currentEntry.command
    }

    lastEntry.input = lastEntry.command = command
    setCommandHistory(newHistory)
    setCurrentIndex(newHistory.length - 1)

    const stakingWasActive = state.staking.isEnabled

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
      setRequiresPassword(false)
    } finally {
      if (password) {
        await effects.rpc.lockWallet()
        if (stakingWasActive) {
          await effects.rpc.unlockWalletForStaking(password)
        }
      }
      setPassword(undefined)
    }

    newHistory.push({ input: '' })
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
    setCurrentCommand(e.target.value)
  }

  const inputRef: React.RefObject<HTMLInputElement> = useRef(null)
  const commandsEndRef: React.RefObject<HTMLDivElement> = useRef(null)

  useEffect(() => {
    const matches = currentCommand
      ? Object.keys(RpcClient.callspec)
          .map(cmd => cmd.toLowerCase())
          .filter(
            cmd =>
              cmd.startsWith(currentCommand) &&
              (autoCompleteCommands.length > 1 || cmd !== currentCommand)
          )
      : []
    setAutoCompleteCommands(matches)
    setAutoCompleteIndex(0)
  }, [currentCommand, autoCompleteCommands.length])

  useEffect(() => {
    commandsEndRef.current?.scrollIntoView()
    inputRef.current?.focus()
  }, [commandHistory])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.selectionStart = inputRef.current.selectionEnd =
        inputRef.current.value.length
    }
  }, [currentIndex])

  return (
    <Modal className="flex flex-col h-full" canClose={!isLoading}>
      <div className="flex items-center justify-center flex-none h-12 bg-gray-500 draggable">
        Veil Console
      </div>
      <label className="flex flex-col flex-1 block w-full p-4 overflow-y-auto font-mono text-sm">
        <div>
          Welcome to the Veil RPC console.
          <br />
          Use up and down arrows to navigate history, and{' '}
          <span className="inline-flex items-center h-6 px-2 -my-2 align-middle bg-gray-700 rounded-sm">
            <span className="mr-1 text-lg">⌘</span>L
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
              className="w-full font-mono text-white bg-transparent outline-none"
              style={{ caretColor: '#8adeff' }}
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        ) : isLoading ? (
          <div className="text-gray-300">{message || 'Please wait…'}</div>
        ) : (
          <div className="relative">
            <div className="flex items-center text-teal-400">
              <span className="w-4">></span>
              <div className="relative w-full font-mono">
                <input
                  type="text"
                  className="relative z-10 w-full text-teal-400 bg-transparent outline-none"
                  style={{ caretColor: '#8adeff' }}
                  autoFocus
                  value={currentCommand}
                  onChange={handleChange}
                  disabled={isLoading}
                  ref={inputRef}
                />
                <div className="absolute inset-0 z-0 flex items-center text-gray-300">
                  {currentAutoCompleteCommand}
                </div>
              </div>
            </div>
            <div>
              {autoCompleteCommands.map((cmd, i) => (
                <div key={cmd} className="flex items-center">
                  <span className="w-4 text-teal-500">
                    {i === autoCompleteIndex && '•'}
                  </span>
                  <button
                    key={cmd}
                    className={`block ${
                      i === autoCompleteIndex
                        ? 'text-teal-500'
                        : 'hover:text-teal-500'
                    }`}
                    onClick={() => setCurrentCommand(cmd)}
                  >
                    {cmd}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </label>
      <div ref={commandsEndRef} />
    </Modal>
  )
}

export default Console
