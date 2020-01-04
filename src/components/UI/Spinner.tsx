import React from 'react'

const Spinner = () => (
  <div className="flex-1 flex flex-col items-center justify-center">
    <div className="w-12 h-12 rounded-full border-2 border-blue-400 animation-spin" style={{ borderRightColor: 'transparent' }}></div>
  </div>
)

export default Spinner