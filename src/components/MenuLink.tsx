import React from 'react'
import { Link } from '@reach/router'

interface MenuLinkProps {
  label: string
  shortcut?: string
  to?: string
  onClick?(): void
  disabled?: boolean
}

const MenuLink = ({
  onClick,
  label,
  to,
  shortcut,
  disabled = false,
}: MenuLinkProps) =>
  to ? (
    <Link
      to={to}
      tabIndex={-1}
      className={
        'w-full px-2 h-8 rounded flex items-center justify-between font-medium ' +
        (disabled ? 'opacity-50 pointer-events-none' : 'hover:bg-blue-500')
      }
      onClick={onClick}
    >
      <span className="text-white">{label}</span>
      <span className="">{shortcut}</span>
    </Link>
  ) : (
    <button
      tabIndex={-1}
      disabled={disabled}
      className={
        'w-full px-2 h-8 rounded flex items-center justify-between font-medium ' +
        (disabled ? 'opacity-50 pointer-events-none' : 'hover:bg-blue-500')
      }
      onClick={onClick}
    >
      <span className="text-white">{label}</span>
      <span className="">{shortcut}</span>
    </button>
  )

export default MenuLink
