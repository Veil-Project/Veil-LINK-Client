import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

import { useDispatch } from 'react-redux'
import { toggleSeedVisibility, generateSeed } from 'reducers/setup'

import Button from 'components/UI/Button'
import Spinner from 'components/UI/Spinner'

interface SeedViewProps {
  seed: Array<string>,
  isVisible: boolean,
}

const SeedView = ({ seed, isVisible }: SeedViewProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (seed.length === 0) dispatch(generateSeed())
  }, [seed])

  const revealSeed = () => {
    dispatch(toggleSeedVisibility())
  }

  if (seed.length === 0) {
    return <Spinner /> 
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="pt-8 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Save your wallet seed</h1>
        <p className="mt-1 text-gray-300">
          Your seed is all that is needed to restore your wallet. It's very important that you it write down and keep it secret.
        </p>
      </header>
      <div className="mx-auto p-8 -m-1 flex flex-wrap max-w-2xl items-center justify-center">
        {seed.map((word, i) => (
          <div key={i} className="flex-none w-1/4 p-1 flex items-center">
            <div className="w-10 pr-3 text-sm text-right font-semibold text-gray-400 mb-2px">
              {i+1}
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
            <Button onClick={() => toast("Copied to clipboard!")}>
              Copy to clipboard
            </Button>
            <div className="mt-2 text-sm text-gray-300">
              Remember to keep the seed private. Anyone who knows the seed has full access to your funds.
            </div>
          </>
        ) : (
          <>
            <Button onClick={revealSeed} primary>
              Reveal Seed
            </Button>
            <div className="mt-2 text-sm text-gray-300">
              Before continuing make sure no one is around you and that your screen is not being recorded.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
export default SeedView