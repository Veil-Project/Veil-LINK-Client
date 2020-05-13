import React from 'react'
import { useStore } from 'store'
import SidebarBlock from './SidebarBlock'
import DefinitionList from 'components/DefinitionList'

const UnspendableBalanceBlock = () => {
  const { state, actions } = useStore()
  const { balance } = state

  if (balance.unspendableBalance <= 0) {
    return null
  }

  const ConvertLink = (
    <button
      onClick={() => actions.app.closeModal()}
      className="px-4 py-2 font-semibold text-teal-500 hover:text-white hover:no-underline"
    >
      Convert legacy
    </button>
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
