import React, { useState, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../components/UI/Button'
import Sheet from '../components/UI/Sheet'
import { navigate, RouteComponentProps } from '@reach/router'
import classnames from 'classnames'
import { useToasts } from 'react-toast-notifications'
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
  const { addToast } = useToasts()
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
    sendTransaction()
  }

  const sendTransaction = async (password?: string) => {
    const { address, amount } = getValues()

    const stakingWasActive = state.staking.isEnabled

    try {
      if (password) await effects.rpc.unlockWallet(password)
      await effects.rpc.sendRingCtToRingCt(address, amount)
      addToast('Transaction sent!', { appearance: 'success' })
      navigate('/')
    } catch (e) {
      if (e.code === -13) {
        setRequiresPassword(true)
      } else {
        addToast(e.message, { appearance: 'error' })
      }
    } finally {
      if (password) {
        effects.rpc.lockWallet()
        if (stakingWasActive) {
          effects.rpc.unlockWalletForStaking(password)
        }
      }
    }
  }

  const watchAddress = watch('address')
  const watchAmount = watch('amount')

  return (
    <Sheet onClose={() => navigate('/')}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-sm w-full m-auto text-center"
      >
        <h1 className="mb-6 leading-none text-2xl font-bold">Send Veil</h1>

        <div className="bg-gray-700 rounded p-6">
          <div className="flex-1">
            <div className="relative">
              <textarea
                autoFocus
                rows={4}
                name="address"
                ref={register({ required: true })}
                onChange={checkAddressValidity}
                className="block bg-gray-600 text-white text-lg w-full rounded py-2 px-3 placeholder-gray-400 resize-none"
                placeholder="Recipient address"
              />
              {watchAddress && (
                <div className="absolute bottom-0 right-0 mr-2 mb-2">
                  <AddressValidity valid={isAddressValid} />
                </div>
              )}
            </div>
            <div className="mt-2 relative">
              <input
                type="text"
                name="amount"
                ref={register({ required: true, min: 1 })}
                className="block bg-gray-600 text-white text-lg w-full rounded py-2 px-3 placeholder-gray-400"
                placeholder="Amount to send"
              />
              <div className="absolute top-0 bottom-0 right-0 flex items-center pr-4 text-sm text-gray-300">
                Maximum:
                <button
                  className="ml-1 underline hover:text-white hover:no-underline"
                  onClick={e => {
                    e.preventDefault()
                    setValue('amount', spendableBalance)
                  }}
                >
                  {spendableBalance} Veil
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              primary
              size="xl"
              disabled={
                !isAddressValid ||
                !watchAmount ||
                watchAmount < 1 ||
                spendableBalance === 0
              }
              className="w-full"
              disabledClassName="bg-gray-500 opacity-100"
            >
              Send transaction
            </Button>
          </div>
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
