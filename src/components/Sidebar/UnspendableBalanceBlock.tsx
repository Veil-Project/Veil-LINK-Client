import React from 'react'
import { useStore } from 'store'
import { Link } from '@reach/router'
import SidebarBlock from './SidebarBlock'
import DefinitionList from 'components/DefinitionList'

const UnspendableBalanceBlock = () => {
  const { state } = useStore()
  const { balance } = state

  if (balance.unspendableBalance <= 0) {
    return null
  }

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
      <DefinitionList
        data={[
          balance.unconfirmedBalance !== null && balance.unconfirmedBalance > 0
            ? ['Unconfirmed', balance.unconfirmedBalance]
            : null,
          balance.immatureBalance !== null && balance.immatureBalance > 0
            ? ['Immature', balance.immatureBalance]
            : null,
          balance.legacyBalance !== null && balance.legacyBalance > 0
            ? ['Legacy', balance.legacyBalance]
            : null,
        ]}
      />
    </SidebarBlock>
  )
}

export default UnspendableBalanceBlock
