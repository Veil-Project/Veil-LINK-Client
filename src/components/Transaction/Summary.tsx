import React, { useState, memo, MouseEvent, useEffect, useRef } from 'react'
import cx from 'classnames'
import { motion } from 'framer-motion'
import StatusIcon from './StatusIcon'
import Details from './Details'
import formatDate from 'utils/formatDate'
import formatTime from 'utils/formatTime'
import formatAmount from 'utils/formatAmount'
import Button from 'components/UI/Button'
import PasswordPrompt from 'components/PasswordPrompt'
import { useStore } from 'store'
import { useToasts } from 'react-toast-notifications'
// @ts-ignore
import { useIsVisible } from 'react-is-visible'
import Loading from 'screens/Loading'

// TODO: Move to transaction utils
const transactionDescription = (transaction: any): string => {
  const { type, category, address, sentToSelf } = transaction

  let verb
  switch (category) {
    case 'receive':
      verb = 'received'
      break
    case 'send':
      verb = 'sent'
      break
    case 'stake':
      return 'staking reward'
    default:
      verb = category
  }

  let noun
  switch (type) {
    case 'zerocoinspend':
      noun = 'zerocoin'
      break
    default:
      noun = type
  }

  return `${verb} ${noun} ${
    sentToSelf ? 'to self' : address ? ` to ${address}` : ''
  }`
}

// TODO: Move to transaction utils
const transactionColor = (category: string): string => {
  switch (category) {
    case 'receive':
      return 'text-teal-500'
    case 'send':
      return 'text-white'
    case 'stake':
      return 'text-yellow-500'
    default:
      return 'text-white'
  }
}

const TransactionSummary = ({ txid }: { txid: string | null }) => {
  const [transaction, setTransaction] = useState<any>(null)
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { addToast } = useToasts()
  const { state, actions, effects } = useStore()
  const ref = useRef(null)
  const isVisible = useIsVisible(ref)
  const isLoaded = !!transaction

  let isMounted = true

  const updateFromCache = async () => {
    if (!txid) return
    const tx = await effects.db.fetchTransaction(txid)
    if (isMounted) setTransaction(tx)
  }

  const updateFromWallet = async () => {
    if (!txid) return
    await actions.transactions.update(txid)
    await updateFromCache()
  }

  useEffect(() => {
    if (isVisible && !isLoaded) {
      updateFromCache()
    }
    return () => {
      isMounted = false
    }
  }, [isVisible, isLoaded])

  useEffect(() => {
    if (isOpen) {
      updateFromWallet()
    }
  }, [isOpen])

  const handleReveal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopPropagation()
    handleUpdateTransaction()
  }

  const handleUpdateTransaction = async (password?: string) => {
    if (!password) {
      setRequiresPassword(true)
      return
    }

    const stakingWasActive = state.staking.isEnabled

    try {
      if (password) await effects.rpc.unlockWallet(password)
      await effects.rpc.rescanRingCtWallet()
      await actions.transactions.update(transaction.txid)
      await updateFromCache()
      setRequiresPassword(false)
    } catch (e) {
      if (e.code === -13) {
        setRequiresPassword(true)
      } else {
        addToast(e.message, { appearance: 'error' })
      }
    } finally {
      if (password) {
        await effects.rpc.lockWallet()
        if (stakingWasActive) {
          await effects.rpc.unlockWalletForStaking(password)
        }
      }
    }
  }

  const classes = cx(
    'w-full px-2 mb-2px rounded text-sm hover:bg-gray-700 overflow-hidden',
    {
      'text-gray-400 hover:text-white': !isOpen,
      'bg-gray-700': isOpen,
    }
  )

  return (
    <motion.div className={classes} ref={ref}>
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
          <StatusIcon category={transaction?.category} />
        </div>
        <div className="flex-none w-24 text-white font-bold whitespace-no-wrap">
          {transaction ? (
            formatDate(new Date(transaction.time), 'medium')
          ) : (
            <div
              className="w-16 h-4"
              style={{ backgroundColor: 'rgba(255,255,255,.066)' }}
            />
          )}
        </div>
        <div className="flex-none w-20 whitespace-no-wrap numeric-tabular-nums">
          {transaction ? (
            formatTime(new Date(transaction.time), 'short')
          ) : (
            <div
              className="w-16 h-4"
              style={{ backgroundColor: 'rgba(255,255,255,.066)' }}
            />
          )}
        </div>
        <div
          className="max-w-md flex-shrink truncate"
          style={{ minWidth: 0, maxWidth: '500px' }}
        >
          {transaction ? (
            transactionDescription(transaction)
          ) : (
            <div
              className="w-64 h-4"
              style={{ backgroundColor: 'rgba(255,255,255,.066)' }}
            />
          )}
        </div>
        <div
          className={`ml-auto pl-3 text-right font-bold ${
            transaction ? transactionColor(transaction.category) : ''
          } whitespace-no-wrap numeric-tabular-nums`}
        >
          {transaction ? (
            !isOpen &&
            (transaction.requiresReveal ? (
              <Button
                size="sm"
                onClick={handleReveal}
                disabled={!transaction.confirmations?.length}
                title={
                  transaction.confirmations?.length
                    ? ''
                    : 'Pending confirmation…'
                }
              >
                Reveal
              </Button>
            ) : (
              formatAmount(transaction.totalAmount)
            ))
          ) : (
            <div
              className="w-16 h-4"
              style={{ backgroundColor: 'rgba(255,255,255,.066)' }}
            />
          )}
        </div>
      </div>

      {isOpen &&
        (transaction ? (
          <Details transaction={transaction} />
        ) : (
          <div className="p-24">
            <Loading />
          </div>
        ))}
    </motion.div>
  )
}

export default memo(TransactionSummary)
