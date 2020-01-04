import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MdMenu } from 'react-icons/md'

import { selectors, actions } from '../reducers/app'

import Balance from './Balance'
import AppMenu from './AppMenu'
import ReceivingAddress from './ReceivingAddress'
import Button from './UI/Button'
import StatusBar from './UI/StatusBar'

interface SidebarBlockProps {
  title: string,
  children: any
}

const SidebarBlock = ({ title, children }: SidebarBlockProps) => (
  <section className="pb-6 mb-6 border-b border-gray-700">
    <header className="mb-4 leading-none">
      <h1 className="text-sm font-semibold">{title}</h1>
      <div className="h-2px w-8 mt-2 bg-teal-500"></div>
    </header>
    {children}
  </section>
)

const AppSidebar = () => {
  const [isOpen, setOpen] = useState(false)
  const stakingEnabled = useSelector(selectors.stakingEnabled)
  const dispatch = useDispatch()

  useEffect(() => {
    const closeDialog = () => isOpen && setOpen(false)
    document.addEventListener('click', closeDialog)
    return () => document.removeEventListener('click', closeDialog)
  })

  return (
    <aside className="flex-none flex flex-col relative" style={{ width: 350 }}>
      <div className="bg-blue-500 draggable">
        <div className="h-titlebar -mb-titlebar px-titlebar flex items-center relative">
          <div className="flex-1"></div>
          <div className="text-sm font-medium">
            Veil Wallet
          </div>
          <div className="flex-1 flex justify-end">
            <button className={`p-1 -m-1 rounded pointer outline-none ${isOpen ? 'bg-blue-700' : 'hover:bg-blue-600'} active:bg-blue-700`} onClick={() => setOpen(!isOpen)}>
              <MdMenu size={18} />
            </button>
            {isOpen && (
              <div className="absolute z-10 top-0 ml-titlebar mt-titlebar" style={{ left: '100%' }}>
                <div className="-m-1">
                  <AppMenu version="0.1alpha" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="px-6 py-9 text-center">
          <Balance
            veilBalance={170472.1339}
            fiatBalance={13992.13}
            currency="USD"
          />
        </div>
      </div>
      <div className="flex-1 bg-gray-800 overflow-y-auto p-6">
        <SidebarBlock title="Staking">
          {stakingEnabled ? (
            <div className="h-40 rounded border border-gray-600 border-dashed flex items-center justify-center text-sm text-gray-500">
              TODO: staking details
            </div>
           ) : (
            <Button size="sm" onClick={() => dispatch(actions.toggleStaking())}>
              Enable Staking
            </Button>
          )}
        </SidebarBlock>
        <SidebarBlock title="Receive">
          <ReceivingAddress />
        </SidebarBlock>
      </div>
      <div className="py-4 px-6 bg-gray-800">
        <StatusBar />
      </div>
    </aside>
  )
}

export default AppSidebar