import React from 'react'
import { useStore } from 'store'
import { motion } from 'framer-motion'
import { version } from '../../package.json'
import MenuLink from './MenuLink'

interface MenuProps {
  onClickOption(): void
}

const AppMenu = ({ onClickOption }: MenuProps) => {
  const { state, actions, effects } = useStore()

  const handleRestartDaemon = async () => {
    await actions.app.reload({ resetTransactions: false })
  }

  const checkForUpdates = async () => {
    await effects.electron.checkForUpdates()
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
          shortcut="⌘I"
          to="/about"
        />
        <MenuLink
          onClick={onClickOption}
          label="Console"
          shortcut="C"
          to="/console"
        />
        <MenuLink
          onClick={onClickOption}
          label="Settings"
          shortcut="⌘,"
          to="/settings"
        />
        {state.app.connectionMethod !== 'rpc' && (
          <MenuLink
            onClick={onClickOption}
            label="Edit Config"
            to="/configure"
          />
        )}
        <MenuLink onClick={onClickOption} label="Help" to="/help" />
      </div>

      <div className="flex flex-col p-2">
        <MenuLink onClick={checkForUpdates} label="Check for updates" />
      </div>

      {state.app.connectionMethod === 'daemon' && (
        <div
          className="border-t p-2"
          style={{ borderColor: 'rgba(255, 255, 255, .05)' }}
        >
          <button
            className="block w-full px-2 h-8 rounded flex items-center justify-start font-medium text-white hover:bg-blue-500"
            onClick={handleRestartDaemon}
          >
            Restart Veil server
          </button>
        </div>
      )}
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
