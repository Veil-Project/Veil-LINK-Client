import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from 'components/UI/Button'
import { useStore } from 'store'
import formatPath from 'utils/formatPath'

interface Props {
  onSubmit(options: any): void
}

const StartForm = ({ onSubmit }: Props) => {
  const [dataDirectory, setDataDirectory] = useState('')
  const { register, handleSubmit } = useForm()
  const { effects } = useStore()

  const chooseDataDirectory = async () => {
    const path = await effects.electron.openFolder()
    if (path && path.length) {
      setDataDirectory(path[0])
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-left p-6">
      <label className="block p-3 pb-2 bg-gray-600 rounded">
        <div className="leading-none text-teal-500 font-semibold text-sm">
          Network:
        </div>
        <select
          name="network"
          ref={register({ required: true })}
          className="appearance-none bg-transparent w-full pt-1 outline-none"
        >
          <option value="mainnet">mainnet</option>
          <option value="testnet">testnet</option>
          <option value="regtest">regtest</option>
          <option value="devnet">devnet</option>
        </select>
      </label>
      <label
        className="mt-1 block p-3 pb-2 bg-gray-600 rounded cursor-pointer"
        onClick={chooseDataDirectory}
      >
        <div className="leading-none text-teal-500 font-semibold text-sm">
          Data directory:
        </div>
        <input
          type="text"
          name="datadir"
          ref={register()}
          placeholder="Default"
          readOnly
          value={dataDirectory}
          className="appearance-none bg-transparent w-full pt-1 outline-none cursor-pointer"
        />
      </label>

      <div className="mt-6">
        <Button primary size="xl" className="w-full">
          Start wallet
        </Button>
      </div>
    </form>
  )
}

export default StartForm
