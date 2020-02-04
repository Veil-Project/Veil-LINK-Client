import React, {
  useState,
  KeyboardEvent,
  ChangeEvent,
  InputHTMLAttributes,
} from 'react'

import { useDispatch } from 'react-redux'
import {
  setSeedConfirmationValue,
  setFocusedSeedIndex,
} from 'store/slices/setup'

interface SeedWordProps {
  index: number
  value: string
  word: string
  matchingWords: Array<string>
  isFocused: boolean
  onSelectWord: Function
}

const SeedWord = ({
  index,
  value,
  word,
  matchingWords,
  isFocused,
  onSelectWord,
  ...props
}: SeedWordProps & InputHTMLAttributes<HTMLInputElement>) => {
  const [matchIndex, setMatchIndex] = useState(0)

  const borderColor =
    value === word
      ? 'border-green-600'
      : !value || word.startsWith(value)
      ? isFocused
        ? 'border-white'
        : 'border-gray-600'
      : 'border-red-600'
  const textColor =
    value === word
      ? 'text-green-400'
      : !value || word.startsWith(value)
      ? isFocused
        ? 'text-white'
        : 'text-gray-400'
      : 'text-red-500'

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
      case 9:
      case 13:
        if (value && matchingWords[matchIndex]) {
          onSelectWord(matchingWords[matchIndex])
        }
        break
      case 38:
        setMatchIndex(Math.max(matchIndex - 1, 0))
        e.preventDefault()
        break
      case 40:
        setMatchIndex(Math.min(matchIndex + 1, matchingWords.length - 1))
        e.preventDefault()
        break
      default:
      // all good
    }
  }

  return (
    <div className="flex-none w-1/4 p-1 flex items-center">
      <div
        className={`w-10 pr-3 text-sm text-right font-semibold ${textColor} mb-2px`}
      >
        {index + 1}
      </div>
      <div className="flex-1 relative">
        <input
          type="text"
          className={`w-full h-8 bg-transparent outline-none border-b-2 ${borderColor}`}
          value={value}
          tabIndex={index + 1}
          autoFocus={isFocused}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {isFocused && value && matchingWords.length > 0 && value !== word && (
          <div className="absolute top-100 z-50 left-0 w-full shadow-lg bg-gray-600 leading-none text-sm">
            {matchingWords.map((w, i) => (
              <button
                className={`w-full p-2 text-left ${
                  matchIndex === i ? 'text-white bg-blue-500' : 'text-gray-300'
                }`}
                onMouseOver={() => setMatchIndex(i)}
                onMouseOut={() => setMatchIndex(0)}
                onMouseDown={() => onSelectWord(w)}
              >
                {w}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface SeedView {
  seed: Array<string>
  seedConfirmation: Array<string>
  focusedSeedIndex: number
  seedAutocompleteMatches: Array<string>
}

const SeedView = ({
  seed,
  seedConfirmation,
  focusedSeedIndex,
  seedAutocompleteMatches,
}: SeedView) => {
  const dispatch = useDispatch()
  const handleChange = (index: number, value: string) => {
    dispatch(setSeedConfirmationValue({ index, value }))
  }
  const setFocusedField = (index: number) => {
    dispatch(setFocusedSeedIndex(index))
  }

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
        {seed.map((word, i) => (
          <SeedWord
            key={i}
            index={i}
            value={seedConfirmation[i]}
            word={word}
            isFocused={focusedSeedIndex === i}
            matchingWords={seedAutocompleteMatches}
            onSelectWord={(value: string) => handleChange(i, value)}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(i, e.target.value)
            }
            onFocus={() => setFocusedField(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default SeedView
