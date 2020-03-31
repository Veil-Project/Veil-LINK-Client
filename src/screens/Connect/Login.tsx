import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from 'components/UI/Button'
import { useStore } from 'store'
import { toast } from 'react-toastify'
import Loading from 'screens/Loading'
import RPC_ERRORS from 'constants/rpcErrors'

const LoginForm = ({
  onSubmit,
  defaultValues,
  disabled = false,
}: {
  onSubmit(data: any): void
  defaultValues: {}
  disabled?: boolean
}) => {
  const { register, handleSubmit } = useForm(defaultValues)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-700 rounded-lg p-6"
    >
      <div className="bg-gray-500 rounded">
        <input
          autoFocus
          type="password"
          name="user"
          ref={register({ required: true })}
          className="block h-12 bg-transparent text-white w-full rounded-t px-3 placeholder-gray-400 resize-none"
          placeholder="rpcuser"
        />
        <input
          type="password"
          name="pass"
          ref={register({ required: true })}
          className="block h-12 bg-transparent border-t border-gray-700 text-white w-full rounded-b px-3 placeholder-gray-400"
          placeholder="rpcpassword"
        />
      </div>

      <div className="mt-4">
        <Button primary size="lg" disabled={disabled} className="h-12 w-full">
          Connect now
        </Button>
      </div>
    </form>
  )
}

const ConnectionForm = ({
  onSubmit,
  defaultValues,
}: {
  onSubmit(data: any): void
  defaultValues: {}
}) => {
  const { register, handleSubmit } = useForm({ defaultValues })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-700 rounded-lg p-6 w-full max-w-xs"
    >
      <div className="bg-gray-500 rounded">
        <select
          autoFocus
          name="protocol"
          ref={register({ required: true })}
          className="block h-12 bg-transparent text-white w-full rounded-t px-3 appearance-none placeholder-gray-400 resize-none"
          placeholder="protocol"
        >
          <option value="http">http</option>
          <option value="https">https</option>
        </select>
        <input
          type="text"
          name="host"
          ref={register({ required: true })}
          className="block h-12 bg-transparent border-t border-gray-700 text-white w-full rounded-b px-3 placeholder-gray-400"
          placeholder="host"
        />
        <input
          type="text"
          name="port"
          ref={register({ required: true })}
          className="block h-12 bg-transparent border-t border-gray-700 text-white w-full rounded-b px-3 placeholder-gray-400"
          placeholder="port"
        />
      </div>

      <div className="mt-4">
        <Button primary size="lg" className="h-12 w-full">
          Save
        </Button>
      </div>
    </form>
  )
}

const Login = ({ setMode }: { setMode: Function }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [warmupMessage, setWarmupMessage] = useState()
  const [isEditingConnection, setIsEditingConnection] = useState(false)
  const [connection, setConnection] = useState({
    protocol: 'http',
    host: 'localhost',
    port: '8332',
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
        toast(message, { type: 'error' })
        break
    }
  }

  const loadBlockchain = async () => {
    const error = await actions.blockchain.load()
    if (error) {
      handleError(error)
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
    return <Loading message={warmupMessage} />
  }

  return (
    <>
      <div className="my-auto">
        <header>
          <h2 className="text-2xl font-bold">Connect to veild</h2>
          <p className="mt-1 text-lg text-gray-300">
            Enter the values you used for the
            <span className="inline-block mx-1 text-base font-medium font-mono h-6 rounded-sm bg-gray-500 px-2 text-white align-baseline">
              --rpcuser
            </span>{' '}
            and
            <span className="inline-block mx-1 text-base font-medium font-mono h-6 rounded-sm bg-gray-500 px-2 text-white align-baseline">
              --rpcpassword
            </span>{' '}
            options.
          </p>
        </header>
        <div className="mt-8">
          <div className="flex-1 flex flex-col">
            {isEditingConnection ? (
              <ConnectionForm
                defaultValues={connection}
                onSubmit={saveConnectionSettings}
              />
            ) : (
              <>
                <LoginForm
                  defaultValues={{}}
                  onSubmit={handleLogin}
                  disabled={isSubmitting}
                />
                <footer className="text-sm text-center leading-snug text-gray-400">
                  <div className="mt-4">
                    Connecting to{' '}
                    <button
                      className="border-b border-dotted border-gray-400 hover:text-white"
                      onClick={() => setIsEditingConnection(true)}
                    >
                      {connection.protocol}://{connection.host}:
                      {connection.port}
                    </button>
                  </div>
                </footer>
              </>
            )}
          </div>
        </div>
      </div>
      <footer className="text-sm text-gray-400">
        <div>
          <button
            onClick={() => setMode('install')}
            className="underline hover:text-white hover:no-underline"
          >
            Use managed Veil Core
          </button>
        </div>
      </footer>
    </>
  )
}

export default Login
