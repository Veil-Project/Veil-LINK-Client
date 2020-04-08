import React from 'react'
import { motion } from 'framer-motion'
import moment from 'moment'

interface Props {
  data: number[]
  isDimmed?: boolean
}

const StakingOverview = ({ data, isDimmed }: Props) => {
  const max = Math.max(...data)
  return (
    <div
      className="flex items-end justify-between relative"
      style={{ height: 'calc(120px + 1.5rem)' }}
    >
      {data.map((amount: number, i: number) => (
        <div
          key={i}
          className="relative z-10 text-center text-xs font-semibold"
        >
          <motion.div
            title={`${amount} VEIL`}
            className={`w-8 rounded-sm transition-all ${
              isDimmed ? 'bg-gray-600' : 'bg-teal-500'
            }`}
            animate={{
              height: amount > 0 && max > 0 ? (amount / max) * 120 : 0,
            }}
          />
          <div className="h-6 flex items-end justify-center uppercase">
            {moment()
              .subtract(7 - i, 'days')
              .format('dd')}
          </div>
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
