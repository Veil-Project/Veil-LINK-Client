import React, { ChangeEvent, useEffect, useState } from 'react'
import { Router, Location, RouteComponentProps } from '@reach/router'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { FiSearch } from 'react-icons/fi'
import './Home.css'

import { useStore } from 'store'

import Send from './Send'
import Button from '../components/UI/Button'
import { Transaction } from 'store/models/transaction'
import TransactionSummary from '../components/Transaction/Summary'
import { toast } from 'react-toastify'
import Spinner from 'components/UI/Spinner'
import ReceivingAddress from 'components/ReceivingAddress'
import VeilLogo from 'components/Icon/VeilLogo'

const ModalTransitionRouter = (props: { children: any }) => (
  <Location>
    {({ location }) => (
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="appear" timeout={300}>
          <Router location={location} className="absolute inset-0">
            {props.children}
          </Router>
        </CSSTransition>
      </TransitionGroup>
    )}
  </Location>
)

interface SearchFieldProps {
  placeholder: string
  value: string
  onChange(event: ChangeEvent<HTMLInputElement>): void
}

const SearchField = ({ placeholder, value, onChange }: SearchFieldProps) => (
  <div className="h-9 w-64 flex relative">
    <input
      className="flex-1 placeholder-gray-400 bg-transparent border-none p-0 pr-3 pl-8 outline-none"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    <div className="absolute top-0 left-0 bottom-0 ml-1 flex items-center justify-center">
      <FiSearch size="18" />
    </div>
  </div>
)

const Transactions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')
  const { state, actions } = useStore()
  const transactions = state.transactions.forDisplay

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const error = await actions.transactions.fetch()
      if (error) {
        toast(error.message, { type: 'error' })
      }
      setIsLoading(false)
    })()
  }, [actions.transactions])

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  // const filteredTransactions = transactions.filter(t => t.amount.toString().includes(query))

  return isLoading ? (
    <Spinner />
  ) : transactions.length > 0 ? (
    <>
      <header
        className={`sticky top-0 p-4 bg-gray-700 flex items-center justify-between shadow-md draggable`}
        style={{ transition: 'box-shadow .2s ease-out' }}
      >
        <SearchField
          placeholder="Find transaction"
          value={query}
          onChange={handleQueryChange}
        />
        {state.balance.spendable !== null && state.balance.spendable > 0 && (
          <div>
            <Button to="/send" primary>
              Send
            </Button>
          </div>
        )}
      </header>
      <div className="flex-1 p-2 overflow-y-auto w-full overflow-x-hidden">
        {transactions.map((tx: Transaction) => (
          <TransactionSummary key={tx.txid} transaction={tx} />
        ))}
      </div>
    </>
  ) : (
    <div className="max-w-md m-auto text-center">
      <VeilLogo className="mx-auto mb-8 h-16" />
      <h1 className="text-xl font-bold">
        Time to transfer some Veil to your wallet.
      </h1>
      <p className="text-gray-300 text-lg">
        You can now send Veil to your receiving address.
      </p>
      <div className="rounded-lg bg-gray-700 text-left flex items-center justify-center p-6 my-8">
        <ReceivingAddress size="lg" />
      </div>
      <Button primary to="/">
        Learn more about Veil
      </Button>
    </div>
  )
}

const Home = () => {
  return (
    <div className="h-screen flex flex-col relative">
      <Transactions />

      <ModalTransitionRouter>
        <Send path="/send" />
      </ModalTransitionRouter>
    </div>
  )
}

export default Home
