import React from 'react'

const Overlay = ({ children }: any) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
  >
    {children}
  </div>
)

export default Overlay
