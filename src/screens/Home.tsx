import React, { ChangeEvent, useEffect, useState, useRef } from 'react'
import { Router, Location, RouteComponentProps, navigate } from '@reach/router'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { FiSearch } from 'react-icons/fi'
import useHotkeys from '@reecelucas/react-use-hotkeys'
// @ts-ignore
import ViewPortList from 'react-viewport-list'
import './Home.css'

import { useStore } from 'store'

import Send from './Send'
import Button from '../components/UI/Button'
import TransactionSummary from '../components/Transaction/Summary'
import VeilLogo from 'components/Icon/VeilLogo'
import ExternalLink from 'components/ExternalLink'
import Loading from './Loading'
import { FaChevronDown, FaCheck } from 'react-icons/fa'

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
  const [filterCategory, setFilterCategory] = useState('')
  const { state, actions } = useStore()
  const transactions = state.transactions.forDisplay

  const viewPortRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      await actions.transactions.fetch()
      setIsLoading(false)
    })()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  const filteredTransactions =
    filterCategory !== ''
      ? transactions.filter(tx => tx.category === filterCategory)
      : transactions

  return transactions.length > 0 ? (
    <>
      <div
        className={`sticky top-0 h-16 p-4 bg-gray-700 shadow-md draggable flex items-center justify-between`}
      >
        <div className="relative">
          <select
            onChange={e => setFilterCategory(e.target.value)}
            value={filterCategory}
            className={`appearance-none h-9 bg-gray-600 rounded font-semibold text-sm py-0 pl-3 pb-1 pr-10 flex items-center outline-none ${
              filterCategory === '' ? 'text-gray-300' : 'text-white'
            }`}
          >
            <option value="">Filter by type…</option>
            <option value="send">Sent</option>
            <option value="receive">Received</option>
            <option value="stake">Rewards</option>
          </select>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-teal-500">
            <FaChevronDown size={10} />
          </div>
        </div>
        <Button
          to="/send"
          primary
          title={state.balance.canSend ? '' : 'No spendable balance'}
          disabled={!state.balance.canSend}
        >
          Send
        </Button>
      </div>
      <div
        ref={viewPortRef}
        className="flex-1 p-2 overflow-y-auto w-full overflow-x-hidden"
      >
        <ViewPortList
          viewPortRef={viewPortRef}
          listLength={filteredTransactions.length}
          itemMinHeight={48}
          margin={2}
          overscan={10000}
        >
          {({ innerRef, index, style }: any) => (
            <div
              ref={innerRef}
              style={style}
              key={filteredTransactions[index].txid}
            >
              <TransactionSummary transaction={filteredTransactions[index]} />
            </div>
          )}
        </ViewPortList>
      </div>
    </>
  ) : (
    <div className="max-w-lg m-auto text-center">
      <VeilLogo className="mx-auto mb-8" />
      <h1 className="text-3xl font-bold leading-tight">
        You're ready to get started.
      </h1>
      <p className="text-gray-300 text-xl">
        You can now send Veil to your receiving address.
      </p>
      <div className="max-w-xs mx-auto rounded bg-gray-700 text-left font-medium flex flex-col p-4 my-8">
        <div className="flex items-center mb-2">
          {state.wallet.currentReceivingAddress ? (
            <div className="w-8 h-8 text-sm leading-none rounded-full bg-green-500 text-white flex items-center justify-center mr-2 font-semibold">
              <FaCheck />
            </div>
          ) : (
            <div className="w-8 h-8 text-sm leading-none rounded-full bg-gray-500 flex items-center justify-center mr-2 font-semibold">
              1
            </div>
          )}
          Generate a receiving address
        </div>
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 text-sm leading-none rounded-full bg-gray-500 flex items-center justify-center mr-2 font-semibold">
            2
          </div>
          Transfer Veil to your wallet
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 text-sm leading-none rounded-full bg-gray-500 flex items-center justify-center mr-2 font-semibold">
            3
          </div>
          Enjoy using Veil!
        </div>
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
  useHotkeys('Meta+,', () => {
    navigate('/settings')
  })

  useHotkeys('c', () => {
    navigate('/console')
  })

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
