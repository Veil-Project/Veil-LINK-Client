import React, { MouseEvent } from 'react'
import classnames from 'classnames'
import ExternalLink from 'components/ExternalLink'

interface ButtonProps {
  to?: string
  onClick?(e: MouseEvent<HTMLButtonElement>): void
  children: any
  className?: string
  disabledClassName?: string
  primary?: boolean
  secondary?: boolean
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
  secondary = false,
  size = 'md',
  ...props
}: ButtonProps | any) => {
  const btnClass = classnames(
    className,
    'text-white font-semibold rounded pb-px inline-flex items-center justify-center',
    {
      'h-8 px-3 text-xs': size === 'sm',
      'h-9 px-4 text-sm': size === 'md',
      'h-10 px-5': size === 'lg',
      'h-12 px-6': size === 'xl',
      'bg-blue-500': !disabled && primary,
      'bg-gray-500': !disabled && secondary,
      'bg-gray-600': !disabled && !secondary && !primary,
      'cursor-default text-gray-400': disabled,
    }
  )

  const btnStyle = disabled ? { backgroundColor: '#ffffff11' } : {}

  return to ? (
    <ExternalLink href={to} className={btnClass} style={btnStyle} {...props} />
  ) : (
    <button
      onClick={onClick}
      className={[btnClass, disabled ? disabledClassName : ''].join(' ')}
      style={btnStyle}
      disabled={disabled}
      {...props}
    />
  )
}

export default Button
