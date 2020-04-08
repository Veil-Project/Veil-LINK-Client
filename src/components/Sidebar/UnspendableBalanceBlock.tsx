import React from 'react'
import { useStore } from 'store'
import { Link } from '@reach/router'
import SidebarBlock from './SidebarBlock'

const UnspendableBalanceBlock = () => {
  const { state } = useStore()
  const { balance } = state

  return (
    <SidebarBlock title="Unspendable Balances">
      <div className="leading-relaxed text-sm">
        {balance.unconfirmedBalance !== null && balance.unconfirmedBalance > 0 && (
          <div className="flex justify-between items-baseline font-medium">
            <span className="">Unconfirmed</span>
            <span className="h-px bg-gray-600 flex-1 mx-2" />
            <span className="text-teal-500">
              {balance.unconfirmedBalance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              VEIL
            </span>
          </div>
        )}
        {balance.immatureBalance !== null && balance.immatureBalance > 0 && (
          <div className="flex justify-between items-baseline font-medium">
            <span className="">Immature</span>
            <span className="h-px bg-gray-600 flex-1 mx-2" />
            <span className="text-teal-500">
              {balance.immatureBalance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              VEIL
            </span>
          </div>
        )}
        {balance.legacyBalance !== null && balance.legacyBalance > 0 && (
          <>
            <div className="flex justify-between items-baseline font-medium">
              <span className="">Legacy</span>
              <span className="h-px bg-gray-600 flex-1 mx-2" />
              <span className="text-teal-500">
                {balance.legacyBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                VEIL
              </span>
            </div>
            <div className="text-xs mb-1">
              <Link
                to="/convert"
                className="underline text-gray-300 hover:text-white hover:no-underline"
              >
                Convert legacy balance…
              </Link>
            </div>
          </>
        )}
      </div>
    </SidebarBlock>
  )
}

export default UnspendableBalanceBlock
