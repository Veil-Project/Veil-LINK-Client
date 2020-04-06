import React, { useEffect } from 'react'
import { Transaction } from 'store/models/transaction'
import formatDate from 'utils/formatDate'
import formatTime from 'utils/formatTime'
import ExternalLink from 'components/ExternalLink'
import { useStore } from 'store'
import { useToasts } from 'react-toast-notifications'

const TransactionDetails = ({ transaction }: { transaction: Transaction }) => {
  const { addToast } = useToasts()
  const { actions } = useStore()

  useEffect(() => {
    ;(async () => {
      await actions.transactions.update(transaction.txid)
    })()
  }, [actions.transactions, transaction.txid])

  const copyTxid = () => {
    window.clipboard.writeText(transaction.txid)
    addToast('Copied to clipboard!', { appearance: 'info' })
  }

  return (
    <div className="px-4 pt-1 pb-6 text-white">
      <dl>
        <div className="border-t border-gray-600 py-2 pb-3 flex">
          <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
            Amount:
          </dt>
          <dl className="flex-1 pl-3">{transaction.totalAmount} Veil</dl>
        </div>
        {transaction.sentAmount !== 0 && (
          <div className="border-t border-gray-600 py-2 pb-3 flex">
            <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
              Sent:
            </dt>
            <dl className="flex-1 pl-3">{transaction.sentAmount} Veil</dl>
          </div>
        )}
        {transaction.receivedAmount !== 0 && (
          <div className="border-t border-gray-600 py-2 pb-3 flex">
            <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
              Received:
            </dt>
            <dl className="flex-1 pl-3">{transaction.receivedAmount} Veil</dl>
          </div>
        )}
        {transaction.changeAmount !== 0 && (
          <div className="border-t border-gray-600 py-2 pb-3 flex">
            <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
              Change:
            </dt>
            <dl className="flex-1 pl-3">{transaction.changeAmount} Veil</dl>
          </div>
        )}
        {transaction.fee !== 0 && (
          <div className="border-t border-gray-600 py-2 pb-3 flex">
            <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
              Fee:
            </dt>
            <dl className="flex-1 pl-3">{transaction.fee} Veil</dl>
          </div>
        )}
        <div className="border-t border-gray-600 py-2 pb-3 flex">
          <dt className="flex-none w-48 pr-2 text-right font-semibold text-teal-500">
            Recipient:
          </dt>
          <dl className="flex-1 pl-3">{transaction.address}</dl>
        </div>
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
      <div className="mt-4 text-gray-300 flex justify-between">
        <div>
          ID:{' '}
          <ExternalLink
            href={transaction.explorerUrl}
            title="Open in Block Explorer"
            className="underline hover:text-white hover:no-underline"
          >
            {transaction.txid}
          </ExternalLink>
        </div>
        <button
          className="bg-gray-600 rounded-sm px-2 py-2px ml-2 text-xs hover:text-white font-semibold"
          onClick={copyTxid}
        >
          Copy
        </button>
      </div>
    </div>
  )
}

export default TransactionDetails
