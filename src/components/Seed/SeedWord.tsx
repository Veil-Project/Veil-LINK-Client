import React, { useState, KeyboardEvent, InputHTMLAttributes } from 'react'

interface SeedWordProps {
  index: number
  value: string
  validate?: boolean
  isValid?: boolean
  matchingWords: Array<string>
  isFocused: boolean
  onSelectWord: Function
}

const SeedWord = ({
  index,
  value,
  validate,
  isValid,
  matchingWords,
  isFocused,
  onSelectWord,
  ...props
}: SeedWordProps & InputHTMLAttributes<HTMLInputElement>) => {
  const [matchIndex, setMatchIndex] = useState(0)

  const borderColor =
    validate && isValid
      ? 'border-green-600'
      : isFocused || (!validate && value)
      ? 'border-white'
      : !value
      ? 'border-gray-600'
      : 'border-red-600'
  const textColor =
    validate && isValid
      ? 'text-green-600'
      : isFocused || (!validate && value)
      ? 'text-white'
      : !value
      ? 'text-gray-600'
      : 'text-red-600'

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
        {isFocused && value && matchingWords.length > 0 && !isValid && (
          <div className="absolute top-100 z-50 left-0 w-full shadow-lg bg-gray-600 leading-none text-sm">
            {matchingWords.map((w, i) => (
              <button
                key={w}
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

export default SeedWord
