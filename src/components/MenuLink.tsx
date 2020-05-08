import React from 'react'

interface MenuLinkProps {
  label: string
  shortcut?: string
  onClick?(): void
  disabled?: boolean
}

const MenuLink = ({
  onClick,
  label,
  shortcut,
  disabled = false,
}: MenuLinkProps) => (
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
