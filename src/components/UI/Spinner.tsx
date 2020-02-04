import React from 'react'

interface SpinnerProps {
  progress?: number
}

// TODO: hook up progress display
const Spinner = ({ progress }: SpinnerProps) => (
  <div className="flex-1 flex flex-col items-center justify-center">
    <div
      className="w-12 h-12 rounded-full border-2 border-blue-400 animation-spin animation-linear"
      style={{ borderRightColor: 'transparent' }}
    />
  </div>
)

export default Spinner
