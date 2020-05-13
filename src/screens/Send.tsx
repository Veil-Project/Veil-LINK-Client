import React, { useState, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../components/UI/Button'
import Sheet from '../components/UI/Sheet'
import classnames from 'classnames'
import { useToasts } from 'react-toast-notifications'
import { useStore } from 'store'
import PasswordPrompt from 'components/PasswordPrompt'
import Toggle from 'components/UI/Toggle'

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

const MIN_FEE = 0.0001

const Send = () => {
  const { addToast } = useToasts()
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [isAddressValid, setIsAddressValid] = useState(false)
  const [subtractFees, setSubtractFees] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const { register, watch, handleSubmit, getValues, setValue } = useForm()
  const { state, effects, actions } = useStore()
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
    setIsSending(true)

    const stakingWasActive = state.staking.isEnabled

    try {
      if (password) await effects.rpc.unlockWallet(password)
      await effects.rpc.setTxFee(MIN_FEE)
      await effects.rpc.sendRingCtToRingCt(address, amount, subtractFees)
      setRequiresPassword(false)
      addToast('Transaction sent!', { appearance: 'success' })
      actions.app.closeModal()
    } catch (e) {
      if (e.code === -13) {
        setRequiresPassword(true)
      } else {
        addToast(e.message, { appearance: 'error' })
      }
    } finally {
      if (password && !requiresPassword) {
        effects.rpc.lockWallet()
        if (stakingWasActive) {
          effects.rpc.unlockWalletForStaking(password)
        }
      }
      setIsSending(false)
    }
  }

  const watchAddress = watch('address')
  const watchAmount = watch('amount')

  const isSendingMaxAmount =
    parseFloat(watchAmount) >= spendableBalance - MIN_FEE

  return (
    <Sheet onClose={() => actions.app.closeModal()}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm m-auto text-center"
      >
        <h1 className="mb-6 text-2xl font-bold leading-none">Send Veil</h1>

        <div className="p-6 bg-gray-700 rounded">
          <div className="flex-1">
            <div className="relative">
              <textarea
                autoFocus
                rows={4}
                name="address"
                ref={register({ required: true })}
                onChange={checkAddressValidity}
                className="block w-full px-3 py-2 text-lg text-white placeholder-gray-400 bg-gray-600 rounded resize-none"
                placeholder="Recipient address"
              />
              {watchAddress && (
                <div className="absolute bottom-0 right-0 mb-2 mr-2">
                  <AddressValidity valid={isAddressValid} />
                </div>
              )}
            </div>
            <div className="relative mt-2">
              <input
                type="text"
                name="amount"
                ref={register({ required: true, min: 1 })}
                className="block w-full px-3 py-2 text-lg text-white placeholder-gray-400 bg-gray-600 rounded"
                placeholder="Amount to send"
              />
              <div className="absolute top-0 bottom-0 right-0 flex items-center pr-4 text-sm text-gray-300">
                Max:
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
          <div className="flex mt-4">
            <Toggle
              on={subtractFees || isSendingMaxAmount}
              disabled={isSendingMaxAmount}
              onToggle={setSubtractFees}
              label="Subtract fees from amount"
            />
          </div>
          <div className="flex justify-center mt-6">
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
          disabled={isSending}
          onCancel={() => setRequiresPassword(false)}
          onSubmit={sendTransaction}
        />
      )}
    </Sheet>
  )
}

export default Send
