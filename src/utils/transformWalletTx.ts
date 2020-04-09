import { WalletTransaction } from 'store/slices/transactions'
import { sum } from 'lodash'

export default (walletTx: WalletTransaction) => {
  const allInputs = walletTx.debug.vin
  const myInputs = allInputs.filter((vin: any) => vin.from_me || vin.is_mine_ki)
  const allOutputs = walletTx.debug.vout
  const myOutputs = allOutputs.filter((vout: any) => vout.is_mine)
  const myDetails = walletTx.details.filter(
    detail => walletTx.debug.vout[detail.vout]?.is_mine
  )
  const sendDetails = walletTx.details.filter(
    detail => detail.category === 'send'
  )

  const vin = myInputs[0]
  const vout = myOutputs[0]
  const feeRecord = walletTx.debug.vout.filter(vout => vout.type === 'data')[0]

  const isStakingReward =
    !!vin &&
    vin.type === 'zerocoinspend' &&
    !!vout &&
    vout.type === 'zerocoinmint' &&
    !!vout.amount &&
    vin.denom === parseInt(vout.amount)

  const changeAmount = sum(
    myOutputs
      .filter(vout => vout.output_record?.is_change)
      .map((vout: any) =>
        Number(vout.amount || vout.output_record?.amount || 0)
      )
  )

  const receivedAmount = sum(
    myOutputs
      .filter(vout => !vout.output_record?.is_change)
      .map((vout: any) =>
        Number(vout.amount || vout.output_record?.amount || 0)
      )
  )

  const sentAmount = sendDetails.length
    ? sum(sendDetails.map(detail => detail.amount))
    : changeAmount !== 0
    ? receivedAmount * -1
    : -sum(
        myInputs.map((vin: any) =>
          Number(vin.amount || vin.denom || vin.output_record?.amount || 0)
        )
      ) + changeAmount

  const fee = changeAmount > 0 ? parseFloat(feeRecord?.ct_fee) || 0 : 0

  const totalAmount =
    sentAmount !== 0 ? sentAmount + receivedAmount - fee : receivedAmount

  const category = isStakingReward
    ? 'stake'
    : totalAmount > 0
    ? 'receive'
    : 'send'
  const type = category === 'receive' ? myOutputs[0]?.type : allInputs[0]?.type

  return {
    txid: walletTx.txid,
    time: walletTx.time * 1000,
    confirmations: walletTx.confirmations,
    isConfirmed: walletTx.confirmations >= 10,
    isConversion:
      allOutputs.slice(1).every((vout: any) => vout.is_mine) &&
      allInputs.every((vin: any) => vin.from_me),
    changeAmount,
    receivedAmount,
    sentAmount,
    fee,
    totalAmount,
    address:
      myDetails[0]?.address ||
      (myOutputs[0]?.output_record?.stealth_address
        ? 'stealth'
        : walletTx.details[0].address),
    category,
    type,
    requiresReveal:
      (type === 'ringct' || type === 'ct') && receivedAmount <= 0.00000001,
  }
}
