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
  confirmations: number
  isConfirmed: boolean
  isLoaded: boolean
  allInputs: WalletTransactionInput[]
  myInputs: WalletTransactionInput[]
  allOutputs: WalletTransactionOutput[]
  myOutputs: WalletTransactionOutput[]
  myDetails: WalletTransactionDetail[]
  isConversion: boolean
  requiresReveal: boolean
  type: WalletTxType
  category: 'send' | 'receive' | 'stake' | null
  isStakingReward: boolean
  address: string | null
  time: number
  fee: number
  sentAmount: number
  receivedAmount: number
  changeAmount: number
  totalAmount: number
  inputs: {
    txid: string
    index: number
  }[]
}

export class Transaction {
  constructor(walletTx: WalletTransaction) {
    this.txid = walletTx.txid
    this.time = walletTx.time * 1000
    this.updateFromWalletTx(walletTx)
  }

  // TODO: fix this mess
  updateFromWalletTx(walletTx: WalletTransaction) {
    this.confirmations = walletTx.confirmations
    this.isConfirmed = this.confirmations >= 10
    this.isLoaded = walletTx.debug.vout.length > 0
    this.allInputs = walletTx.debug.vin
    this.myInputs = this.allInputs.filter(
      (vin: any) => vin.from_me || vin.is_mine_ki
    )
    this.allOutputs = walletTx.debug.vout
    this.myOutputs = this.allOutputs.filter((vout: any) => vout.is_mine)
    this.myDetails = walletTx.details.filter(
      detail => walletTx.debug.vout[detail.vout]?.is_mine
    )

    this.isConversion =
      this.allOutputs.slice(1).every((vout: any) => vout.is_mine) &&
      this.allInputs.every((vin: any) => vin.from_me)

    const vin = this.myInputs[0]
    const vout = this.myOutputs[0]
    this.isStakingReward =
      !!vin &&
      vin.type === 'zerocoinspend' &&
      !!vout &&
      vout.type === 'zerocoinmint' &&
      !!vout.amount &&
      vin.denom === parseInt(vout.amount)

    this.changeAmount = sum(
      this.myOutputs
        .filter(vout => vout.output_record?.is_change)
        .map((vout: any) =>
          Number(vout.amount || vout.output_record?.amount || 0)
        )
    )
    this.receivedAmount = sum(
      this.myOutputs
        .filter(vout => !vout.output_record?.is_change)
        .map((vout: any) =>
          Number(vout.amount || vout.output_record?.amount || 0)
        )
    )

    const sendDetails = walletTx.details.filter(
      detail => detail.category === 'send'
    )

    if (sendDetails.length) {
      this.sentAmount = sum(sendDetails.map(detail => detail.amount))
    } else {
      this.sentAmount =
        this.changeAmount !== 0
          ? this.receivedAmount * -1
          : -sum(
              this.myInputs.map((vin: any) =>
                Number(
                  vin.amount || vin.denom || vin.output_record?.amount || 0
                )
              )
            ) + this.changeAmount
    }

    if (this.changeAmount > 0) {
      const feeRecord = walletTx.debug.vout.filter(
        vout => vout.type === 'data'
      )[0]
      this.fee = parseFloat(feeRecord?.ct_fee) || 0
    } else {
      this.fee = 0
    }

    this.totalAmount =
      this.sentAmount !== 0
        ? this.sentAmount + this.receivedAmount - this.fee
        : this.receivedAmount

    this.address =
      this.myDetails[0]?.address ||
      (this.myOutputs[0]?.output_record?.stealth_address
        ? 'stealth'
        : walletTx.details[0].address)

    if (!this.isLoaded) {
      this.category = null
    } else if (this.isStakingReward) {
      this.category = 'stake'
    } else {
      this.category = this.totalAmount > 0 ? 'receive' : 'send'
    }

    this.type =
      this.category === 'receive'
        ? this.myOutputs[0]?.type
        : this.allInputs[0]?.type

    this.requiresReveal =
      (this.type === 'ringct' || this.type === 'ct') &&
      this.receivedAmount <= 0.00000001
  }

  get explorerUrl() {
    return `https://explorer.veil-project.com/tx/${this.txid}`
  }
}

export default Transaction
