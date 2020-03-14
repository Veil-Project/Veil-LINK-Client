import React, { useState, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../components/UI/Button'
import Sheet from '../components/UI/Sheet'
import { navigate, RouteComponentProps } from '@reach/router'
import classnames from 'classnames'
import { toast } from 'react-toastify'
import { useStore } from 'store'
import PasswordPrompt from 'components/PasswordPrompt'

interface AddressValidityProps {
  valid: boolean
}

const AddressValidity = ({ valid }: AddressValidityProps) => {
  const className = classnames(
    'text-xs font-medium h-6 px-2 rounded-sm leading-none flex items-center justify-center',
    {
      'text-green-800 bg-green-300': valid,
      'text-orange-800 bg-orange-300': !valid,
    }
  )

  return <div className={className}>{valid ? 'Valid' : 'Invalid'}</div>
}

const Send = (props: RouteComponentProps) => {
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [isAddressValid, setIsAddressValid] = useState(false)
  const { register, watch, handleSubmit, getValues, setValue } = useForm()
  const { state, effects } = useStore()
  const spendableBalance = state.balance.breakdown.ringctSpendable

  const checkAddressValidity = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    try {
      const { isvalid } = await effects.rpc.validateAddress(value)
      setIsAddressValid(isvalid)
    } catch (e) {
      alert('Unable to validate address')
      setIsAddressValid(false)
    }
  }

  const onSubmit = async (data: any) => {
    setRequiresPassword(true)
  }

  const sendTransaction = async (password: string) => {
    if (!password) return

    const { address, amount } = getValues()

    try {
      await effects.rpc.unlockWallet(password)
      await effects.rpc.sendStealthToStealth(address, amount)
      toast('Transaction sent!', { type: 'success' })
      navigate('/')
    } catch (e) {
      toast(e.message, { type: 'error' })
    } finally {
      effects.rpc.lockWallet()
    }
  }

  const watchAddress = watch('address')
  const watchAmount = watch('amount')

  return (
    <Sheet onClose={() => navigate('/')}>
      <h1 className="leading-none text-2xl font-semibold border-b-2 border-gray-500 pb-3 mb-8">
        Send Veil
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-1">
          <div className="relative">
            <textarea
              autoFocus
              rows={3}
              name="address"
              ref={register({ required: true })}
              onChange={checkAddressValidity}
              className="block bg-gray-100 text-gray-900 text-lg w-full rounded py-2 px-3 placeholder-gray-400 resize-none"
              placeholder="Recipient address"
            />
            {watchAddress && (
              <div className="absolute bottom-0 right-0 mr-2 mb-2">
                <AddressValidity valid={isAddressValid} />
              </div>
            )}
          </div>
          <div className="mt-4">
            <input
              type="text"
              name="amount"
              ref={register({ required: true, min: 1 })}
              className="block bg-gray-100 text-gray-900 text-lg w-full rounded py-2 px-3 placeholder-gray-400"
              placeholder="Amount to send"
            />
            <div className="text-sm text-gray-300 mt-1">
              Maximum available:{' '}
              <button onClick={() => setValue('amount', spendableBalance)}>
                {spendableBalance} Veil
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 flex">
          <Button
            primary
            size="lg"
            disabled={
              !isAddressValid ||
              !watchAmount ||
              watchAmount < 1 ||
              spendableBalance === 0
            }
            disabledClassName="bg-gray-500 opacity-100"
          >
            Send transaction
          </Button>
        </div>
      </form>

      {requiresPassword && (
        <PasswordPrompt
          title={`Send ${watchAmount} Veil`}
          onCancel={() => setRequiresPassword(false)}
          onSubmit={sendTransaction}
        />
      )}
    </Sheet>
  )
}

export default Send
