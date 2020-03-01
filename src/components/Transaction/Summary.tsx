import React, { useState, memo } from 'react'
import cx from 'classnames'
import { WalletTransaction, Transaction } from 'store/models/transaction'
import StatusIcon from './StatusIcon'
import Details from './Details'
import JsonViewer from 'components/JsonViewer'

// TODO: Move to transaction utils
const transactionDescription = (transaction: Transaction): string => {
  const { type, category, address } = transaction

  let verb
  switch (category) {
    case 'receive':
      verb = 'received'
      break
    case 'send':
      verb = 'sent'
      break
    default:
      verb = category
  }

  return `${verb} ${type} ${address ? ` to ${address}` : ''}`
}

// TODO: Move to transaction utils
const transactionColor = (category: string): string => {
  switch (category) {
    case 'receive':
      return 'text-teal-500'
    case 'send':
      return 'text-white'
    case 'reward':
      return 'text-yellow-500'
    default:
      return 'text-white'
  }
}

const formatDate = (date: Date, format: string): string =>
  // @ts-ignore
  date.toLocaleDateString('en-US', { dateStyle: format })

const formatTime = (date: Date, format: string): string =>
  // @ts-ignore
  date.toLocaleTimeString('en-US', { timeStyle: format })

const formatAmount = (amount: number): string =>
  amount.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })

const TransactionSummary = memo(
  ({ transaction }: { transaction: Transaction }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { time, type, category } = transaction

    const classes = cx(
      'w-full px-2 mb-px rounded cursor-pointer text-sm text-gray-400 hover:text-white hover:bg-gray-700',
      {
        'bg-gray-700': isOpen,
      }
    )

    return (
      <div className={classes}>
        <div onClick={() => setIsOpen(!isOpen)} className="flex items-center">
          <div className="flex-none">
            <StatusIcon category={category} />
          </div>
          <div className="flex-none w-24 text-white font-bold whitespace-no-wrap">
            {formatDate(new Date(time), 'medium')}
          </div>
          <div className="flex-none w-20 whitespace-no-wrap numeric-tabular-nums">
            {formatTime(new Date(time), 'short')}
          </div>
          <div
            className="max-w-md flex-shrink truncate"
            style={{ minWidth: 0 }}
          >
            {transactionDescription(transaction)}
          </div>
          <div
            className={`ml-auto pl-3 text-right font-bold ${transactionColor(
              category
            )} whitespace-no-wrap numeric-tabular-nums`}
          >
            {formatAmount(transaction.totalAmount)}
          </div>
        </div>

        {isOpen && <Details transaction={transaction} />}
      </div>
    )
  }
)

export default TransactionSummary
