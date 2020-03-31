import RpcClient from 'lib/veild-rpc.js'

interface RpcClientOptions {
  user: string
  pass: string
  port?: string
  host?: string
  protocol?: 'http' | 'https'
}

let client: any

// Wrap RPC calls in a promise
const callAsync = (method: string, ...params: Array<any>): any =>
  new Promise((resolve, reject) => {
    if (!client) {
      reject(new Error('Not connected'))
      return
    }

    if (!client[method]) {
      reject(new Error(`Unknown command: ${method}`))
      return
    }

    client[method](
      ...params.filter(p => p !== undefined),
      (err: any, ret: any) => {
        if (err) {
          reject(err)
          return
        }

        if (ret) {
          const { result } = ret
          resolve(result)
        } else {
          reject('client not available')
        }
      }
    )
  })

export default {
  initialize(options: RpcClientOptions) {
    client = new RpcClient({
      host: 'localhost',
      protocol: 'http',
      port: '8332',
      ...options,
    })
  },

  async listTransactions(blockhash?: string) {
    const { transactions } = await callAsync('listSinceBlock', blockhash) //, '*', count, offset)
    const txids: string[] = Array.from(
      new Set(transactions.map((tx: any) => tx.txid))
    )
    return await Promise.all(txids.map(txid => this.getTransaction(txid)))
  },

  async getTransaction(txid: string) {
    return await callAsync('getTransaction', txid)
  },

  async getSpendableBalance() {
    return await callAsync('getSpendableBalance')
  },

  async getBalances() {
    const breakdown = await callAsync('getbalances')
    return {
      basecoinSpendable: parseFloat(breakdown.basecoin_spendable),
      basecoinUnconfirmed: parseFloat(breakdown.basecoin_unconfirmed),
      basecoinImmature: parseFloat(breakdown.basecoin_immature),
      ctSpendable: parseFloat(breakdown.ct_spendable),
      ctUnconfirmed: parseFloat(breakdown.ct_spendable),
      ctImmature: parseFloat(breakdown.ct_spendable),
      ringctSpendable: parseFloat(breakdown.ringct_spendable),
      ringctUnconfirmed: parseFloat(breakdown.ringct_spendable),
      ringctImmature: parseFloat(breakdown.ringct_spendable),
      zerocoinSpendable: parseFloat(breakdown.zerocoin_spendable),
      zerocoinUnconfirmed: parseFloat(breakdown.zerocoin_spendable),
      zerocoinImmature: parseFloat(breakdown.zerocoin_spendable),
    }
  },

  async getBlockchainInfo() {
    return await callAsync('getBlockchainInfo')
  },

  async getWalletInfo() {
    return await callAsync('getwalletinfo')
  },

  async encryptWallet(password: string) {
    return await callAsync('encryptWallet', password)
  },

  async unlockWalletForStaking(password: string) {
    return await callAsync('walletpassphrase', password, true, 24 * 60 * 60)
  },

  async unlockWallet(password: string) {
    return await callAsync('walletpassphrase', password, false, 60 * 60)
  },

  async lockWallet() {
    return await callAsync('walletlock')
  },

  async getZerocoinBalance() {
    return await callAsync('getzerocoinbalance')
  },

  async getNewAddress() {
    return await callAsync('getnewaddress')
  },

  async getAddressInfo(address: string) {
    return await callAsync('getaddressinfo', address)
  },

  async validateAddress(address: string) {
    return await callAsync('validateaddress', address)
  },

  async sendToAddress(address: string, amount: number) {
    return await callAsync('sendtoaddress', address, amount)
  },

  async sendStealthToStealth(address: string, amount: number) {
    return await callAsync('sendstealthtostealth', address, amount)
  },

  async sendCommand(command: string) {
    const [cmd, ...args] = command
      .match(/"[^"]+"|'[^']+'|\S+/g)
      ?.map(arg => arg.replace(/^["']|["']$/g, ''))
    return await callAsync(cmd, ...args)
  },
}
