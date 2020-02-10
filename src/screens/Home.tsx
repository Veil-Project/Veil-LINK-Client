import React, { ChangeEvent, useEffect, useState } from 'react'
import { Router, Location, RouteComponentProps } from '@reach/router'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { FiSearch } from 'react-icons/fi'
import './Home.css'

import { useSelector, useDispatch } from 'react-redux'
import { getTransactions, fetchTransactions } from '../store/slices/transaction'

import Send from './Send'
import Transaction from './Transaction'
import Button from '../components/UI/Button'
import TransactionTable from '../components/Transaction/TransactionTable'

const ModalTransitionRouter = (props: { children: Array<any> }) => (
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
      className="flex-1 bg-gray-800 placeholder-gray-400 rounded text-sm pr-3 pl-8"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    <div className="absolute top-0 left-0 bottom-0 pl-2 flex items-center justify-center">
      <FiSearch size="18" />
    </div>
  </div>
)

const Transactions = () => {
  const [query, setQuery] = useState('')
  const transactions = useSelector(getTransactions)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  // const filteredTransactions = transactions.filter(t => t.amount.toString().includes(query))

  return (
    <div className="flex-1 flex flex-col">
      <header
        className={`sticky top-0 p-6 bg-gray-700 py-4 flex items-center justify-between draggable shadow-md`}
        style={{ transition: 'box-shadow .2s ease-out' }}
      >
        <SearchField
          placeholder="Find transaction"
          value={query}
          onChange={handleQueryChange}
        />
        <div>
          <Button to="/send" primary>
            Send
          </Button>
        </div>
      </header>

      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  )
}

const Home = (props: RouteComponentProps) => {
  return (
    <div className="flex-1 flex relative bg-gray-700">
      <Transactions />
      <ModalTransitionRouter>
        <Send path="/send" />
        <Transaction path="/transactions/:id" />
      </ModalTransitionRouter>
    </div>
  )
}

export default Home
