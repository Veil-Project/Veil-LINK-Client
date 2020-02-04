import React from 'react'

interface ProgressBarProps {
  value: number
}

const ProgressBar = ({ value }: ProgressBarProps) => (
  <div className="w-32 rounded-full bg-gray-900 h-2 flex p-px">
    <div
      className="bg-gradient-r-blue rounded-full"
      style={{ width: `${value}%` }}
    />
  </div>
)

export default ProgressBar
