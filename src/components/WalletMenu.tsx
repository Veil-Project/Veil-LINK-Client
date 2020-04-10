import React from 'react'
import { motion } from 'framer-motion'

interface MenuLinkProps {
  onClick(): void
  label: string
  shortcut?: string
}

const MenuLink = ({ onClick, label, shortcut }: MenuLinkProps) => (
  <button
    tabIndex={-1}
    className="w-full px-2 h-8 rounded flex items-center justify-between hover:bg-blue-500"
    onClick={onClick}
  >
    <span className="text-white">{label}</span>
    <span className="">{shortcut}</span>
  </button>
)

interface MenuProps {
  onOpenWallet(): void
  onBackupWallet(): void
}

const WalletMenu = ({ onOpenWallet, onBackupWallet }: MenuProps) => {
  return (
    <motion.div
      style={{
        transformOrigin: 'top center',
        backgroundColor: '#1a1e21ee',
        backdropFilter: 'blur(8px)',
      }}
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={e => e.nativeEvent.stopImmediatePropagation()}
      className="w-48 bg-gray-700 text-sm text-gray-300 font-medium rounded shadow-lg"
    >
      <div className="flex flex-col p-2">
        <MenuLink onClick={onOpenWallet} label="Open wallet…" shortcut="⌘O" />
      </div>
      <div
        className="border-t p-2"
        style={{ borderColor: 'rgba(255, 255, 255, .05)' }}
      >
        <MenuLink
          onClick={onBackupWallet}
          label="Backup wallet…"
          shortcut="⌘B"
        />
      </div>
    </motion.div>
  )
}

export default WalletMenu
