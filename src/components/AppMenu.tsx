import React, { useState, useEffect } from 'react'
import { useStore } from 'store'
import { useToasts } from 'react-toast-notifications'
import { motion } from 'framer-motion'
import { version } from '../../package.json'
import MenuLink from './MenuLink'

interface MenuProps {
  onClickOption(): void
}

const AppMenu = ({ onClickOption }: MenuProps) => {
  const [updateRequested, setUpdateRequested] = useState(false)
  const { state, actions } = useStore()
  const { addToast } = useToasts()

  useEffect(() => {
    if (updateRequested && state.autoUpdate.status === 'up-to-date') {
      addToast('No update available. Current version is up-to-date.', {
        appearance: 'info',
      })
    }
    setUpdateRequested(state.autoUpdate.status === 'checking')
  }, [state.autoUpdate.status, updateRequested])

  const handleRestartDaemon = async () => {
    await actions.app.reload({ resetTransactions: false })
  }

  const checkForUpdates = async () => {
    setUpdateRequested(true)
    actions.autoUpdate.checkForUpdates()
  }

  return (
    <motion.div
      style={{
        transformOrigin:
          window.platform === 'darwin' ? 'top right' : 'top left',
        backgroundColor: '#1a1e21f8',
        willChange: 'transform, opacity',
      }}
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={e => e.nativeEvent.stopImmediatePropagation()}
      className="w-48 bg-gray-700 text-sm text-gray-300 font-medium rounded shadow-lg"
    >
      <div className="flex flex-col p-2">
        <MenuLink
          onClick={onClickOption}
          label="About"
          shortcut={window.platform === 'darwin' ? '⌘I' : 'Win+I'}
          to="/about"
        />
        <MenuLink
          onClick={onClickOption}
          label="Settings"
          shortcut={window.platform === 'darwin' ? '⌘,' : 'Win+,'}
          to="/settings"
        />
        <MenuLink
          onClick={checkForUpdates}
          disabled={state.autoUpdate.status === 'checking'}
          label={
            state.autoUpdate.status === 'checking'
              ? 'Checking for updates…'
              : 'Check for updates'
          }
        />
        <MenuLink onClick={onClickOption} label="Help" to="/help" />
      </div>

      <div
        className="flex flex-col p-2 border-t"
        style={{ borderColor: 'rgba(255, 255, 255, .05)' }}
      >
        <MenuLink
          onClick={onClickOption}
          label="Console"
          shortcut="C"
          to="/console"
        />
        {state.app.connectionMethod === 'daemon' && (
          <MenuLink
            onClick={onClickOption}
            label="Edit configuration"
            to="/configure"
          />
        )}
        {state.app.connectionMethod === 'daemon' && (
          <MenuLink label="Restart Veil server" onClick={handleRestartDaemon} />
        )}
      </div>
      <div
        className="border-t py-3 pl-4 text-xs text-gray-400"
        style={{ borderColor: 'rgba(255, 255, 255, .05)' }}
      >
        Veil X: {version}
        <br />
        veild: {state.daemon.version}
      </div>
    </motion.div>
  )
}

export default AppMenu
