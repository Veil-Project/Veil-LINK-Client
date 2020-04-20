import React from 'react'
import { useStore } from 'store'
import { Link } from '@reach/router'
import SidebarBlock from './SidebarBlock'

interface RowProps {
  label: string
  amount: number
}

const Row = ({ label, amount }: RowProps) => (
  <div className="flex justify-between items-baseline">
    <span className="font-medium">{label}</span>
    <span className="h-px bg-gray-600 flex-1 mx-2" />
    <span className="text-teal-500 font-semibold">
      {amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}{' '}
      VEIL
    </span>
  </div>
)

const UnspendableBalanceBlock = () => {
  const { state } = useStore()
  const { balance } = state

  const ConvertLink = (
    <Link
      to="/convert"
      className="text-teal-500 py-2 px-4 hover:text-white hover:no-underline"
    >
      Convert legacy
    </Link>
  )

  return (
    <SidebarBlock
      title="Unspendable Balances"
      titleAccessory={
        balance.legacyBalance !== null &&
        balance.legacyBalance > 0 &&
        ConvertLink
      }
    >
      <div className="leading-relaxed text-sm">
        {balance.unconfirmedBalance !== null &&
          balance.unconfirmedBalance > 0 && (
            <Row label="Unconfirmed" amount={balance.unconfirmedBalance} />
          )}
        {balance.immatureBalance !== null && balance.immatureBalance > 0 && (
          <Row label="Immature" amount={balance.immatureBalance} />
        )}
        {balance.legacyBalance !== null && balance.legacyBalance > 0 && (
          <Row label="Legacy" amount={balance.legacyBalance} />
        )}
      </div>
    </SidebarBlock>
  )
}

export default UnspendableBalanceBlock
