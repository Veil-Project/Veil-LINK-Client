import React, { useMemo } from 'react'
import { navigate, RouteComponentProps } from '@reach/router'
import Sheet from 'components/UI/Sheet'
import { useSelector } from 'react-redux'
import { getTransactions } from 'store/slices/transaction'
import JsonViewer from 'components/JsonViewer'

const Transaction = ({ id }: RouteComponentProps<{ id: string }>) => {
  const transactions = useSelector(getTransactions)
  const transaction = useMemo(() => transactions.find(t => t.txid === id), [
    id,
    transactions,
  ])

  if (!transaction) {
    return <div>Oops, that transaction can't be found.</div>
  }

  return (
    <Sheet onClose={() => navigate('/')}>
      <h1 className="leading-none text-2xl font-semibold border-b-2 border-gray-500 pb-3 mb-8">
        Transaction details
      </h1>

      <div className="text-sm font-mono">
        <JsonViewer src={transaction} />
      </div>
    </Sheet>
  )
}
export default Transaction
