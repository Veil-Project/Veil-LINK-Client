import React, { useState } from 'react'

const StatusBar = () => {
  const [tooltipVisible, setTooltipVisibility] = useState(false)

  return (
    <div
      className="p-2 -m-2"
      onMouseOver={() => setTooltipVisibility(true)}
      onMouseOut={() => setTooltipVisibility(false)}
    >
      <div className="bg-gray-700 rounded-full px-6 h-2 relative text-xs font-medium">
        <div className="absolute w-1/5 left-0 top-0 bottom-0 bg-gradient-r-blue rounded-full">
          <div
            className={`absolute bottom-0 right-0 mb-4 leading-none p-2 rounded bg-gray-600 text-gray-200 cursor-default ${!tooltipVisible && 'hidden'}`}
            style={{ transform: 'translateX(50%)' }}
          >
            Syncing…
            <div 
              className="border-4 border-gray-600 absolute bottom-0 -mb-2 -ml-1"
              style={{ 
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                left: '50%'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusBar