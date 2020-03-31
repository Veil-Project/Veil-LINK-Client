import React, { MouseEvent } from 'react'
import Button from 'components/UI/Button'

interface WelcomeProps {
  switchMode: Function
}

const ChooseOption = ({ switchMode }: WelcomeProps) => (
  <div className="max-w-xs m-auto">
    <div className="bg-gray-700 rounded p-6">
      <Button
        primary
        onClick={() => switchMode('create-wallet')}
        size="xl"
        className="w-full mb-2"
      >
        Create new wallet
      </Button>
      <Button
        onClick={() => switchMode('restore-wallet')}
        size="xl"
        className="w-full mb-2"
      >
        Restore wallet
      </Button>
      <Button onClick={() => alert('TODO')} size="xl" className="w-full">
        Open wallet file…
      </Button>
    </div>
  </div>
)

export default ChooseOption
