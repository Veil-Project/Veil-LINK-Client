import React, { ReactElement } from 'react'
import Notifications from '../components/UI/Notifications'

interface LayoutProps {
  children: ReactElement
}

const RootLayout = ({ children }: LayoutProps) => (
  <div className="h-screen max-w-screen overflow-hidden flex text-white antialiased bg-gray-800">
    {children}
    <Notifications />
  </div>
)

export default RootLayout
