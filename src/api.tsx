import RpcClient from 'lib/veild-rpc.js'

interface Api {
  client: any
}

interface ApiParams {
  user: string
  pass: string
}

class Api {
  constructor({ user, pass }: ApiParams) {
    this.client = new RpcClient({
      user,
      pass,
      protocol: 'http',
      host: 'localhost',
      port: '8332',
      logger: 'debug',
    })
  }

  _call(method: string, ...params: Array<any>): any {
    return new Promise((resolve, reject) => {
      if (!this.client[method]) {
        reject({ message: `Unknown command: ${method}` })
      }

      this.client[method](...params, (err: any, ret: any) => {
        if (err) reject(err)

        if (ret) {
          const { result } = ret
          resolve(result)
        } else {
          reject('client not available')
        }
      })
    })
  }

  async listTransactions(count: number = 100, offset: number = 0) {
    const { transactions } = await this._call('listSinceBlock') //, "*", count, offset)
    const txids: string[] = Array.from(
      new Set(transactions.map((tx: any) => tx.txid))
    )
    return await Promise.all(
      txids.map((txid: string) => this.getTransaction(txid))
    )
  }

  async getTransaction(txid: string) {
    return await this._call('getTransaction', txid)
  }

  async getSpendableBalance() {
    return await this._call('getSpendableBalance')
  }

  async getBalances() {
    return await this._call('getbalances')
  }

  async getBlockchainInfo() {
    return await this._call('getBlockchainInfo')
  }

  async getWalletInfo() {
    return await this._call('getwalletinfo')
  }

  async encryptWallet(password: string) {
    return await this._call('encryptWallet', password)
  }

  async unlockWalletForStaking(password: string) {
    return await this._call('walletpassphrase', password, true, 24 * 60 * 60)
  }

  async unlockWallet(password: string) {
    return await this._call('walletpassphrase', password, false, 60)
  }

  async lockWallet() {
    return await this._call('walletlock')
  }

  async getZerocoinBalance() {
    return await this._call('getzerocoinbalance')
  }

  async getNewAddress() {
    return await this._call('getnewaddress')
  }

  async getAddressInfo(address: string) {
    return await this._call('getaddressinfo', address)
  }

  async validateAddress(address: string) {
    return await this._call('validateaddress', address)
  }

  async sendToAddress(address: string, amount: number) {
    return await this._call('sendtoaddress', address, amount)
  }

  async sendStealthToStealth(address: string, amount: number) {
    return await this._call('sendstealthtostealth', address, amount)
  }

  async sendCommand(command: string) {
    // @ts-ignore
    const [cmd, ...args] = command
      .match(/"[^"]+"|'[^']+'|\S+/g)
      ?.map(arg => arg.replace(/^["']|["']$/g, ''))
    console.log(cmd, args)
    return await this._call(cmd, ...args)
  }

  async start(seed?: string) {
    return await window.ipcRenderer.invoke('start-daemon', seed)
  }

  async stop() {
    return await window.ipcRenderer.invoke('stop-daemon')
  }

  async restart() {
    await this.stop()
    return await this.start()
  }
}

export default new Api({
  user: window.remote.getGlobal('rpcUser'),
  pass: window.remote.getGlobal('rpcPass'),
})
