import React, { MouseEvent } from 'react'
import classnames from 'classnames'

interface Props {
  on: boolean
  disabled?: boolean
  label?: string
  onToggle(enabled: boolean): void
}

const Toggle = ({ on, disabled = false, label, onToggle }: Props) => {
  const buttonClassName = classnames(
    'flex outline-none active:outline-none focus:outline-none',
    {
      'opacity-50 cursor-not-allowed': disabled,
    }
  )
  const wrapperClassName = classnames(
    'flex-none h-5 w-8 relative border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline',
    {
      'bg-blue-500': on,
      'bg-gray-500': !on,
    }
  )
  const switchClassName = classnames(
    'block h-4 w-4 rounded-full bg-white shadow transform transition ease-in-out duration-200',
    {
      'translate-x-3': on,
      'translate-x-0': !on,
    }
  )

  const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onToggle(!on)
  }

  return (
    <button
      disabled={disabled}
      className={buttonClassName}
      onClick={handleToggle}
    >
      <span
        role="checkbox"
        tabIndex={0}
        aria-checked="false"
        className={wrapperClassName}
      >
        <span aria-hidden="true" className={switchClassName}></span>
      </span>
      <span className="ml-2 text-sm font-medium">{label}</span>
    </button>
  )
}

export default Toggle
