import React, { useState } from 'react'
import { useStore } from 'store'
import { useToasts } from 'react-toast-notifications'
import Loading from 'screens/Loading'
import RPC_ERRORS from 'constants/rpcErrors'
import ConnectionForm from './ConnectionForm'
import LoginForm from './LoginForm'

const ConnectToRpc = () => {
  const { addToast } = useToasts()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [warmupMessage, setWarmupMessage] = useState()
  const [isEditingConnection, setIsEditingConnection] = useState(false)
  const [connection, setConnection] = useState({
    protocol: 'http',
    host: 'localhost',
    port: '58812',
  })
  const { effects, actions } = useStore()

  const handleError = ({ message, code }: any) => {
    switch (code) {
      case RPC_ERRORS.RPC_IN_WARMUP:
        setWarmupMessage(message)
        setTimeout(async () => {
          await loadBlockchain()
        }, 500)
        break
      case undefined:
        setWarmupMessage(null)
        addToast(message, { appearance: 'error' })
        break
    }
  }

  const loadBlockchain = async () => {
    const error = await actions.blockchain.load()
    if (error) {
      handleError(error)
    } else {
      actions.app.connectViaRpc()
    }
  }

  const handleLogin = async (data: any) => {
    setIsSubmitting(true)
    effects.rpc.initialize({
      ...connection,
      ...data,
    })
    await loadBlockchain()
    setIsSubmitting(false)
  }

  const saveConnectionSettings = (data: any) => {
    setConnection(data)
    setIsEditingConnection(false)
  }

  if (warmupMessage) {
    return (
      <div className="p-6 bg-gray-700 rounded-lg">
        <Loading message={warmupMessage} />
      </div>
    )
  }

  return (
    <>
      {isEditingConnection && (
        <div className="p-6 bg-gray-700 rounded-lg">
          <ConnectionForm
            defaultValues={connection}
            onSubmit={saveConnectionSettings}
          />
        </div>
      )}
      <div className={isEditingConnection ? 'hidden' : ''}>
        <div className="p-6 bg-gray-700 rounded-lg">
          <LoginForm
            defaultValues={{}}
            onSubmit={handleLogin}
            disabled={isSubmitting}
          />
        </div>
        <footer className="text-sm leading-snug text-center text-gray-400">
          <div className="mt-4">
            Connecting to{' '}
            <button
              className="border-b border-gray-400 border-dotted hover:text-white"
              onClick={() => setIsEditingConnection(true)}
            >
              {connection.protocol}://{connection.host}:{connection.port}
            </button>
          </div>
        </footer>
      </div>
    </>
  )
}

export default ConnectToRpc
