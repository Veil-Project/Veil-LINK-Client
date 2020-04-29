import React, { useEffect } from 'react'
import { Router, RouteComponentProps, navigate } from '@reach/router'
import useHotkeys from '@reecelucas/react-use-hotkeys'
import { useToasts } from 'react-toast-notifications'
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
import UpdateNotification from 'components/UpdateNotification'
import UpdateProgress from 'components/UpdateProgress'

const Wallet = (props: RouteComponentProps) => {
  const { state, actions } = useStore()
  const { addToast } = useToasts()

  useEffect(() => {
    switch (state.autoUpdate.status) {
      case 'pending':
        actions.autoUpdate.checkForUpdates()
        break
      case 'error':
        addToast(`An error occured when updating. ${state.autoUpdate.error}`, {
          appearance: 'error',
        })
        break
    }
  }, [state.autoUpdate.status])

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
    navigate('/settings')
  })

  useHotkeys('Meta+i', () => {
    navigate('/about')
  })

  useHotkeys('Meta+n', () => {
    navigate('/send')
  })

  useHotkeys('c', () => {
    navigate('/console')
  })

  if (!state.wallet.encrypted) {
    return <EncryptWallet />
  }

  return (
    <>
      {state.autoUpdate.status === 'update-available' && <UpdateNotification />}
      {state.autoUpdate.status === 'installing' && <UpdateProgress />}
      {state.app.isRestarting && (
        <Portal>
          <Overlay>
            <div
              className="text-white p-6 rounded-lg"
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

      <div className="flex-1 w-full flex">
        <div
          className="flex-none bg-gray-700 flex flex-col relative"
          style={{ width: 310 }}
        >
          <AppSidebar />
        </div>
        <div
          className="flex-1 flex flex-col bg-gray-800 relative"
          style={{ minWidth: 0 }}
        >
          <Home />
        </div>

        <Router>
          <About path="/about/*" />
          <Help path="/help" />
          <Settings path="/settings/*" />
          <Configure path="/configure" />
          <Console path="/console" />
          <ConvertLegacyCoins path="/convert" />
          <ChangePassword path="/change-password" />
        </Router>
      </div>
    </>
  )
}

export default Wallet
