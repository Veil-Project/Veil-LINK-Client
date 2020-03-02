import React, { useEffect, useState, ChangeEvent } from 'react'
import { toast } from 'react-toastify'
import * as Bip39 from 'bip39'
import { useStore } from 'store'

import Button from 'components/UI/Button'
import Spinner from 'components/UI/Spinner'
import SeedWord from 'components/Seed/SeedWord'

interface Props {
  switchMode: Function
}

const ViewSeed = ({ seed, onContinue, onCancel }: any) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="flex-1 flex flex-col">
      <header className="pt-8 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Save your wallet seed</h1>
        <p className="mt-1 text-gray-300">
          Your seed is all that is needed to restore your wallet. It's very
          important that you it write down and keep it secret.
        </p>
      </header>
      <div className="mx-auto p-8 -m-1 flex flex-wrap max-w-2xl items-center justify-center">
        {seed.map((word: string, i: number) => (
          <div key={i} className="flex-none w-1/4 p-1 flex items-center">
            <div className="w-10 pr-3 text-sm text-right font-semibold text-gray-400 mb-2px">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="w-full h-8 flex items-center bg-transparent border-b-2 border-gray-600">
                {isVisible ? word : '•••••'}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-md p-8 pt-0 text-center">
        {isVisible ? (
          <>
            <Button onClick={() => toast('Copied to clipboard!')}>
              Copy to clipboard
            </Button>
            <div className="mt-2 text-sm text-gray-300">
              Remember to keep the seed private. Anyone who knows the seed has
              full access to your funds.
            </div>
          </>
        ) : (
          <>
            <Button onClick={() => setIsVisible(true)} primary>
              Reveal Seed
            </Button>
            <div className="mt-2 text-sm text-gray-300">
              Before continuing make sure no one is around you and that your
              screen is not being recorded.
            </div>
          </>
        )}
      </div>
      <footer className="mt-auto flex justify-between items-center p-8 border-t border-gray-500">
        <button
          tabIndex={-1}
          className="text-gray-300 text-sm hover:text-white flex items-center p-4 -m-4"
          onClick={onCancel}
        >
          Cancel
        </button>

        <div className="ml-auto">
          <Button primary disabled={!isVisible} onClick={onContinue}>
            Continue
          </Button>
        </div>
      </footer>
    </div>
  )
}

const ConfirmSeed = ({ seed, onSubmit, onCancel }: any) => {
  const [seedConfirmation, setSeedConfirmation] = useState([...new Array(24)])
  const [focusedSeedIndex, setFocusedSeedIndex] = useState(0)
  const [autocompleteMatches, setAutocompleteMatches] = useState([] as string[])

  const handleChange = (index: number, value: string) => {
    setSeedConfirmation([
      ...seedConfirmation.slice(0, index),
      value,
      ...seedConfirmation.slice(index + 1),
    ])

    const matches = value
      ? Bip39.wordlists.english.filter(w => w.startsWith(value)).slice(0, 5)
      : []
    setAutocompleteMatches(matches)
  }

  useEffect(() => {
    setAutocompleteMatches([])
  }, [focusedSeedIndex])

  const isValid = JSON.stringify(seed) === JSON.stringify(seedConfirmation)

  return (
    <div className="flex-1 flex flex-col">
      <header className="pt-8 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Confirm your seed</h1>
        <p className="mt-1 text-gray-300">
          Enter the missing words from your seed to confirm you have a copy of
          it and can restore your wallet.
        </p>
      </header>
      <div className="mx-auto p-8 flex flex-wrap max-w-2xl -m-1 items-center justify-center">
        {seedConfirmation.map((word, i) => (
          <SeedWord
            key={i}
            index={i}
            value={word}
            validate={true}
            isValid={word && word === seed[i]}
            isFocused={focusedSeedIndex === i}
            matchingWords={autocompleteMatches}
            onSelectWord={(value: string) => handleChange(i, value)}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(i, e.target.value)
            }
            onFocus={() => setFocusedSeedIndex(i)}
          />
        ))}
      </div>
      <footer className="mt-auto flex justify-between items-center p-8 border-t border-gray-500">
        <button
          tabIndex={-1}
          className="text-gray-300 text-sm hover:text-white flex items-center p-4 -m-4"
          onClick={onCancel}
        >
          Cancel
        </button>

        <div className="ml-auto">
          <Button primary disabled={!isValid} onClick={onSubmit}>
            Create Wallet
          </Button>
        </div>
      </footer>
    </div>
  )
}

const CreateWallet = ({ switchMode }: Props) => {
  const [step, setStep] = useState('view')
  const [seed, setSeed] = useState([...new Array(24)])
  const { effects } = useStore()

  useEffect(() => {
    const generateSeed = async () => {
      const seed = await Bip39.generateMnemonic(256)
      setSeed(seed.split(' '))
    }
    generateSeed()
  }, [])

  const doCreateWallet = async () => {
    try {
      setStep('create')
      await effects.daemon.startFromSeed(seed.join(' '))
    } catch (e) {
      console.error(e)
      alert('Unable to create wallet')
      setStep('confirm')
    }
  }

  if (seed.length === 0) {
    return <Spinner />
  }

  switch (step) {
    case 'view':
      return (
        <ViewSeed
          seed={seed}
          onCancel={() => switchMode(null)}
          onContinue={() => setStep('confirm')}
        />
      )
    case 'confirm':
      return (
        <ConfirmSeed
          seed={seed}
          onCancel={() => switchMode(null)}
          onSubmit={() => doCreateWallet()}
        />
      )
    case 'create':
      return <Spinner />
    default:
      return <div />
  }
}

export default CreateWallet
