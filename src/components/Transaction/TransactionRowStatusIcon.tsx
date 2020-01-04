import React from 'react';
import { FiArrowDown, FiArrowUp, FiStar } from 'react-icons/fi';

interface TransactionRowStatusIconProps {
  type: string
}

const TransactionRowStatusIcon = ({ type }: TransactionRowStatusIconProps) => {
  let icon
  switch (type) {
    case 'receive':
      icon = <FiArrowDown className="text-teal-500" size="18" />
      break;
    case 'send':
      icon = <FiArrowUp className="text-white" size="18" />
      break;
    case 'reward':
      icon = <FiStar className="text-yellow-500" size="18" />
      break;
    default:
      icon = null
  }
  return (
    <div className="rounded w-8 h-8 bg-gray-800 my-2 mr-3 flex items-center justify-center">
      {icon}
    </div>
  )
}

export default TransactionRowStatusIcon
