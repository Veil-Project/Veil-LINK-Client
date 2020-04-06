import React, { MouseEvent } from 'react'
import { useStore } from 'store'
import { Link } from '@reach/router'
import cx from 'classnames'
import { version } from '../../package.json'

interface MenuLinkProps {
  label: string
  to: string
}

const MenuLink = ({ label, to }: MenuLinkProps) => (
  <Link
    to={to}
    className="px-2 h-8 rounded flex items-center justify-start hover:text-white hover:bg-gray-500"
  >
    {label}
  </Link>
)

const AppMenu = () => {
  const { state, effects } = useStore()

  const handleRestartDaemon = async () => {
    await effects.daemon.stop()
  }

  return (
    <div className="w-48 bg-gray-600 border border-gray-800 text-sm text-gray-300 font-medium rounded shadow-lg">
      <div className="flex flex-col p-2">
        <MenuLink label="Settings" to="/settings" />
        <MenuLink label="Console" to="/console" />
      </div>

      {state.app.connectionMethod === 'daemon' && (
        <div className="border-t border-gray-500 p-2">
          <button
            className="block w-full px-2 h-8 rounded flex items-center justify-start font-medium hover:text-white hover:bg-gray-500"
            onClick={handleRestartDaemon}
          >
            Restart Veil server
          </button>
        </div>
      )}
      <div className="border-t border-gray-500 py-3 pl-4 text-xs text-gray-400">
        Veil X: {version}
        <br />
        veild: {state.daemon.version}
      </div>
    </div>
  )
}

export default AppMenu
