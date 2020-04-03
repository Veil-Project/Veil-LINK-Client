import React, { useState, useEffect } from 'react'
import { useStore } from 'store'
import { StakingStatus } from 'store/slices/staking'
import { MdMenu } from 'react-icons/md'
import { FaLock, FaLockOpen } from 'react-icons/fa'
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

interface SidebarBlockProps {
  title?: string
  children: any
}

interface StakingProps {
  currentStatus: StakingStatus
  requestedStatus: StakingStatus | null
  onEnable: any
}

const SidebarBlock = ({ title, children }: SidebarBlockProps) => (
  <section className="p-6">
    {title && (
      <header className="mb-4 leading-none">
        <h1 className="text-sm font-semibold">{title}</h1>
        <div className="h-2px w-8 mt-2 bg-teal-500" />
      </header>
    )}
    {children}
  </section>
)

const Staking = ({
  currentStatus,
  requestedStatus,
  onEnable,
}: StakingProps) => {
  switch (currentStatus) {
    case 'enabled':
      return requestedStatus === 'disabled' ? (
        <div>Disabling staking…</div>
      ) : (
        <div>TODO: staking details</div>
      )
    case 'disabled':
      return requestedStatus === 'enabled' ? (
        <Button size="sm" disabled>
          Please wait…
        </Button>
      ) : (
        <Button size="sm" onClick={onEnable}>
          Enable Staking
        </Button>
      )
  }
}

const AppSidebar = () => {
  const { addToast } = useToasts()
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state, actions } = useStore()
  const { blockchain, staking, balance } = state

  useEffect(() => {
    if (staking.error) {
      addToast(staking.error, { appearance: 'error' })
    }
  }, [staking.error])

  useEffect(() => {
    const closeDialog = () => isMenuOpen && setIsMenuOpen(false)
    document.addEventListener('click', closeDialog)
    return () => document.removeEventListener('click', closeDialog)
  }, [])

  useEffect(() => {
    actions.balance.fetch()
    actions.balance.fetchMarketPrice()
  }, [actions.balance])

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
            <div className="flex-1 flex justify-end">
              <div className="mr-2">
                {state.wallet.locked ? (
                  <FaLock title="Locked" className="opacity-50" />
                ) : (
                  <FaLockOpen title="Unlocked" className="text-teal-500" />
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
                    <AppMenu
                      onEnableStaking={() => setRequiresPassword(true)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-32 px-6 flex items-center justify-center text-center">
            {balance.spendable !== null && (
              <Balance
                veilBalance={balance.spendable}
                fiatBalance={balance.marketValue}
                currency="USD"
              />
            )}
          </div>
        </motion.div>
      </motion.div>

      <div className="flex-1 bg-gray-700 overflow-y-auto">
        {balance.legacyBalance > 0 && (
          <>
            <SidebarBlock>
              <div className="flex-none bg-gray-600 rounded p-6">
                <p className="mb-2 text-sm">
                  You have {balance.legacyBalance.toLocaleString()} legacy
                  coins.
                </p>
                <Button primary to="/convert">
                  Review &amp; Convert…
                </Button>
              </div>
            </SidebarBlock>
            <hr className="border-gray-800" />
          </>
        )}
        <SidebarBlock title="Staking">
          <div className="h-32 rounded flex items-center justify-center border border-gray-600 border-dashed text-sm text-gray-500">
            <Staking
              currentStatus={staking.status.current}
              requestedStatus={staking.status.requested}
              onEnable={() => setRequiresPassword(true)}
            />
            {requiresPassword && (
              <PasswordPrompt
                title="Enable staking"
                onCancel={() => setRequiresPassword(false)}
                onSubmit={(password: string) => handleEnableStaking(password)}
              />
            )}
          </div>
        </SidebarBlock>
        <hr className="border-gray-800" />
        <SidebarBlock title="Receive">
          <ReceivingAddress />
        </SidebarBlock>
      </div>
      {blockchain.initialBlockDownload && (
        <div className="py-4 px-6 bg-gray-600">
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
