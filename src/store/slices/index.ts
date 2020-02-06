import { combineReducers } from '@reduxjs/toolkit'
import app from './app'
import daemon from './daemon'
import wallet from './wallet'
import balance from './balance'
import settings from './settings'
import transaction from './transaction'

const rootReducer = combineReducers({
  app,
  daemon,
  wallet,
  balance,
  settings,
  transaction,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
