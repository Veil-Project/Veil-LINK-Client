import React, { MouseEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from '@reach/router'
import cx from 'classnames'

import {
  getStakingStatus,
  enableStaking,
  disableStaking,
} from 'store/slices/wallet'
import api from 'api'

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
  version: string
}

const AppMenu = ({ version }: AppMenuProps) => {
  const stakingStatus = useSelector(getStakingStatus)
  const dispatch = useDispatch()

  const handleToggleStaking = (e: MouseEvent<HTMLDivElement>) => {
    e.nativeEvent.stopImmediatePropagation()
    if (
      stakingStatus.current === 'enabled' ||
      stakingStatus.requested === 'enabled'
    ) {
      dispatch(disableStaking())
    } else {
      dispatch(enableStaking())
    }
  }

  const handleRestartDaemon = async () => {
    await api.restart()
  }

  const stakingToggleClass = cx('rounded-full p-2px flex w-8', {
    'bg-blue-500 justify-end':
      (stakingStatus.current === 'enabled' && !stakingStatus.requested) ||
      stakingStatus.requested === 'enabled',
    'bg-gray-700 justify-start':
      (stakingStatus.current === 'disabled' && !stakingStatus.requested) ||
      stakingStatus.requested === 'disabled',
  })

  return (
    <div className="w-48 bg-gray-600 border border-gray-800 text-sm text-gray-300 font-medium rounded shadow-lg">
      <div className="flex flex-col p-2">
        <MenuLink label="Settings" to="/settings" />
        <MenuLink label="Console" to="/console" />
      </div>
      <div className="border-t border-gray-500 flex items-center justify-between p-4">
        <div>Staking</div>
        <div onClick={handleToggleStaking} className={stakingToggleClass}>
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
      <div className="border-t border-gray-500 flex items-center justify-between py-2 px-4 text-xs text-gray-400">
        <div>Veil Lite</div>
        <div>{version}</div>
      </div>
    </div>
  )
}

export default AppMenu
