import React, { MouseEvent } from "react"
import VeilLogo from 'components/Icon/VeilLogo'

interface OptionProps { 
  label: string,
  selected: boolean,
  onSelect(event: MouseEvent<HTMLButtonElement>): void,
}

interface WelcomeProps {
  selectedMode: 'create-wallet' | 'restore-wallet' | 'open-wallet',
  switchMode: Function,
}

const Option = ({ label, selected, onSelect }: OptionProps) => (
  <button onClick={onSelect} className={`mt-4 w-64 h-12 flex items-center justify-center font-semibold rounded ${selected ? 'bg-blue-500' : 'bg-gray-500 hover:bg-blue-500'} text-white`}>
    {label}
  </button>
)

const Welcome = ({ selectedMode, switchMode }: WelcomeProps) => (
  <div className="flex-1 flex flex-col">
    <header className="pt-8 flex items-center justify-center">
      <VeilLogo />
    </header>
    <div className="flex-1 p-8 flex flex-col items-center justify-center">
      <Option label="Create new wallet" selected={selectedMode === 'create-wallet'} onSelect={() => switchMode('create-wallet')} />
      <Option label="Restore wallet" selected={selectedMode === 'restore-wallet'} onSelect={() => switchMode('restore-wallet')} />
      <Option label="Open wallet file" selected={selectedMode === 'open-wallet'} onSelect={() => switchMode('open-wallet')} />
    </div>
    <footer className="flex justify-between p-8">
    </footer>
  </div>
)

export default Welcome