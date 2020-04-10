import 'dexie-observable'
import moment from 'moment'
import db from 'store/db'

export default {
  initialize({ onChanges }: { onChanges(changes: any): void }) {
    db.on('changes', onChanges)
    db.open()
  },

  async addTransaction(transaction: any) {
    try {
      await db.transactions.put(transaction)
    } catch (e) {
      console.error(e.stack)
    }
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
