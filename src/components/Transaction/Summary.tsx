import React, { useState, memo, MouseEvent, useEffect, useRef } from 'react'
import cx from 'classnames'
import { Transaction } from 'store/models/transaction'
import StatusIcon from './StatusIcon'
import Details from './Details'
import formatDate from 'utils/formatDate'
import formatTime from 'utils/formatTime'
import formatAmount from 'utils/formatAmount'
import Button from 'components/UI/Button'
import PasswordPrompt from 'components/PasswordPrompt'
import { useStore } from 'store'
import { toast } from 'react-toastify'
// @ts-ignore
import { useIsVisible } from 'react-is-visible'
import Loading from 'screens/Loading'

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

const TransactionSummary = memo(
  ({ transaction }: { transaction: Transaction }) => {
    const [requiresPassword, setRequiresPassword] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const { actions, effects } = useStore()
    const { time, type, category } = transaction
    const ref = useRef(null)
    const isVisible = useIsVisible(ref)

    useEffect(() => {
      if (isVisible && !transaction.isLoaded) {
        actions.transactions.update(transaction.txid)
      }
    }, [isVisible, transaction.isLoaded])

    const classes = cx('w-full px-2 mb-2px rounded text-sm hover:bg-gray-700', {
      'text-gray-400 hover:text-white': !isOpen,
      'bg-gray-700': isOpen,
    })

    const handleReveal = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      e.nativeEvent.stopPropagation()
      setRequiresPassword(true)
    }

    const handleUpdateTransaction = async (password: string) => {
      try {
        await effects.rpc.unlockWallet(password)
        await actions.transactions.update(transaction.txid)
      } catch (e) {
        toast(e.message, { type: 'error' })
      } finally {
        await effects.rpc.lockWallet()
        setRequiresPassword(false)
      }
    }

    return (
      <div className={classes} ref={ref}>
        {requiresPassword && (
          <PasswordPrompt
            title="Reveal transaction amount"
            onCancel={() => setRequiresPassword(false)}
            onSubmit={(password: string) => handleUpdateTransaction(password)}
          />
        )}

        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center cursor-pointer"
        >
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
            style={{ minWidth: 0, maxWidth: '220px' }}
          >
            {transaction.isLoaded ? (
              transactionDescription(transaction)
            ) : (
              <div className="w-64 h-4 bg-gray-700" />
            )}
          </div>
          <div
            className={`ml-auto pl-3 text-right font-bold ${
              category ? transactionColor(category) : ''
            } whitespace-no-wrap numeric-tabular-nums`}
          >
            {transaction.isLoaded ? (
              !isOpen &&
              (transaction.requiresReveal ? (
                <Button size="sm" onClick={handleReveal}>
                  Reveal
                </Button>
              ) : (
                formatAmount(transaction.totalAmount)
              ))
            ) : (
              <div className="w-16 h-4 bg-gray-700" />
            )}
          </div>
        </div>

        {isOpen &&
          (transaction.isLoaded ? (
            <Details transaction={transaction} />
          ) : (
            <div className="p-24">
              <Loading />
            </div>
          ))}
      </div>
    )
  }
)

export default TransactionSummary
