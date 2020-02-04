import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MdMenu } from 'react-icons/md'

import {
  enableStaking,
  getStakingStatus,
  StakingStatus,
  getBlockchainInfo,
} from 'store/slices/wallet'
import {
  getSpendableBalance,
  getTotalMarketValue,
  fetchBalance,
  fetchMarketPrice,
  getLegacyBalance,
} from 'store/slices/balance'

import Balance from './Balance'
import AppMenu from './AppMenu'
import ReceivingAddress from './ReceivingAddress'
import Button from './UI/Button'
import StatusBar from './UI/StatusBar'

interface SidebarBlockProps {
  title: string
  children: any
}

interface StakingProps {
  currentStatus: StakingStatus
  requestedStatus: StakingStatus | null
  onEnable: any
}

const SidebarBlock = ({ title, children }: SidebarBlockProps) => (
  <section className="">
    <header className="mb-4 leading-none">
      <h1 className="text-sm font-semibold">{title}</h1>
      <div className="h-2px w-8 mt-2 bg-teal-500" />
    </header>
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const blockchainInfo = useSelector(getBlockchainInfo)
  const stakingStatus = useSelector(getStakingStatus)
  const spendableBalance = useSelector(getSpendableBalance)
  const legacyBalance = useSelector(getLegacyBalance)
  const marketValue = useSelector(getTotalMarketValue)
  const dispatch = useDispatch()

  useEffect(() => {
    const closeDialog = () => isMenuOpen && setIsMenuOpen(false)
    document.addEventListener('click', closeDialog)
    return () => document.removeEventListener('click', closeDialog)
  })

  useEffect(() => {
    dispatch(fetchBalance())
    dispatch(fetchMarketPrice())
    const updateInterval = setInterval(() => {
      dispatch(fetchBalance())
    }, 1000)
    return () => {
      clearInterval(updateInterval)
    }
  }, [dispatch])

  const handleEnableStaking = () => {
    dispatch(enableStaking())
  }

  return (
    <aside className="flex-none flex flex-col relative" style={{ width: 360 }}>
      <div className="bg-blue-500 draggable">
        <div className="h-titlebar -mb-titlebar px-titlebar flex items-center relative">
          <div className="flex-1" />
          <div className="text-sm font-medium">
            Veil Wallet{' '}
            {blockchainInfo.chain !== 'main' && (
              <span className="ml-1 text-xs font-bold uppercase inline-block leading-none p-1 bg-orange-500 rounded-sm">
                {blockchainInfo.chain}
              </span>
            )}
          </div>
          <div className="flex-1 flex justify-end">
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
                  <AppMenu version="0.1alpha" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="h-32 px-6 flex items-center justify-center text-center">
          {spendableBalance !== null && (
            <Balance
              veilBalance={spendableBalance}
              fiatBalance={marketValue}
              currency="USD"
            />
          )}
        </div>
      </div>
      <div className="flex-1 bg-gray-800 overflow-y-auto p-6">
        <SidebarBlock title="Staking">
          <div className="h-32 rounded flex items-center justify-center border border-gray-600 border-dashed text-sm text-gray-500">
            <Staking
              currentStatus={stakingStatus.current}
              requestedStatus={stakingStatus.requested}
              onEnable={handleEnableStaking}
            />
          </div>
        </SidebarBlock>
        <hr className="my-6 border-b border-gray-700" />
        <SidebarBlock title="Receive">
          <ReceivingAddress />
        </SidebarBlock>
      </div>
      {legacyBalance > 0 && (
        <div className="flex-none bg-gray-600 p-6">
          <p className="mb-2 text-sm">
            You have {legacyBalance.toLocaleString()} legacy coins.
          </p>
          <Button size="sm" primary to="/convert">
            Review &amp; Convert…
          </Button>
        </div>
      )}
      {blockchainInfo.initialBlockDownload && (
        <div className="py-4 px-6 bg-gray-800">
          <StatusBar
            progress={blockchainInfo.verificationProgress * 100}
            label={`Syncing ${(
              blockchainInfo.verificationProgress * 100
            ).toFixed(2)}%`}
          />
        </div>
      )}
    </aside>
  )
}

export default AppSidebar
