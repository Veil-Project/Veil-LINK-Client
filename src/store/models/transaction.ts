import { sum } from 'lodash'

type WalletTxType =
  | 'basecoin'
  | 'ringct'
  | 'ct'
  | 'zerocoin'
  | 'zerocoinspend'
  | 'zerocoinmint'
  | 'data'

type WalletTransactionInput = {
  from_me: boolean
  is_change: boolean
  prevout_hash: string
  prevout_n: number
  type: WalletTxType
  has_tx_rec: boolean
  output_record: any
  denom?: number
}

type WalletTransactionOutput = {
  type: WalletTxType
  ct_fee: string
  data: string
  is_mine: boolean
  has_tx_rec: boolean
  output_record: any
  amount?: string
}

export type WalletTransactionDetail = {
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
  type: WalletTxType
  category: 'send' | 'receive' | 'stake' | null
  isStakingReward: boolean
  address: string | null
  time: number
  sentAmount: number
  receivedAmount: number
  changeAmount: number
  fee: number
  totalAmount: number
  inputs: {
    txid: string
    index: number
  }[]
}

export class Transaction {
  constructor(walletTx: WalletTransaction) {
    this.txid = walletTx.txid
    this.walletTx = walletTx

    this.type = this.resolveType()
    this.isStakingReward = this.resolveIsStakingReward()
    this.address = this.resolveAddress()
    this.time = this.resolveTime()
    this.changeAmount = this.resolveChangeAmount()
    this.receivedAmount = this.resolveReceivedAmount()
    this.sentAmount = this.resolveSentAmount()
    this.fee = this.resolveFee()
    this.totalAmount = this.resolveTotalAmount()
    this.category = this.resolveCategory()

    // Resolve actual inputs
    // this.inputs = walletTx.details
    //   .filter(detail => detail.category === 'send')
    //   .map(vin => ({
    //     txid: vin.prevout_hash,
    //     index: vin.prevout_n,
    //   }))
  }

  get isLoaded() {
    return this.walletTx.debug.vout.length > 0
  }

  get requiresReveal() {
    return (
      (this.type === 'ringct' || this.type === 'ct') &&
      this.receivedAmount <= 0.00000001
    )
  }

  resolveType() {
    return this.category === 'receive'
      ? this.myOutputs[0]?.type
      : this.allInputs[0]?.type
  }

  resolveCategory() {
    if (!this.isLoaded) return null
    if (this.isStakingReward) return 'stake'

    return this.totalAmount > 0 ? 'receive' : 'send'
  }

  resolveIsStakingReward() {
    const vin = this.myInputs[0]
    const vout = this.myOutputs[0]
    return (
      !!vin &&
      vin.type === 'zerocoinspend' &&
      !!vout &&
      vout.type === 'zerocoinmint' &&
      !!vout.amount &&
      vin.denom === parseInt(vout.amount)
    )
  }

  get confirmed() {
    return this.confirmations >= 10
  }

  get toSelf() {
    return
  }

  resolveAddress() {
    return (
      this.myDetails[0]?.address ||
      (this.myOutputs[0]?.output_record?.stealth_address
        ? 'stealth'
        : this.walletTx.details[0].address)
    )
  }

  resolveTime() {
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
      detail => this.walletTx.debug.vout[detail.vout]?.is_mine
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

  resolveSentAmount() {
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
  }

  resolveChangeAmount() {
    return sum(
      this.myOutputs
        .filter(vout => vout.output_record?.is_change)
        .map((vout: any) =>
          Number(vout.amount || vout.output_record?.amount || 0)
        )
    )
  }

  resolveReceivedAmount() {
    return sum(
      this.myOutputs
        .filter(vout => !vout.output_record?.is_change)
        .map((vout: any) =>
          Number(vout.amount || vout.output_record?.amount || 0)
        )
    )
  }

  resolveFee() {
    if (this.changeAmount > 0) {
      const feeRecord = this.walletTx.debug.vout.filter(
        vout => vout.type === 'data'
      )[0]
      return parseFloat(feeRecord?.ct_fee) || 0
    } else {
      return 0
    }
  }

  resolveTotalAmount() {
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
