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
      <div className="flex items-center justify-center mt-2 text-3xl font-extrabold leading-none">
        {spendableBalance.toLocaleString('en-US', {
          minimumFractionDigits: spendableBalance > 1000000 ? 0 : 2,
          maximumFractionDigits: spendableBalance > 1000000 ? 0 : 2,
        })}
        <span
          className="flex items-center py-1 ml-2 text-xs font-bold leading-tight tracking-wide text-blue-600 bg-teal-500 rounded-sm"
          style={{ paddingLeft: 5, paddingRight: 5 }}
        >
          VEIL
        </span>
      </div>
      {marketValue !== null && marketValue > 0 && (
        <div className="mt-2 font-bold text-teal-500">
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
