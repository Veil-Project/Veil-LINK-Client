import React, { useState, ChangeEvent, useEffect } from 'react'
import * as Bip39 from 'bip39'

import Button from 'components/UI/Button'
import SeedWord from 'components/Seed/SeedWord'
import { useStore } from 'store'
import DaemonWarmup from 'components/DaemonWarmup'

interface Props {
  switchMode: Function
}

const RestoreWallet = ({ switchMode }: Props) => {
  const [seed, setSeed] = useState([...new Array(24)])
  const [focusedSeedIndex, setFocusedSeedIndex] = useState(0)
  const [autocompleteMatches, setAutocompleteMatches] = useState([] as string[])
  const [isRestoring, setIsRestoring] = useState(false)
  const { effects, actions } = useStore()

  const handleChange = (index: number, value: string) => {
    setSeed([...seed.slice(0, index), value, ...seed.slice(index + 1)])

    const matches = value
      ? Bip39.wordlists.english.filter(w => w.startsWith(value)).slice(0, 5)
      : []
    setAutocompleteMatches(matches)
  }

  useEffect(() => {
    setAutocompleteMatches([])
  }, [focusedSeedIndex])

  const doRestoreWallet = async () => {
    const isValidSeed = Bip39.validateMnemonic(seed.join(' '))

    if (!isValidSeed) {
      const confirmMsg =
        'This seed does not appear to be valid. Are you sure you want to continue?'
      if (!window.confirm(confirmMsg)) return
    }

    try {
      setIsRestoring(true)
      await actions.daemon.start(seed.join(' '))
      await actions.app.transition()
    } catch (e) {
      console.error(e)
      alert('Unable to restore wallet')
    } finally {
      setIsRestoring(false)
    }
  }

  const isValid = seed.every(word => !!word)

  if (isRestoring) {
    return <DaemonWarmup />
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="pt-8 text-center max-w-md mx-auto">
        <h1 className="text-3xl font-bold">Restore wallet from seed</h1>
        <p className="mt-1 text-lg text-gray-300">
          Enter your seed to restore your wallet
        </p>
      </header>
      <div className="mx-auto p-8 flex flex-wrap max-w-2xl -m-1 items-center justify-center">
        {seed.map((word, i) => (
          <SeedWord
            key={i}
            index={i}
            value={word}
            validate={false}
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
          onClick={() => switchMode(null)}
        >
          Cancel
        </button>

        <div className="ml-auto">
          <Button primary disabled={!isValid} onClick={doRestoreWallet}>
            Restore Wallet
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default RestoreWallet
