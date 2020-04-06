import React, { useEffect } from 'react'
import { useStore } from 'store'

const Balance = () => {
  const { state, actions } = useStore()
  const { spendableBalance, marketValue } = state.balance

  useEffect(() => {
    actions.balance.fetch()
    actions.balance.fetchMarketPrice()
  }, [actions.balance])

  return (
    <div>
      <div className="mt-2 leading-none text-3xl font-extrabold flex items-center justify-center">
        {spendableBalance.toLocaleString('en-US', {
          minimumFractionDigits: spendableBalance > 1000000 ? 0 : 2,
          maximumFractionDigits: spendableBalance > 1000000 ? 0 : 2,
        })}
        <span
          className="ml-2 font-bold text-xs bg-teal-500 rounded-sm text-blue-600 leading-tight tracking-wide py-1 flex items-center"
          style={{ paddingLeft: 5, paddingRight: 5 }}
        >
          VEIL
        </span>
      </div>
      {marketValue !== null && marketValue > 0 && (
        <div className="font-bold text-teal-500 mt-2">
          {marketValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          USD
        </div>
      )}
    </div>
  )
}
export default Balance
