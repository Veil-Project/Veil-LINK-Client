import Dexie from 'dexie'
import 'dexie-observable'
import moment from 'moment'
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

let db: VeilDatabase

export default {
  initialize({ onChanges }: { onChanges(changes: any): void }) {
    db = new VeilDatabase()
    db.on('changes', onChanges)
  },

  async addTransactions(transactions: any[]) {
    try {
      await db.transactions.bulkPut(transactions)
    } catch (e) {
      console.error(e.stack)
    }
  },
  async listTransactionIds({ category, query }: any = {}) {
    const txs = db.transactions.orderBy('time').reverse()

    if (!category && !query) {
      return txs.primaryKeys()
    }

    return (await txs.toArray())
      .filter(
        (tx: any) =>
          (!category || tx.category === category) && tx.txid.includes(query)
      )
      .map((tx: any) => tx.txid)
  },
  async fetchTransactions() {
    return await db.transactions.toArray()
  },
  async fetchTransaction(txid: string) {
    return await db.transactions
      .where('txid')
      .equals(txid)
      .first()
  },
  async fetchFirstTransaction() {
    return await db.transactions.orderBy('time').first()
  },
  async fetchStakesForDay(daysAgo: number) {
    const start = moment()
      .subtract(daysAgo, 'days')
      .startOf('day')
      .valueOf()
    const end = moment()
      .subtract(daysAgo, 'days')
      .endOf('day')
      .valueOf()
    return await db.transactions
      .where('time')
      .between(start, end, true, true)
      .filter((tx: any) => tx.category === 'stake')
      .toArray()
  },
  async clearTransactions() {
    return await db.transactions.clear()
  },
}
