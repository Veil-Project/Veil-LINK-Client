import React from 'react'
import Button from 'components/UI/Button'

interface Props {
  switchMode: any
}

const OpenWallet = ({ switchMode }: Props) => {
  return (
    <div className="flex-1 flex flex-col">
      <header className="pt-8 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Open wallet</h1>
        <p className="mt-1 text-gray-300">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor
          adipisci nihil cum doloremque recusandae odio ipsam iste, ut quisquam
          soluta unde quis tenetur accusantium ratione maiores, nesciunt
          aspernatur. Sapiente, non!
        </p>
      </header>
      <div className="mx-auto p-8 flex flex-wrap max-w-2xl -m-1 items-center justify-center" />
      <footer className="mt-auto flex justify-between items-center p-8 border-t border-gray-500">
        <button
          tabIndex={-1}
          className="text-gray-300 text-sm hover:text-white flex items-center p-4 -m-4"
          onClick={() => switchMode(null)}
        >
          Cancel
        </button>

        <div className="ml-auto">
          <Button primary disabled={true} onClick={() => alert('what')}>
            Open Wallet
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default OpenWallet
