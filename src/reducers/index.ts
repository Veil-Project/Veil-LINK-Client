import { combineReducers } from '@reduxjs/toolkit'
import app from './app'
import balance from './balance'
import settings from './settings'
import setup from './setup'
import transaction from './transaction'
import wallet from './wallet'
import console from './console'

const rootReducer = combineReducers({
  app,
  balance,
  settings,
  setup,
  transaction,
  wallet,
  console,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer