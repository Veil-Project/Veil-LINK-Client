import React from 'react'
import { Transaction } from 'store/models/transaction'
import formatDate from 'utils/formatDate'
import formatTime from 'utils/formatTime'
import ExternalLink from 'components/ExternalLink'

const TransactionDetails = ({ transaction }: { transaction: Transaction }) => {
  return (
    <div className="px-4 pt-1 pb-6 text-white">
      <dl>
        <div className="border-t border-gray-600 py-2 pb-3 flex">
          <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
            Amount:
          </dt>
          <dl className="flex-1 pl-3">{transaction.totalAmount} Veil</dl>
        </div>
        <div className="border-t border-gray-600 py-2 pb-3 flex">
          <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
            Sent:
          </dt>
          <dl className="flex-1 pl-3">{transaction.sentAmount} Veil</dl>
        </div>
        <div className="border-t border-gray-600 py-2 pb-3 flex">
          <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
            Received:
          </dt>
          <dl className="flex-1 pl-3">{transaction.receivedAmount} Veil</dl>
        </div>
        <div className="border-t border-gray-600 py-2 pb-3 flex">
          <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
            Recipient:
          </dt>
          <dl className="flex-1 pl-3">{transaction.address}</dl>
        </div>
        {transaction.category === 'send' && (
          <div className="border-t border-gray-600 py-2 pb-3 flex">
            <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
              Fee:
            </dt>
            <dl className="flex-1 pl-3">{transaction.fee} Veil</dl>
          </div>
        )}
        <div className="border-t border-gray-600 py-2 pb-3 flex">
          <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
            Status:
          </dt>
          <dl className="flex-1 pl-3">
            {transaction.confirmed ? 'Confirmed' : 'Unconfirmed'}
          </dl>
        </div>
        <div className="border-t border-gray-600 py-2 pb-3 flex">
          <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
            Confirmations:
          </dt>
          <dl className="flex-1 pl-3">{transaction.confirmations}</dl>
        </div>
        <div className="border-t border-b border-gray-600 py-2 pb-3 flex">
          <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
            Date:
          </dt>
          <dl className="flex-1 pl-3">
            {formatDate(new Date(transaction.time), 'long')}{' '}
            {formatTime(new Date(transaction.time), 'short')}
          </dl>
        </div>
      </dl>
      <div className="mt-4 text-gray-300">
        ID: {transaction.walletTx.txid}
        <br />
        <ExternalLink
          href={transaction.explorerUrl}
          className="underline hover:text-white hover:no-underline"
        >
          Open in block explorer
        </ExternalLink>
      </div>
    </div>
  )
}

export default TransactionDetails
