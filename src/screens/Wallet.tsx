import React, { useEffect } from 'react'
import useHotkeys from '@reecelucas/react-use-hotkeys'
import { useStore } from 'store'

import Home from './Home'
import About from './About'
import Help from './Help'
import Settings from './Settings'
import Configure from './Configure'
import Console from './Console'
import ChangePassword from './ChangePassword'
import ConvertLegacyCoins from './ConvertLegacyCoins'
import EncryptWallet from './EncryptWallet'

import AppSidebar from 'components/AppSidebar'
import Portal from 'components/Portal'
import Overlay from 'components/Overlay'
import DaemonWarmup from 'components/DaemonWarmup'
import AutoUpdater from 'components/AutoUpdater'

const Wallet = () => {
  const { state, actions } = useStore()
  const { modal } = state.app

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const updateAppData = async () => {
      await actions.app.update()
      timeout = setTimeout(updateAppData, 5 * 1000)
    }
    updateAppData()
    return () => {
      clearTimeout(timeout)
    }
  }, [actions.app])

  useHotkeys('Meta+,', () => {
    actions.app.openModal('settings')
  })

  useHotkeys('Meta+i', () => {
    actions.app.openModal('about')
  })

  useHotkeys('Meta+n', () => {
    actions.app.openModal('send')
  })

  useHotkeys('c', e => {
    if (modal !== 'console') e.preventDefault()
    actions.app.openModal('console')
  })

  if (!state.wallet.encrypted) {
    return <EncryptWallet />
  }

  return (
    <>
      <AutoUpdater />
      {state.app.isRestarting && (
        <Portal>
          <Overlay>
            <div
              className="p-6 text-white rounded-lg"
              style={{
                backgroundColor: '#23282cee',
                backdropFilter: 'blur(8px)',
              }}
            >
              <DaemonWarmup />
            </div>
          </Overlay>
        </Portal>
      )}

      <div className="flex flex-1 w-full">
        <div
          className="relative flex flex-col flex-none bg-gray-700"
          style={{ width: 310 }}
        >
          <AppSidebar />
        </div>
        <div
          className="relative flex flex-col flex-1 bg-gray-800"
          style={{ minWidth: 0 }}
        >
          <Home />
        </div>

        {modal === 'about' && <About />}
        {modal === 'help' && <Help />}
        {modal === 'settings' && <Settings />}
        {modal === 'configure' && <Configure />}
        {modal === 'console' && <Console />}
        {modal === 'convert' && <ConvertLegacyCoins />}
        {modal === 'change-password' && <ChangePassword />}
      </div>
    </>
  )
}

export default Wallet
