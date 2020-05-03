import registerPromiseWorker from 'promise-worker/register'
import db from 'store/db'
import rpc from 'store/effects/rpc'
import { uniq, map, chunk } from 'lodash'

import transformWalletTx from 'utils/transformWalletTx'
import { sleep } from 'utils/sleep'

const isCoinstake = tx =>
  tx.debug.vin.length === 0 &&
  tx.debug.vout.length === 1 &&
  tx.debug.vout[0].amount === '0.00'

registerPromiseWorker(async ({ type, options }) => {
  if (type === 'importWalletTransactionsMessage') {
    const { credentials, lastBlock } = options

    rpc.initialize(credentials)

    const { lastblock: newLastBlock, transactions } = await rpc.listSinceBlock(
      lastBlock
    )
    if (transactions.length > 0) {
      const txids = uniq(map(transactions, 'txid'))
      let fullTransactions = []
      const chunkedTxids = chunk(txids, 500)
      for (let i = 0; i < chunkedTxids.length; i++) {
        fullTransactions = await Promise.all(
          chunkedTxids[i].map(txid => rpc.getTransaction(txid))
        )
        await db.transactions.bulkPut(
          fullTransactions
            .filter(tx => !isCoinstake(tx) && tx.confirmations >= 0)
            .map(tx => transformWalletTx(tx))
        )
        await sleep(500)
      }
    }

    return { lastBlock: newLastBlock, transactionCount: transactions.length }
  }
})
