import React from 'react'

interface StrengthMeterProps {
  strength: number
}

const StrengthMeter = ({ strength }: StrengthMeterProps) => {
  const color =
    strength < 50
      ? 'bg-red-400'
      : strength < 80
      ? 'bg-orange-400'
      : 'bg-green-400'
  return (
    <div className="w-full h-2 bg-gray-900 flex rounded-full overflow-hidden">
      <div
        className={`flex-none rounded-full ${color}`}
        style={{ width: `${strength}%` }}
      />
    </div>
  )
}

export default StrengthMeter
