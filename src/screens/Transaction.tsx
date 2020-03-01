import React from 'react'
import { navigate, RouteComponentProps } from '@reach/router'
import Sheet from 'components/UI/Sheet'
import { useStore } from 'store'
import JsonViewer from 'components/JsonViewer'

const Transaction = ({ id }: RouteComponentProps<{ id: string }>) => {
  const { state } = useStore()

  if (!id) {
    return <div>Oops, that transaction can't be found.</div>
  }

  const transaction = state.transactions.find(id)

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
