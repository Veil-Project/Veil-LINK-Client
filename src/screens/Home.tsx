import React, { ChangeEvent, useEffect, useState, useRef } from 'react'
import { Router, Location, RouteComponentProps } from '@reach/router'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { FiSearch } from 'react-icons/fi'
// @ts-ignore
import ViewPortList from 'react-viewport-list'
import './Home.css'

import { useStore } from 'store'

import Send from './Send'
import Button from '../components/UI/Button'
import { Transaction } from 'store/models/transaction'
import TransactionSummary from '../components/Transaction/Summary'
import ReceivingAddress from 'components/ReceivingAddress'
import VeilLogo from 'components/Icon/VeilLogo'
import ExternalLink from 'components/ExternalLink'
import Loading from './Loading'

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
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const { state, actions } = useStore()
  const transactions = state.transactions.forDisplay

  const viewPortRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      await actions.transactions.fetch()
      setIsLoading(false)
    })()
  }, [])

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  // const filteredTransactions = transactions.filter(t => t.amount.toString().includes(query))

  if (isLoading) {
    return <Loading />
  }

  return transactions.length > 0 ? (
    <>
      <div
        className={`sticky top-0 h-16 p-4 bg-gray-700 shadow-md draggable flex items-center justify-between`}
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
      </div>
      <div
        ref={viewPortRef}
        className="flex-1 p-2 overflow-y-auto w-full overflow-x-hidden"
      >
        <ViewPortList
          viewPortRef={viewPortRef}
          listLength={transactions.length}
          itemMinHeight={50}
          margin={2}
          overscan={5000}
        >
          {({ innerRef, index, style }: any) => (
            <div ref={innerRef} style={style} key={transactions[index].txid}>
              <TransactionSummary transaction={transactions[index]} />
            </div>
          )}
        </ViewPortList>
      </div>
    </>
  ) : (
    <div className="max-w-lg m-auto text-center">
      <VeilLogo className="mx-auto mb-8" />
      <h1 className="text-2xl font-bold">
        Time to transfer some Veil to your wallet.
      </h1>
      <p className="text-gray-300 text-lg">
        You can now send Veil to your receiving address.
      </p>
      <div className="max-w-sm mx-auto rounded bg-gray-700 text-left flex items-center justify-center p-6 my-8">
        <ReceivingAddress size="lg" />
      </div>
      <ul className="text-center text-sm leading-none text-gray-400">
        <li>
          <a href="" className="underline hover:text-white hover:no-underline">
            Read the launch announcement
          </a>
        </li>
        <li className="mt-3">
          <ExternalLink
            href="https://www.veil-project.com"
            className="underline hover:text-white hover:no-underline"
          >
            Learn more about Veil
          </ExternalLink>
        </li>
      </ul>
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
