import React, { memo } from 'react'
import { FiArrowDown, FiArrowUp, FiStar } from 'react-icons/fi'

interface StatusIconProps {
  category: string | null
}

const StatusIcon = memo(({ category }: StatusIconProps) => {
  let icon
  switch (category) {
    case 'receive':
      icon = <FiArrowDown className="text-teal-500" size="18" />
      break
    case 'send':
      icon = <FiArrowUp className="text-white" size="18" />
      break
    case 'reward':
      icon = <FiStar className="text-yellow-500" size="18" />
      break
    default:
      icon = null
  }
  return (
    <div
      className="rounded w-8 h-8 my-2 mr-3 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(255,255,255,.066)' }}
    >
      {icon}
    </div>
  )
})

export default StatusIcon
