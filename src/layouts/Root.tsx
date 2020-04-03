import React, { ReactElement } from 'react'
import { ToastProvider } from 'react-toast-notifications'

interface LayoutProps {
  children: ReactElement
}

const RootLayout = ({ children }: LayoutProps) => (
  <ToastProvider placement="bottom-right" transitionDuration={100}>
    <div className="h-screen max-w-screen overflow-hidden flex text-white antialiased bg-gray-800">
      {children}
    </div>
  </ToastProvider>
)

export default RootLayout
