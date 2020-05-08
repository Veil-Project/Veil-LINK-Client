import React, { useState } from 'react'

import General from './About/General'
import Peers from './About/Peers'

import Modal from 'components/UI/Modal'

interface ActiveLinkProps {
  label: string
  isActive: boolean
  onClick(): void
}

const ActiveLink = ({ label, isActive, onClick }: ActiveLinkProps) => (
  <button
    onClick={onClick}
    className={
      isActive
        ? 'px-4 h-10 rounded flex items-center justify-start bg-gray-500 text-sm text-white font-medium'
        : 'px-4 h-10 rounded flex items-center justify-start text-gray-300 text-sm font-medium hover:text-white hover:bg-gray-700'
    }
  >
    {label}
  </button>
)

const About = () => {
  const [screen, setScreen] = useState('general')

  return (
    <Modal className="w-full max-w-2xl h-full flex" canClose={true}>
      <div
        className="flex-none w-48 p-4 flex flex-col"
        style={{ backgroundColor: 'rgba(0,0,0,.15)' }}
      >
        <ActiveLink
          label="General"
          isActive={screen === 'general'}
          onClick={() => setScreen('general')}
        />
        <ActiveLink
          label="Peers"
          isActive={screen === 'peers'}
          onClick={() => setScreen('peers')}
        />
      </div>
      <div className="flex-1 flex">
        {screen === 'general' && <General />}
        {screen === 'peers' && <Peers />}
      </div>
    </Modal>
  )
}
export default About
