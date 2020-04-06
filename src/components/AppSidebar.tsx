import React, { useState, useEffect } from 'react'
import { useStore } from 'store'
import { StakingStatus } from 'store/slices/staking'
import { MdMenu, MdChevronRight, MdContentCopy } from 'react-icons/md'
import { FaLock, FaLockOpen, FaChevronRight, FaCopy } from 'react-icons/fa'
import { motion } from 'framer-motion'
import formatDate from 'utils/formatDate'

import Balance from './Balance'
import AppMenu from './AppMenu'
import ReceivingAddress from './ReceivingAddress'
import Button from './UI/Button'
import StatusBar from './UI/StatusBar'
import PasswordPrompt from './PasswordPrompt'
import { useToasts } from 'react-toast-notifications'
import formatTime from 'utils/formatTime'
import { Link } from '@reach/router'
import {
  FiChevronDown,
  FiChevronUp,
  FiTriangle,
  FiCopy,
  FiRefreshCcw,
  FiRefreshCw,
} from 'react-icons/fi'
import StakingOverview from './StakingOverview'
import useStickyState from 'hooks/useStickyState'

interface SidebarBlockProps {
  title?: string
  titleAccessory?: any
  children: any
}

interface StakingProps {
  isAvailable: boolean
  currentStatus: StakingStatus
  requestedStatus: StakingStatus | null
  onEnable: any
}

const SidebarBlock = ({
  title,
  titleAccessory,
  children,
}: SidebarBlockProps) => {
  const [isOpen, setIsOpen] = useStickyState(`sidebar-block-${title}`, true)
  return (
    <div className="mb-px">
      <div
        className="h-8 flex justify-between font-semibold text-xs leading-none bg-gray-600 cursor-default"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <motion.div
            className="w-4 flex items-center justify-center"
            animate={{ rotate: isOpen ? 90 : 0 }}
          >
            <FaChevronRight size={8} />
          </motion.div>
          {title}
        </div>
        <motion.div
          transition={{ duration: 0.1 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          onClick={e => e.stopPropagation()}
        >
          {titleAccessory}
        </motion.div>
      </div>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  )
}

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

const UnspendableBalanceBlock = () => {
  const { state } = useStore()
  const { balance } = state

  return (
    <SidebarBlock title="Unspendable Balances">
      <div className="leading-relaxed text-sm">
        {balance.unconfirmedBalance !== null && balance.unconfirmedBalance > 0 && (
          <div className="flex justify-between items-baseline font-medium">
            <span className="">Unconfirmed</span>
            <span className="h-px bg-gray-600 flex-1 mx-2" />
            <span className="text-teal-500">
              {balance.unconfirmedBalance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              Veil
            </span>
          </div>
        )}
        {balance.immatureBalance !== null && balance.immatureBalance > 0 && (
          <div className="flex justify-between items-baseline font-medium">
            <span className="">Immature</span>
            <span className="h-px bg-gray-600 flex-1 mx-2" />
            <span className="text-teal-500">
              {balance.immatureBalance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              Veil
            </span>
          </div>
        )}
        {balance.legacyBalance !== null && balance.legacyBalance > 0 && (
          <>
            <div className="flex justify-between items-baseline font-medium">
              <span className="">Legacy</span>
              <span className="h-px bg-gray-600 flex-1 mx-2" />
              <span className="text-teal-500">
                {balance.legacyBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                Veil
              </span>
            </div>
            <div className="text-xs mb-1">
              <Link
                to="/convert"
                className="underline text-gray-300 hover:text-white hover:no-underline"
              >
                Convert legacy balance…
              </Link>
            </div>
          </>
        )}
      </div>
    </SidebarBlock>
  )
}

const StakingBlock = () => {
  const [requiresPassword, setRequiresPassword] = useState(false)
  const { addToast } = useToasts()
  const { state, actions } = useStore()
  const { staking } = state

  useEffect(() => {
    if (staking.error) {
      addToast(staking.error, { appearance: 'error' })
    }
  }, [staking.error])

  const handleEnableStaking = async (password: string) => {
    const error = await actions.staking.enable(password)
    if (error) {
      addToast(error.message, { appearance: 'error' })
    } else {
      setRequiresPassword(false)
    }
  }

  return (
    <>
      {requiresPassword && (
        <PasswordPrompt
          title="Enable staking"
          onCancel={() => setRequiresPassword(false)}
          onSubmit={(password: string) => handleEnableStaking(password)}
        />
      )}
      <SidebarBlock title="Staking Overview">
        <StakingOverview
          isDimmed={staking.status.current === 'disabled'}
          data={[150, 400, 250, 100, 0, 50, 500]}
        />
        {staking.status.current === 'disabled' && (
          <div className="mt-4 grid">
            <StakingButton
              isAvailable={staking.isAvailable}
              currentStatus={staking.status.current}
              requestedStatus={staking.status.requested}
              onEnable={() => setRequiresPassword(true)}
            />
          </div>
        )}
      </SidebarBlock>
    </>
  )
}

const StakingButton = ({
  isAvailable,
  currentStatus,
  requestedStatus,
  onEnable,
}: StakingProps) => {
  switch (currentStatus) {
    case 'enabled':
      return null
    case 'disabled':
      return isAvailable ? (
        <Button
          primary
          onClick={onEnable}
          disabled={requestedStatus === 'enabled'}
        >
          Enable staking
        </Button>
      ) : (
        <div className="h-9 text-center text-sm font-semibold flex items-center justify-center rounded bg-gray-600 text-gray-300 pb-px">
          Staking unavailable
        </div>
      )
  }
}

const AppSidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state, actions, effects } = useStore()
  const { blockchain, staking, balance } = state

  useEffect(() => {
    const closeDialog = () => isMenuOpen && setIsMenuOpen(false)
    document.addEventListener('click', closeDialog)
    return () => document.removeEventListener('click', closeDialog)
  }, [])

  const lockWallet = () => {
    effects.rpc.lockWallet()
  }

  return (
    <>
      <motion.div className="bg-blue-500 draggable">
        <motion.div
          initial={{ opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.1, ease: 'easeOut' }}
          animate={{ opacity: 1 }}
        >
          <div className="h-titlebar -mb-titlebar px-titlebar flex items-center relative">
            <div className="flex-1" />
            <div className="text-sm font-medium">
              Veil Wallet{' '}
              {blockchain.chain !== 'main' && (
                <span className="ml-1 text-xs font-bold uppercase inline-block leading-none p-1 bg-orange-500 rounded-sm">
                  {blockchain.chain}
                </span>
              )}
            </div>
            <div className="flex-1 flex items-center justify-end">
              <div className="mr-3">
                {state.wallet.locked ? (
                  <FaLock size={14} title="Locked" className="opacity-50" />
                ) : (
                  <button onClick={lockWallet}>
                    <FaLockOpen
                      size={14}
                      title="Unlocked"
                      className="text-teal-500"
                    />
                  </button>
                )}
              </div>
              <button
                className={`p-1 -m-1 rounded pointer outline-none ${
                  isMenuOpen ? 'bg-blue-700' : 'hover:bg-blue-600'
                } active:bg-blue-700`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MdMenu size={18} />
              </button>
              {isMenuOpen && (
                <div
                  className="absolute z-10 top-0 ml-titlebar mt-titlebar"
                  style={{ left: '100%' }}
                >
                  <div className="-m-1">
                    <AppMenu />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-32 px-6 flex items-center justify-center text-center">
            <Balance />
          </div>
        </motion.div>
      </motion.div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        <UnspendableBalanceBlock />
        <StakingBlock />
        <ReceivingAddressBlock />
      </div>

      {blockchain.initialBlockDownload && (
        <div className="py-4 px-6">
          <StatusBar progress={blockchain.verificationProgress * 100} />
          <div className="mt-2 flex justify-between text-sm text-gray-300">
            <div>
              Syncing {(blockchain.verificationProgress * 100).toFixed(2)}%
            </div>
            <div className="">
              {blockchain.tip
                ? formatDate(new Date(blockchain.tip.date), 'medium')
                : 'Loading…'}{' '}
              {blockchain.tip &&
                formatTime(new Date(blockchain.tip.date), 'medium')}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AppSidebar
