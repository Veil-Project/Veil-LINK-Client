import React from 'react'

interface BalanceProps {
  veilBalance: number
  fiatBalance: number | null
  currency: string
}

const Balance = ({ veilBalance, fiatBalance, currency }: BalanceProps) => (
  <div>
    <div className="leading-none text-3xl font-extrabold flex items-center justify-center">
      {veilBalance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
      <span className="ml-2 font-bold text-sm bg-blue-300 rounded-sm text-blue-600 leading-tight tracking-wide py-1 px-2 flex items-center">
        VEIL
      </span>
    </div>
    {fiatBalance && (
      <div className="font-bold text-teal-500 mt-2">
        {fiatBalance.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{' '}
        {currency.toUpperCase()}
      </div>
    )}
  </div>
)

export default Balance
