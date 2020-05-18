import React from 'react'
import formatDate from 'utils/formatDate'
import formatTime from 'utils/formatTime'
import ExternalLink from 'components/ExternalLink'
import { useToasts } from 'react-toast-notifications'
import JsonViewer from 'components/JsonViewer'
import { useStore } from 'store'

const TransactionDetails = ({
  transaction,
  shielded = false,
}: {
  transaction: any
  shielded: boolean
}) => {
  const { state } = useStore()
  const { addToast } = useToasts()

  const copyTxid = () => {
    window.clipboard.writeText(transaction.txid)
    addToast('Copied to clipboard!', { appearance: 'info' })
  }

  return (
    <div className="px-4 pt-1 pb-6 text-white">
      <dl>
        <div className="flex py-2 pb-3 border-t border-gray-600">
          <dt className="flex-none w-48 pr-2 font-semibold text-right text-teal-500">
            Amount:
          </dt>
          <dl className="flex-1 pl-3">
            {shielded ? 'Shielded' : `${transaction.totalAmount} Veil`}
          </dl>
        </div>
        {!shielded && transaction.sentAmount !== 0 && (
          <div className="flex py-2 pb-3 border-t border-gray-600">
            <dt className="flex-none w-48 pr-2 font-semibold text-right text-teal-500">
              Sent:
            </dt>
            <dl className="flex-1 pl-3">{transaction.sentAmount} Veil</dl>
          </div>
        )}
        {!shielded && transaction.receivedAmount !== 0 && (
          <div className="flex py-2 pb-3 border-t border-gray-600">
            <dt className="flex-none w-48 pr-2 font-semibold text-right text-teal-500">
              Received:
            </dt>
            <dl className="flex-1 pl-3">{transaction.receivedAmount} Veil</dl>
          </div>
        )}
        {!shielded && transaction.changeAmount !== 0 && (
          <div className="flex py-2 pb-3 border-t border-gray-600">
            <dt className="flex-none w-48 pr-2 font-semibold text-right text-teal-500">
              Change:
            </dt>
            <dl className="flex-1 pl-3">{transaction.changeAmount} Veil</dl>
          </div>
        )}
        {!shielded && transaction.fee !== 0 && (
          <div className="flex py-2 pb-3 border-t border-gray-600">
            <dt className="flex-none w-48 pr-2 font-semibold text-right text-teal-500">
              Fee:
            </dt>
            <dl className="flex-1 pl-3">{transaction.fee} Veil</dl>
          </div>
        )}
        {transaction.address && (
          <div className="flex py-2 pb-3 border-t border-gray-600">
            <dt className="flex-none w-48 pr-2 font-semibold text-right text-teal-500">
              Recipient:
            </dt>
            <dl className="flex-1 pl-3">{transaction.address}</dl>
          </div>
        )}
        <div className="flex py-2 pb-3 border-t border-gray-600">
          <dt className="flex-none w-48 pr-2 font-semibold text-right text-teal-500">
            Confirmations:
          </dt>
          <dl className="flex-1 pl-3">
            {transaction.confirmations > 0
              ? transaction.confirmations
              : 'Unconfirmed'}
          </dl>
        </div>
        <div className="flex py-2 pb-3 border-t border-b border-gray-600">
          <dt className="flex-none w-48 pr-2 font-semibold text-right text-teal-500">
            Date:
          </dt>
          <dl className="flex-1 pl-3">
            {formatDate(new Date(transaction.time), 'long')}{' '}
            {formatTime(new Date(transaction.time), 'short')}
          </dl>
        </div>
      </dl>
      <div className="flex justify-between mt-4 text-gray-300">
        <div>
          ID:{' '}
          <ExternalLink
            href={`https://${
              state.blockchain.chain == 'test' ? 'testnet' : 'explorer'
            }.veil-project.com/tx/${transaction.txid}`}
            title="Open in Block Explorer"
            className="underline hover:text-white hover:no-underline"
          >
            {transaction.txid}
          </ExternalLink>
        </div>
        <button
          className="px-2 ml-2 text-xs font-semibold bg-gray-600 rounded-sm py-2px hover:text-white"
          onClick={copyTxid}
        >
          Copy
        </button>
      </div>
      <div className="mt-4">
        <JsonViewer src={transaction} collapsed={0} />
      </div>
    </div>
  )
}

export default TransactionDetails
