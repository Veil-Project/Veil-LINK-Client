import React from 'react'
import { motion } from 'framer-motion'
import MenuLink from './MenuLink'
import { useStore } from 'store'

interface MenuProps {
  connectionMethod: 'daemon' | 'rpc'
  onOpenWallet(): void
  onBackupWallet(): void
  onDisconnect(): void
}

const WalletMenu = ({
  connectionMethod,
  onOpenWallet,
  onBackupWallet,
  onDisconnect,
}: MenuProps) => {
  const { actions } = useStore()

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
      className="w-48 text-sm font-medium text-gray-300 bg-gray-700 rounded shadow-lg"
    >
      <div
        className="p-2 border-b"
        style={{ borderColor: 'rgba(255, 255, 255, .05)' }}
      >
        <MenuLink
          onClick={() => actions.app.openModal('change-password')}
          label="Change password"
        />
        {connectionMethod === 'rpc' && (
          <MenuLink onClick={onDisconnect} label="Disconnect" />
        )}
        {connectionMethod === 'daemon' && (
          <MenuLink
            onClick={onBackupWallet}
            label="Backup wallet…"
            shortcut={window.platform === 'darwin' ? '⌘B' : 'Win+B'}
          />
        )}
      </div>
      {connectionMethod === 'daemon' && (
        <div className="flex flex-col p-2">
          <MenuLink
            onClick={onOpenWallet}
            label="Open wallet…"
            shortcut={window.platform === 'darwin' ? '⌘O' : 'Win+O'}
          />
        </div>
      )}
    </motion.div>
  )
}

export default WalletMenu
