import React from 'react'
import { useStore } from 'store'
import { Link } from '@reach/router'
import { motion } from 'framer-motion'
import { version } from '../../package.json'

interface MenuLinkProps {
  onClick(): void
  label: string
  shortcut?: string
  to: string
}

const MenuLink = ({ onClick, label, to, shortcut }: MenuLinkProps) => (
  <Link
    to={to}
    tabIndex={-1}
    className="px-2 h-8 rounded flex items-center justify-between hover:bg-blue-500"
    onClick={onClick}
  >
    <span className="text-white">{label}</span>
    <span className="">{shortcut}</span>
  </Link>
)

interface MenuProps {
  onClickOption(): void
}

const AppMenu = ({ onClickOption }: MenuProps) => {
  const { state, actions } = useStore()

  const handleRestartDaemon = async () => {
    await actions.app.reload({ resetTransactions: false })
  }

  return (
    <motion.div
      style={{
        transformOrigin:
          window.platform === 'darwin' ? 'top right' : 'top left',
        backgroundColor: '#1a1e21ee',
        backdropFilter: 'blur(8px)',
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
          label="Settings"
          shortcut="⌘,"
          to="/settings"
        />
        <MenuLink
          onClick={onClickOption}
          label="Console"
          shortcut="C"
          to="/console"
        />
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
