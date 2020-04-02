import { sum } from 'lodash'

type WalletTransactionInput = {
  from_me: boolean
  is_change: boolean
  prevout_hash: string
  prevout_n: number
  type: string
  has_tx_rec: boolean
  output_record: any
  denom?: number
}

type WalletTransactionOutput = {
  type: string
  ct_fee: string
  data: string
  is_mine: boolean
  has_tx_rec: boolean
  output_record: any
  amount?: number
}

type WalletTransactionDetail = {
  category: 'receive' | 'send'
  address: string
  amount: number
  label?: string
  vout: number
  fee?: number
  abandoned: boolean
}

export type WalletTransaction = {
  txid: string
  time: number
  confirmations: number
  blockhash?: string
  blockindex?: number
  blocktime?: number
  address: string
  amount: number
  fee?: number
  details: WalletTransactionDetail[]
  debug: {
    vin: WalletTransactionInput[]
    vout: WalletTransactionOutput[]
  }
}

export interface Transaction {
  txid: string
  walletTx: WalletTransaction
  inputs: {
    txid: string
    index: number
  }[]
}

export class Transaction {
  constructor(walletTx: WalletTransaction) {
    this.txid = walletTx.txid
    this.walletTx = walletTx

    // Resolve actual inputs
    // this.inputs = walletTx.details
    //   .filter(detail => detail.category === 'send')
    //   .map(vin => ({
    //     txid: vin.prevout_hash,
    //     index: vin.prevout_n,
    //   }))
  }

  get requiresReveal() {
    return (
      this.category === 'receive' &&
      this.type === 'ringct' &&
      this.receivedAmount <= 0.00000001
    )
  }

  get type() {
    return this.category === 'receive'
      ? this.myOutputs[0]?.type
      : this.myInputs[0]?.type
  }

  get category(): string {
    return this.totalAmount > 0 ? 'receive' : 'send'
  }

  get confirmed() {
    return this.confirmations >= 10
  }

  get toSelf() {
    return
  }

  get address() {
    return (
      this.myDetails[0]?.address ||
      (this.myOutputs[0]?.output_record?.stealth_address
        ? 'stealth'
        : this.walletTx.details[0].address)
    )
  }

  get time() {
    return this.walletTx.time * 1000
  }

  get allInputs() {
    return this.walletTx.debug.vin
  }

  get myInputs() {
    return this.allInputs.filter((vin: any) => vin.from_me || vin.is_mine_ki)
  }

  get allOutputs() {
    return this.walletTx.debug.vout
  }

  get myDetails() {
    return this.walletTx.details.filter(
      detail => this.walletTx.debug.vout[detail.vout].is_mine
    )
  }

  get myOutputs() {
    return this.allOutputs.filter((vout: any) => vout.is_mine)
  }

  get isConversion() {
    return (
      this.allOutputs.slice(1).every((vout: any) => vout.is_mine) &&
      this.allInputs.every((vin: any) => vin.from_me)
    )
  }

  get isVisible() {
    return true
    // return !this.isConversion && this.totalAmount !== 0
  }

  get sentAmount() {
    const sendDetails = this.walletTx.details.filter(
      detail => detail.category === 'send'
    )

    if (sendDetails.length) {
      return sum(sendDetails.map(detail => detail.amount))
    }

    return this.changeAmount !== 0
      ? this.receivedAmount * -1
      : -sum(
          this.myInputs.map((vin: any) =>
            Number(vin.amount || vin.denom || vin.output_record?.amount || 0)
          )
        ) + this.changeAmount

    const sends = this.walletTx.details
      .filter(detail => detail.category === 'send')
      .map(detail => Number(detail.amount))
    const zerocoinSpends =
      this.type === 'zerocoinmint'
        ? sum(this.walletTx.debug.vin.map(vin => vin.denom || 0))
        : 0
    return sum(sends) + zerocoinSpends
  }

  get changeAmount() {
    return sum(
      this.myOutputs
        .filter(vout => vout.output_record?.is_change)
        .map((vout: any) =>
          Number(vout.amount || vout.output_record?.amount || 0)
        )
    )
  }

  get receivedAmount() {
    return sum(
      this.myOutputs
        .filter(vout => !vout.output_record?.is_change)
        .map((vout: any) =>
          Number(vout.amount || vout.output_record?.amount || 0)
        )
    )
  }

  get fee() {
    if (this.changeAmount > 0) {
      const feeRecord = this.walletTx.debug.vout.filter(
        vout => vout.type === 'data'
      )[0]
      return parseFloat(feeRecord?.ct_fee) || 0
    } else {
      return 0
    }
  }

  get totalAmount() {
    return this.sentAmount !== 0
      ? this.sentAmount + this.receivedAmount - this.fee
      : this.receivedAmount
  }

  get confirmations() {
    return this.walletTx.confirmations
  }

  get explorerUrl() {
    return `https://explorer.veil-project.com/tx/${this.txid}`
  }
}

export default Transaction
