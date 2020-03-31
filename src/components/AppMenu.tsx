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

interface AppMenuProps {
  onEnableStaking(): void
}

const AppMenu = ({ onEnableStaking }: AppMenuProps) => {
  const { state, actions, effects } = useStore()
  const { staking, daemon } = state

  const handleDisableStaking = (e: MouseEvent<HTMLDivElement>) => {
    e.nativeEvent.stopImmediatePropagation()
    actions.staking.disable()
  }

  const handleEnableStaking = (e: MouseEvent<HTMLDivElement>) => {
    e.nativeEvent.stopImmediatePropagation()
    onEnableStaking()
  }

  const stakingEnabled =
    staking.status.current === 'enabled' ||
    staking.status.requested === 'enabled'

  const handleRestartDaemon = async () => {
    await effects.daemon.stop()
  }

  const stakingToggleClass = cx('rounded-full p-2px flex w-8', {
    'bg-blue-500 justify-end':
      (staking.status.current === 'enabled' && !staking.status.requested) ||
      staking.status.requested === 'enabled',
    'bg-gray-700 justify-start':
      (staking.status.current === 'disabled' && !staking.status.requested) ||
      staking.status.requested === 'disabled',
  })

  return (
    <div className="w-48 bg-gray-600 border border-gray-800 text-sm text-gray-300 font-medium rounded shadow-lg">
      <div className="flex flex-col p-2">
        <MenuLink label="Settings" to="/settings" />
        <MenuLink label="Console" to="/console" />
      </div>
      <div className="border-t border-gray-500 flex items-center justify-between p-4">
        <div>Staking</div>
        <div
          onClick={stakingEnabled ? handleDisableStaking : handleEnableStaking}
          className={stakingToggleClass}
        >
          <div className="w-4 h-4 bg-white rounded-full pointer-events-none" />
        </div>
      </div>
      <div className="border-t border-gray-500 p-2">
        <button
          className="block w-full px-2 h-8 rounded flex items-center justify-start font-medium hover:text-white hover:bg-gray-500"
          onClick={handleRestartDaemon}
        >
          Restart Veil server
        </button>
      </div>
      <div className="border-t border-gray-500 py-3 pl-4 text-xs text-gray-400">
        Veil X: {version}
        <br />
        Veil Core: {state.daemon.version}
      </div>
    </div>
  )
}

export default AppMenu
