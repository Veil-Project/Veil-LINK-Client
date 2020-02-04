import React from 'react'
import { Transaction } from 'store/slices/transaction'
import TransactionRow from './TransactionRow'

interface TransactionTableProps {
  transactions: Array<Transaction>
}

const TransactionTable = ({ transactions }: TransactionTableProps) => (
  <table className="w-full text-sm border-t border-gray-800">
    <tbody>
      {transactions.map((tx, i) => (
        <TransactionRow key={tx.txid} {...tx} />
      ))}
    </tbody>
  </table>
)

export default TransactionTable
