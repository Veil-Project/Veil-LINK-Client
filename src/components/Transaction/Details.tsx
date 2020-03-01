import React from 'react'
import { Transaction } from 'store/models/transaction'
import JsonViewer from 'components/JsonViewer'

const TransactionDetails = ({ transaction }: { transaction: Transaction }) => {
  return (
    <div className="max-w-full overflow-auto">
      <JsonViewer src={transaction.walletTx} />
    </div>
  )
}

export default TransactionDetails
