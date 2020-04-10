import Dexie from 'dexie'
import 'dexie-observable'
import { WalletTxType } from 'store/slices/transactions'

interface ITransaction {
  txid: string
  confirmations: number
  isConfirmed: boolean
  isConversion: boolean
  requiresReveal: boolean
  type: WalletTxType
  category: 'send' | 'receive' | 'stake'
  address: string | null
  time: number
  fee: number
  sentAmount: number
  receivedAmount: number
  changeAmount: number
  totalAmount: number
}

class VeilDatabase extends Dexie {
  transactions: Dexie.Table<ITransaction, string>

  constructor() {
    super('VeilX')
    this.version(1).stores({
      transactions: '&txid,time,type,category',
    })
    this.transactions = this.table('transactions')
  }
}

export default new VeilDatabase()
