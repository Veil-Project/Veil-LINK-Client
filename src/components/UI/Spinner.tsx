import React from 'react'

interface Props {
  size?: number
  strokeWidth?: number
  percentage?: number | null
}

const Spinner = ({ size = 20, strokeWidth = 3, percentage }: Props) => {
  const radius = size - strokeWidth / 2
  const width = size * 2
  const height = size * 2
  const viewBox = `0 0 ${width} ${height}`
  const dashArray = radius * Math.PI * 2
  const dashOffset =
    dashArray - dashArray * (!percentage ? 0.1 : percentage / 100)

  return (
    <svg
      className={`m-auto transition-all duration-200 ${
        percentage ? ' animation-none' : ' animation-spin animation-linear'
      }`}
      style={{ transform: 'rotate(-90deg)' }}
      width={size * 2}
      height={size * 2}
      viewBox={viewBox}
    >
      <circle
        className="text-gray-500 stroke-current"
        fill="none"
        cx={size}
        cy={size}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
      />
      <circle
        className="text-teal-500 stroke-current transition-all duration-500 ease-in-out"
        fill="none"
        cx={size}
        cy={size}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
        }}
      />
    </svg>
  )
}

export default Spinner
