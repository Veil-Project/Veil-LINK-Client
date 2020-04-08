import React, { useState, useEffect } from 'react'
import { useStore } from 'store'
import { useToasts } from 'react-toast-notifications'

import ReceivingAddress from 'components/ReceivingAddress'
import Button from 'components/UI/Button'
import PasswordPrompt from 'components/PasswordPrompt'
import { FiCopy, FiRefreshCw } from 'react-icons/fi'
import SidebarBlock from './SidebarBlock'

const ReceivingAddressBlock = () => {
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const { state, actions, effects } = useStore()
  const { addToast } = useToasts()
  const { currentReceivingAddress } = state.wallet

  useEffect(() => {
    actions.wallet.fetchReceivingAddress()
  }, [actions.wallet])

  const handleRegenerateAddress = async (password?: string) => {
    setIsRegenerating(true)

    const stakingWasActive = state.staking.isEnabled

    try {
      if (password) await effects.rpc.unlockWallet(password)
      await actions.wallet.generateReceivingAddress()
      setRequiresPassword(false)
      addToast('Ready to receive Veil on the new address!', {
        appearance: 'info',
      })
    } catch (e) {
      if (e.code === -13) {
        setRequiresPassword(true)
      } else {
        addToast(e.message, { appearance: 'error' })
      }
    } finally {
      if (password) {
        await effects.rpc.lockWallet()
        if (stakingWasActive) {
          await effects.rpc.unlockWalletForStaking(password)
        }
      }
    }
    setIsRegenerating(false)
  }

  const handleAddressCopy = () => {
    if (!currentReceivingAddress) return
    window.clipboard.writeText(currentReceivingAddress)
    addToast('Copied to clipboard!', { appearance: 'info' })
  }

  return (
    <>
      {requiresPassword && (
        <PasswordPrompt
          title="Generate receiving address"
          onCancel={() => setRequiresPassword(false)}
          onSubmit={(password: string) => handleRegenerateAddress(password)}
          disabled={isRegenerating}
        />
      )}
      <SidebarBlock
        title="Receiving Address"
        titleAccessory={
          currentReceivingAddress && (
            <div className="pr-2">
              <button
                className="p-2 font-semibold text-teal-500 hover:text-white outline-none"
                onClick={handleAddressCopy}
              >
                <FiCopy size="14" />
              </button>
              <button
                className="p-2 font-semibold text-teal-500 hover:text-white outline-none"
                onClick={() => handleRegenerateAddress()}
              >
                <FiRefreshCw size="14" />
              </button>
            </div>
          )
        }
      >
        <ReceivingAddress address={currentReceivingAddress} />
        {!currentReceivingAddress && (
          <>
            <div className="mt-4 flex">
              <Button
                primary
                className="w-full"
                onClick={() => handleRegenerateAddress()}
              >
                Generate address
              </Button>
            </div>
          </>
        )}
      </SidebarBlock>
    </>
  )
}

export default ReceivingAddressBlock
