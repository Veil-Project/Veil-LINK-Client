import React, { useState, useEffect, MouseEvent } from 'react'
import { useStore } from 'store'
import { MdMenu } from 'react-icons/md'
import { FaLock, FaLockOpen } from 'react-icons/fa'
import formatDate from 'utils/formatDate'

import Balance from './Balance'
import AppMenu from './AppMenu'
import StatusBar from './UI/StatusBar'
import formatTime from 'utils/formatTime'
import UnspendableBalanceBlock from './Sidebar/UnspendableBalanceBlock'
import StakingBlock from './Sidebar/StakingBlock'
import ReceivingAddressBlock from './Sidebar/ReceivingAddressBlock'

const MenuButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const closeDialog = () => setIsMenuOpen(false)
    document.addEventListener('click', closeDialog)
    return () => document.removeEventListener('click', closeDialog)
  }, [])

  const toggleMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.nativeEvent.stopImmediatePropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="relative">
      <button
        className={`w-6 h-6 flex items-center justify-center rounded pointer outline-none ${
          isMenuOpen ? 'bg-blue-700' : 'hover:bg-blue-600'
        } active:bg-blue-700`}
        onClick={toggleMenu}
      >
        <MdMenu size={18} />
      </button>
      {isMenuOpen && (
        <div
          className={`absolute z-10 top-0 ${
            window.platform === 'darwin' ? 'right-0' : 'left-0'
          }`}
        >
          <AppMenu onClickOption={() => setIsMenuOpen(false)} />
        </div>
      )}
    </div>
  )
}

const AppSidebar = () => {
  const { state, effects } = useStore()
  const { blockchain } = state

  const lockWallet = () => {
    effects.rpc.lockWallet()
  }

  return (
    <>
      <div className="pb-titlebar bg-blue-500 draggable">
        <div className="h-titlebar px-1 flex items-center relative">
          <div className="flex-1 flex">
            {window.platform !== 'darwin' && <MenuButton />}
          </div>
          <div className="text-sm font-medium">
            Veil Wallet{' '}
            {blockchain.chain !== 'main' && (
              <span className="ml-1 text-xs font-bold uppercase inline-block leading-none p-1 bg-orange-500 rounded-sm">
                {blockchain.chain}
              </span>
            )}
          </div>
          <div className="flex-1 flex items-center justify-end">
            <div className="p-1 mb-2px">
              {state.wallet.locked ? (
                <FaLock size={14} title="Locked" className="opacity-50" />
              ) : (
                <button
                  onClick={lockWallet}
                  className="w-6 h-6 flex items-center justify-center rounded pointer outline-none hover:bg-blue-600 active:bg-blue-700"
                >
                  <FaLockOpen
                    size={14}
                    title="Unlocked"
                    className="text-teal-500"
                  />
                </button>
              )}
            </div>
            {window.platform === 'darwin' && <MenuButton />}
          </div>
        </div>
        <div className="h-24 px-6 flex items-center justify-center text-center">
          <Balance />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        {state.balance.unspendableBalance > 0 && <UnspendableBalanceBlock />}
        <StakingBlock />
        <ReceivingAddressBlock />
      </div>

      {(blockchain.initialBlockDownload ||
        blockchain.verificationProgress < 0.98) && (
        <div className="pt-4 pb-2px px-4 bg-gray-600">
          <StatusBar progress={blockchain.verificationProgress * 100} />
          <div className="h-8 flex justify-between items-center text-xs leading-none text-gray-300">
            <div>
              Syncing {(blockchain.verificationProgress * 100).toFixed(2)}%
            </div>
            {blockchain.tip && (
              <div className="">
                {formatDate(new Date(blockchain.tip.date), 'short')}{' '}
                {formatTime(new Date(blockchain.tip.date), 'short')} / Height:{' '}
                {blockchain.tip.height}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default AppSidebar
