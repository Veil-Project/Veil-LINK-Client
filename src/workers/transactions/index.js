import PromiseWorker from 'promise-worker'
import Worker from 'worker-loader!./worker' // eslint-disable-line import/no-webpack-loader-syntax

const worker = new Worker()
const promiseWorker = new PromiseWorker(worker)

const importWalletTransactions = options =>
  promiseWorker.postMessage({
    type: 'importWalletTransactionsMessage',
    options,
  })

export default { importWalletTransactions }
