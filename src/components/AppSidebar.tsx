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
import PasswordPrompt from './PasswordPrompt'
import Confirm from './Confirm'
import Spinner from './UI/Spinner'

const SyncStatus = () => {
  const { state } = useStore()
  const { blockchain } = state

  if (!blockchain.initialBlockDownload || blockchain.isSynced) {
    return null
  }

  return (
    <div className="relative flex items-center justify-center h-12 px-4 text-sm leading-none bg-gray-600">
      <div
        className={`absolute left-0 top-0 bottom-0 bg-gray-600 z-0 candystripes`}
        style={{ width: `${blockchain.verificationProgress * 100}%` }}
      />
      <div className="relative z-10 leading-normal text-center">
        <div className="font-semibold">
          Syncing {(blockchain.verificationProgress * 100).toFixed(2)}%
        </div>
        <div className="text-xs text-gray-300">
          {blockchain.tip && (
            <span>
              {formatDate(new Date(blockchain.tip.date), 'short')}{' '}
              {formatTime(new Date(blockchain.tip.date), 'short')} /{' '}
            </span>
          )}
          Height: {blockchain?.tip?.height || blockchain.height}
        </div>
      </div>
    </div>
  )
}

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
        className={`w-6 h-6 flex items-center justify-center rounded pointer outline-none focus:outline-none ${
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

  const resetConnection = async () => {
    await actions.app.reset()
    await actions.app.load()
  }

  useHotkeys('Meta+o', openWallet)
  useHotkeys('Meta+b', backupWallet)

  return (
    <>
      <button
        onClick={toggleMenu}
        className={`flex items-center font-medium outline-none focus:outline-none h-6 pb-2px px-2 rounded ${
          isMenuOpen ? 'bg-blue-700' : 'hover:bg-blue-600'
        } active:bg-blue-700`}
      >
        {state.app.connectionMethod === 'rpc' ? 'RPC' : 'Wallet'}:{' '}
        {state.wallet.name ? `${state.wallet.name}` : 'Default'}
        <FiChevronDown className="mt-px text-teal-500 ml-2px" />
      </button>
      {isMenuOpen && (
        <div
          className="absolute z-10 mt-1 top-100"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            willChange: 'transform',
          }}
        >
          <WalletMenu
            connectionMethod={state.app.connectionMethod}
            onOpenWallet={openWallet}
            onBackupWallet={backupWallet}
            onDisconnect={resetConnection}
          />
        </div>
      )}
    </>
  )
}

const AppSidebar = () => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [requiresPassword, setRequiresPassword] = useState(false)
  const { addToast } = useToasts()
  const { state, actions } = useStore()
  const { staking, blockchain } = state

  useHotkeys('escape', () => {
    setShowConfirmation(false)
  })

  useEffect(() => {
    if (staking.error) {
      addToast(staking.error, { appearance: 'error' })
    }
  }, [staking.error, addToast])

  const lockWallet = () => {
    if (!showConfirmation) {
      setShowConfirmation(true)
    } else {
      setShowConfirmation(false)
      actions.staking.disable()
    }
  }

  const handleEnableStaking = async (password: string) => {
    const error = await actions.staking.enable(password)
    if (error) {
      addToast(error.message, { appearance: 'error' })
    } else {
      setRequiresPassword(false)
    }
  }

  const handleDisableStaking = async () => {
    const error = await actions.staking.disable()
    if (error) {
      addToast(error.message, { appearance: 'error' })
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
      {showConfirmation && (
        <Confirm
          title="Are you sure you want to lock the wallet and disable staking?"
          cancelLabel="Cancel"
          submitLabel="Lock wallet"
          onCancel={() => setShowConfirmation(false)}
          onSubmit={lockWallet}
        />
      )}
      <div className="relative z-10 bg-blue-500 pb-titlebar draggable">
        <div className="relative flex items-center px-1 h-titlebar">
          <div className="flex flex-1">
            {window.platform !== 'darwin' && <MenuButton />}
          </div>
          <div className="relative text-sm">
            <WalletMenuButton />
          </div>
          <div className="flex items-center justify-end flex-1">
            {blockchain.chain !== 'main' && (
              <span className="inline-block p-1 mr-1 text-xs font-semibold leading-none bg-orange-500 rounded-sm">
                {blockchain.chain}
              </span>
            )}
            <div className="p-1 mb-2px">
              {state.staking.isWorking ? (
                <div className="flex items-center justify-center w-6 h-6">
                  <Spinner size={8} strokeWidth={2} />
                </div>
              ) : state.wallet.locked ? (
                <button
                  onClick={() => setRequiresPassword(true)}
                  className="flex items-center justify-center w-6 h-6 rounded outline-none opacity-50 focus:outline-none pointer hover:opacity-100 hover:bg-blue-600 active:bg-blue-700"
                >
                  <FaLock size={14} title="Locked" />
                </button>
              ) : (
                <button
                  onClick={lockWallet}
                  className="flex items-center justify-center w-6 h-6 rounded outline-none focus:outline-none pointer hover:bg-blue-600 active:bg-blue-700"
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
        <div className="flex items-center justify-center h-24 px-6 text-center">
          <Balance />
        </div>
      </div>

      <div className="relative z-0 flex flex-col flex-1 overflow-y-auto">
        <UnspendableBalanceBlock />
        <StakingBlock
          onEnableStaking={() => setRequiresPassword(true)}
          onDisableStaking={handleDisableStaking}
        />
        <ReceivingAddressBlock />
      </div>

      <SyncStatus />
    </>
  )
}

export default AppSidebar
