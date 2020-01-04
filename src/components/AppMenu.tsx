import React, { MouseEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from '@reach/router'
import { selectors, actions } from '../reducers/app'

interface MenuLinkProps {
  label: string,
  to: string,
}

const MenuLink = ({ label, to }: MenuLinkProps) => (
  <Link to={to} className="px-2 h-8 rounded flex items-center justify-start hover:text-white hover:bg-gray-500">
    {label}
  </Link>
)

interface AppMenuProps {
  version: string,
}

const AppMenu = ({ version }: AppMenuProps) => {
  const stakingEnabled = useSelector(selectors.stakingEnabled)
  const dispatch = useDispatch()

  const toggleStaking = (e: MouseEvent<HTMLDivElement>) => {
    e.nativeEvent.stopImmediatePropagation()
    dispatch(actions.toggleStaking())
  }

  return (
    <div className="w-48 bg-gray-600 border border-gray-800 text-sm text-gray-300 font-medium rounded shadow-lg">
      <div className="flex flex-col p-2">
        <MenuLink label="Settings" to="/settings" />
        <MenuLink label="Console" to="/console" />
      </div>
      <div className="border-t border-gray-500 flex items-center justify-between p-4">
        <div>Staking</div>
        <div
          onClick={toggleStaking}
          className={`rounded-full p-2px flex ${stakingEnabled ? 'bg-blue-500 justify-end' : 'bg-gray-700 justify-start'} w-8`}
        >
          <div className="w-4 h-4 bg-white rounded-full pointer-events-none"></div>
        </div>
      </div>
      <div className="border-t border-gray-500 flex items-center justify-between py-2 px-4 text-xs text-gray-400">
        <div>Veil Lite</div>
        <div>{version}</div>
      </div>
    </div>
  )
}

export default AppMenu
