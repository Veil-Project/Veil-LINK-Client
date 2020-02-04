import React, { MouseEvent } from 'react'
import VeilLogo from 'components/Icon/VeilLogo'

interface OptionProps {
  label: string
  onClick(event: MouseEvent<HTMLButtonElement>): void
}

type SetupMode = 'create-wallet' | 'restore-wallet' | 'open-wallet'

interface WelcomeProps {
  selectedMode: SetupMode
  switchMode: Function
  gotoNextStep: Function
}

const Option = ({ label, onClick }: OptionProps) => (
  <button
    onClick={onClick}
    className="mt-4 w-64 h-12 flex items-center justify-center font-semibold rounded text-white bg-gray-500 hover:bg-blue-500"
  >
    {label}
  </button>
)

const Welcome = ({ selectedMode, switchMode, gotoNextStep }: WelcomeProps) => {
  const handleClick = (mode: SetupMode) => {
    switchMode(mode)
    gotoNextStep()
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="pt-8 flex items-center justify-center">
        <VeilLogo />
      </header>
      <div className="flex-1 p-8 pt-0 flex flex-col items-center justify-center">
        <Option
          label="Create new wallet"
          onClick={() => handleClick('create-wallet')}
        />
        <Option
          label="Restore wallet"
          onClick={() => handleClick('restore-wallet')}
        />
        <Option
          label="Open wallet file"
          onClick={() => handleClick('open-wallet')}
        />
      </div>
      <footer className="flex justify-between p-8" />
    </div>
  )
}

export default Welcome
