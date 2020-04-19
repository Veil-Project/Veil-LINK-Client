import React, { useState, useEffect, MouseEvent } from 'react'
import { useStore } from 'store'
import { useToasts } from 'react-toast-notifications'
import useHotkeys from '@reecelucas/react-use-hotkeys'
import { MdMenu } from 'react-icons/md'
import { FaLock, FaLockOpen } from 'react-icons/fa'
import formatDate from 'utils/formatDate'
import moment from 'moment'

import Balance from './Balance'
import AppMenu from './AppMenu'
import formatTime from 'utils/formatTime'
import UnspendableBalanceBlock from './Sidebar/UnspendableBalanceBlock'
import StakingBlock from './Sidebar/StakingBlock'
import ReceivingAddressBlock from './Sidebar/ReceivingAddressBlock'
import { FiChevronDown } from 'react-icons/fi'
import WalletMenu from './WalletMenu'

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
          className={`absolute z-10 top-100 mt-1 ${
            window.platform === 'darwin' ? 'right-0' : 'left-0'
          }`}
          style={{ willChange: 'transform' }}
        >
          <AppMenu onClickOption={() => setIsMenuOpen(false)} />
        </div>
      )}
    </div>
  )
}

const WalletMenuButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state, effects, actions } = useStore()
  const { addToast } = useToasts()

  useEffect(() => {
    const closeDialog = () => setIsMenuOpen(false)
    document.addEventListener('click', closeDialog)
    return () => document.removeEventListener('click', closeDialog)
  }, [])

  const toggleMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.nativeEvent.stopImmediatePropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  const openWallet = async () => {
    if (state.app.connectionMethod === 'rpc') return

    setIsMenuOpen(false)
    const wallet = await effects.electron.openFolder({
      title: 'Open wallet',
      message:
        "Choose directory with a Veil wallet. If wallet doesn't exist a new one will be created.",
    })
    if (wallet) {
      await actions.daemon.configure({ wallet: wallet[0] })
      await actions.app.reload({ resetTransactions: true })
    }
  }

  const backupWallet = async () => {
    if (state.app.connectionMethod === 'rpc') return

    setIsMenuOpen(false)
    const destination = await effects.electron.showSaveDialog(
      {
        title: 'Choose backup destination',
        message: 'Choose backup destination',
        buttonLabel: 'Save',
        defaultPath: `wallet-${moment().format('YYYY-MM-DD-HH-mm-ss')}.dat`,
      },
      ['createDirectory']
    )
    if (destination) {
      await effects.rpc.backupWallet(destination)
      addToast('Wallet backed up successfully!', { appearance: 'success' })
    }
  }

  useHotkeys('Meta+o', openWallet)
  useHotkeys('Meta+b', backupWallet)

  if (state.app.connectionMethod === 'rpc') {
    return (
      <span className="font-medium">
        Wallet: {state.wallet.name ? `${state.wallet.name}` : 'Default'}
      </span>
    )
  }

  return (
    <>
      <button
        onClick={toggleMenu}
        className={`flex items-center font-medium outline-none h-6 pb-2px px-2 rounded ${
          isMenuOpen ? 'bg-blue-700' : 'hover:bg-blue-600'
        } active:bg-blue-700`}
      >
        Wallet: {state.wallet.name ? `${state.wallet.name}` : 'Default'}
        <FiChevronDown className="text-teal-500 mt-px ml-2px" />
      </button>
      {isMenuOpen && (
        <div
          className="absolute z-10 top-100 mt-1"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            willChange: 'transform',
          }}
        >
          <WalletMenu onOpenWallet={openWallet} onBackupWallet={backupWallet} />
        </div>
      )}
    </>
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
          <div className="text-sm relative">
            <WalletMenuButton />
          </div>
          <div className="flex-1 flex items-center justify-end">
            {blockchain.chain !== 'main' && (
              <span className="mr-1 text-xs font-semibold inline-block leading-none p-1 bg-orange-500 rounded-sm">
                {blockchain.chain}
              </span>
            )}
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
        <div className="h-12 px-4 bg-gray-600 flex justify-center items-center text-sm leading-none relative">
          <div
            className={`absolute left-0 top-0 bottom-0 bg-gray-500 z-0`}
            style={{ width: `${blockchain.verificationProgress * 100}%` }}
          />
          <div className="relative z-10 leading-snug text-center">
            <div className="font-medium">
              Syncing {(blockchain.verificationProgress * 100).toFixed(2)}%
            </div>
            {blockchain.tip && (
              <div className="text-xs text-gray-300">
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
