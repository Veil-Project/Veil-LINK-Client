import React, { ReactElement } from 'react'
import { ToastProvider } from 'react-toast-notifications'
import ErrorBoundary from 'components/ErrorBoundary'

interface LayoutProps {
  children: ReactElement
}

const RootLayout = ({ children }: LayoutProps) => (
  <ToastProvider
    placement="bottom-right"
    transitionDuration={100}
    autoDismiss={true}
  >
    <ErrorBoundary>
      <div className="h-screen max-w-screen overflow-hidden flex text-white antialiased bg-gray-800">
        {children}
      </div>
    </ErrorBoundary>
  </ToastProvider>
)

export default RootLayout
