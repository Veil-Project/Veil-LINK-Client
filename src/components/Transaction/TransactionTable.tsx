import React from 'react'
import { Transaction } from 'store/slices/transaction'
import TransactionRow from './TransactionRow'
import { sum } from 'lodash'

interface TransactionTableProps {
  transactions: Array<Transaction>
}

const filterTransactions = (transactions: any) =>
  transactions.filter(
    (tx: any) => !tx.conversion && tx.received - tx.sent + tx.fee !== 0
  )

const TransactionTable = ({ transactions }: TransactionTableProps) => (
  <table className="w-full text-sm border-t border-gray-800">
    <tbody>
      {filterTransactions(transactions).map((tx: any, i: number) => (
        <TransactionRow key={tx.txid} {...tx} />
      ))}
    </tbody>
  </table>
)

export default TransactionTable
