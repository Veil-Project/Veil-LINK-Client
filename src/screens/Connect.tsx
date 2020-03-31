import React, { useState } from 'react'
import Login from './Connect/Login'
import Start from './Connect/Start'
import Install from './Connect/Install'

const Connect = () => {
  const [mode, setMode] = useState<'install' | 'start' | 'login'>('install')

  const renderMode = () => {
    switch (mode) {
      case 'install':
        return <Install setMode={setMode} />
      case 'start':
        return <Start setMode={setMode} />
      case 'login':
        return <Login setMode={setMode} />
    }
  }

  return (
    <div className="mx-auto max-w-sm flex-1 flex flex-col p-6 text-center">
      {renderMode()}
    </div>
  )
}

export default Connect
