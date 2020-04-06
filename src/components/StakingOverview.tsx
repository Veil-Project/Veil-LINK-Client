import React from 'react'

interface Props {
  data: number[]
  isDimmed?: boolean
}

const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

const StakingOverview = ({ data, isDimmed }: Props) => {
  const max = Math.max(...data)
  return (
    <div className="flex items-end justify-between relative">
      {data.map((amount: number, i: number) => (
        <div className="relative z-10 text-center text-xs font-semibold">
          <div
            className={`w-8 rounded-sm transition-all ${
              isDimmed ? 'bg-gray-600' : 'bg-teal-500'
            }`}
            style={{ height: (amount / max) * 120 }}
          />
          <div className="h-6 flex items-end justify-center">{days[i]}</div>
        </div>
      ))}
      <div className="z-0 absolute inset-0 flex flex-col justify-between pb-6">
        <div className="h-px bg-gray-600" />
        <div className="h-px bg-gray-600" />
        <div className="h-px bg-gray-600" />
        <div className="h-px bg-gray-600" />
        <div className="h-px bg-gray-600" />
        <div className="h-px bg-gray-600" />
      </div>
    </div>
  )
}

export default StakingOverview
