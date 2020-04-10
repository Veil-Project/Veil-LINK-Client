import registerPromiseWorker from 'promise-worker/register'
import db from 'store/db'
import rpc from 'store/effects/rpc'
import { uniq, map } from 'lodash'
import transformWalletTx from 'utils/transformWalletTx'

registerPromiseWorker(async ({ type, options }) => {
  if (type === 'importWalletTransactionsMessage') {
    const { credentials, lastBlock } = options

    rpc.initialize(credentials)

    const { lastblock: newLastBlock, transactions } = await rpc.listSinceBlock(
      lastBlock
    )
    if (transactions.length > 0) {
      const txids = uniq(map(transactions, 'txid'))
      const fullTransactions = await Promise.all(
        txids.map(txid => rpc.getTransaction(txid))
      )
      await db.transactions.bulkPut(
        fullTransactions.map(tx => transformWalletTx(tx))
      )
    }

    return newLastBlock
  }
})
