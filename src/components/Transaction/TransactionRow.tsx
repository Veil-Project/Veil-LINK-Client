import React from 'react'
import { navigate } from '@reach/router'
import { Transaction } from 'store/slices/transaction'
import TransactionRowStatusIcon from './TransactionRowStatusIcon'
import { sum } from 'lodash'

// TODO: Move to transaction utils
const transactionDescription = (transaction: Transaction): string => {
  const { category, address, vout, amount } = transaction.details[0]
  const { type } = transaction.debug.vout[vout]

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

  return `${verb} ${type} to ${address}`
}

// TODO: Move to transaction utils
const transactionColor = (type: string): string => {
  switch (type) {
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

const transactionAmount = (transaction: any): number =>
  transaction.received - transaction.sent + transaction.fee

const formatDate = (date: Date, format: string): string =>
  // @ts-ignore
  date.toLocaleDateString('en-US', { dateStyle: format })

const formatTime = (date: Date, format: string): string =>
  // @ts-ignore
  date.toLocaleTimeString('en-US', { timeStyle: format })

const TransactionRow = (transaction: Transaction) => {
  const { txid, type, time, address } = transaction
  return (
    <tr
      onClick={() => navigate(`/transactions/${txid}`)}
      className="cursor-pointer text-gray-400 hover:text-white hover:bg-gray-600 border-b border-gray-800"
    >
      <td className="pl-6">
        <TransactionRowStatusIcon type={type} />
      </td>
      <td className="text-white font-bold whitespace-no-wrap pr-3">
        {formatDate(new Date(time), 'medium')}
      </td>
      <td className="whitespace-no-wrap pr-3">
        {formatTime(new Date(time), 'short')}
      </td>
      <td
        className="leading-tight w-full pr-3 truncate"
        style={{ maxWidth: 0 }}
      >
        {transactionDescription(transaction)}
      </td>
      <td
        className={`text-right font-bold ${transactionColor(
          type
        )} whitespace-no-wrap pr-6 numeric-tabular-nums`}
      >
        {transactionAmount(transaction).toLocaleString('en-US', {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })}
      </td>
    </tr>
  )
}

export default TransactionRow
