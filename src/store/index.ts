import { configureStore, Action } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import rootReducer, { RootState } from './slices'
import bindIpcEventListeners from '../ipcListeners'

const store = configureStore({
  reducer: rootReducer,
})

bindIpcEventListeners(store.dispatch, store.getState)

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./slices', () => {
    const newRootReducer = require('./slices').default
    store.replaceReducer(newRootReducer)
  })
}

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
export default store
