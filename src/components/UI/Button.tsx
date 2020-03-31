import React, { MouseEvent } from 'react'
import { Link } from '@reach/router'
import classnames from 'classnames'

interface ButtonProps {
  to?: string
  onClick?(e: MouseEvent<HTMLButtonElement>): void
  children: any
  className?: string
  disabledClassName?: string
  primary?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}

const Button = ({
  to,
  onClick,
  className,
  disabledClassName,
  disabled = false,
  primary = false,
  size = 'md',
  ...props
}: ButtonProps) => {
  const btnClass = classnames(
    className,
    'text-white font-semibold rounded pb-px inline-flex items-center justify-center',
    {
      'h-8 px-3 text-xs': size === 'sm',
      'h-9 px-4 text-sm': size === 'md',
      'h-10 px-5': size === 'lg',
      'h-12 px-6': size === 'xl',
      'bg-blue-500': !disabled && primary,
      'bg-gray-600': !disabled && !primary,
      'bg-gray-600 opacity-50 cursor-default text-gray-400': disabled,
    }
  )

  return to ? (
    <Link to={to} className={btnClass} {...props} />
  ) : (
    <button
      onClick={onClick}
      className={[btnClass, disabled ? disabledClassName : ''].join(' ')}
      disabled={disabled}
      {...props}
    />
  )
}

export default Button
