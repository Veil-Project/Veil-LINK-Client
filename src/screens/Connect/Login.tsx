import React from 'react'
import ConnectToRpc from 'components/ConnectToRpc'

const Login = ({ setMode }: { setMode: Function }) => {
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
            <ConnectToRpc />
          </div>
        </div>
      </div>
      <footer className="text-sm text-gray-400">
        <div>
          <button
            onClick={() => setMode('install')}
            className="underline hover:text-white hover:no-underline"
          >
            Use managed veild
          </button>
        </div>
      </footer>
    </>
  )
}

export default Login
