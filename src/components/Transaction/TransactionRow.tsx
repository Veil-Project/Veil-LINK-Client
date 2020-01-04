import React from 'react'
import { navigate } from '@reach/router'
import { Transaction } from 'reducers/transaction'
import TransactionRowStatusIcon from './TransactionRowStatusIcon'

// TODO: Move to transaction utils
const transactionDescription = (type: string, address: string): string => {
  switch (type) {
    case 'receive':
      return `Received from ${address}`
    case 'send':
      return `Sent to ${address}`
    case 'reward':
      return `Staking reward`
    default:
      return address
  }
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

const formatDate = (date: Date, format: string):string => (
  // @ts-ignore
  date.toLocaleDateString('en-US', { dateStyle: format })
)

const formatTime = (date: Date, format: string):string => (
  // @ts-ignore
  date.toLocaleTimeString('en-US', { timeStyle: format })
)

const TransactionRow = ({ id, type, timestamp, address, amount }:Transaction) => (
  <tr
    onClick={() => navigate(`/transactions/${id}`)}
    className="cursor-pointer text-gray-400 hover:text-white hover:bg-gray-600 border-b border-gray-800"
  >
    <td className="pl-6">
      <TransactionRowStatusIcon type={type} />
    </td>
    <td className="text-white font-bold whitespace-no-wrap pr-3">
      {formatDate(timestamp, 'medium')}
    </td>
    <td className="whitespace-no-wrap pr-3">
      {formatTime(timestamp, 'short')}
    </td>
    <td className="leading-tight w-full pr-3 truncate" style={{ maxWidth: 0 }}>
      {transactionDescription(type, address)}
    </td>
    <td className={`text-right font-bold ${transactionColor(type)} whitespace-no-wrap pr-6 numeric-tabular-nums`}>
      {amount.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
    </td>
  </tr>
)

export default TransactionRow
