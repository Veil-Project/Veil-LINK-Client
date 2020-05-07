import React from 'react'
import { motion } from 'framer-motion'
import MenuLink from './MenuLink'

interface MenuProps {
  onOpenWallet(): void
  onBackupWallet(): void
}

const WalletMenu = ({ onOpenWallet, onBackupWallet }: MenuProps) => {
  return (
    <motion.div
      style={{
        transformOrigin: 'top center',
        backgroundColor: '#1a1e21f8',
        willChange: 'transform, opacity',
      }}
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={e => e.nativeEvent.stopImmediatePropagation()}
      className="w-48 bg-gray-700 text-sm text-gray-300 font-medium rounded shadow-lg"
    >
      <div
        className="border-b p-2"
        style={{ borderColor: 'rgba(255, 255, 255, .05)' }}
      >
        <MenuLink to="/change-password" label="Change password" />
        <MenuLink
          onClick={onBackupWallet}
          label="Backup wallet…"
          shortcut={window.platform === 'darwin' ? '⌘B' : 'Win+B'}
        />
      </div>
      <div className="flex flex-col p-2">
        <MenuLink
          onClick={onOpenWallet}
          label="Open wallet…"
          shortcut={window.platform === 'darwin' ? '⌘O' : 'Win+O'}
        />
      </div>
    </motion.div>
  )
}

export default WalletMenu
