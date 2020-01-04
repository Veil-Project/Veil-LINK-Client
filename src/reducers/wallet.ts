import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'store'

// TODO: delete me
const DUMMY_ADDRESSES = [
  'sv1qqpmhldsf4990nasfhjdo2350ysdlknfoh295ykasdglkaf235ugfjlkgwrgnnf2350ysdlknfoh295ykasdgdlknfoh2nfoh295ykasdglkaf235ugf3',
  'sv1qqpmhldsfy9h4dgu3g0nfon3dy3o5aofgdskgnk3alf92udk2n0awsrl5kfoj2hn555dgoya2ldh9ksdff2ljlfks02y2yasl5529h9a3ksffknkghgnf',
  'sv1qqpmhldsffak32hh5fsfgfl5gjadkf994d5nj2k3s2gdyrnlk3n9ylkos0kla3dns0askfynahdfkgdw50kfngona22ouhf2fhds5l9yu22yg5o35g9ol',
]

interface Wallet {
  name: string
}

type WalletState = {
  currentReceivingAddress: string | null,
  wallets: Wallet[]
}

// ------------------------------------
// Slice
// ------------------------------------

const initialState: WalletState = {
  currentReceivingAddress: null,
  wallets: []
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    regenerateReceivingAddress: (state) => {
      state.currentReceivingAddress = DUMMY_ADDRESSES[Math.floor(Math.random() * 3)]
    },
    addWallet: (state, action: PayloadAction<Wallet>) => {
      state.wallets.push(action.payload)
    },
  }
})

export const {
  regenerateReceivingAddress
} = walletSlice.actions

// ------------------------------------
// Selectors
// ------------------------------------

const walletSelector = (state: { wallet: WalletState }) => state.wallet
export const selectors = {
  currentReceivingAddress: createSelector(
    walletSelector,
    wallet => wallet.currentReceivingAddress
  ),
  wallets: createSelector(
    walletSelector,
    wallet => wallet.wallets
  ),
}

// ------------------------------------
// Thunks
// ------------------------------------

const delay = (t: number) => new Promise(resolve => setTimeout(resolve, t));

export const createWallet = (): AppThunk => async dispatch => {
  await delay(1000)
  dispatch(walletSlice.actions.addWallet({name: ''}))
}

export default walletSlice.reducer