import { useState } from 'react'

function useStickyState(key: string, defaultValue?: any) {
  const [localState, setLocalState] = useState(
    JSON.parse(localStorage.getItem(key) || defaultValue)
  )

  const setStickyState = (newItem: any) => {
    if (localState !== newItem) {
      localStorage.setItem(key, JSON.stringify(newItem))
      setLocalState(newItem)
    }
  }

  return [localState, setStickyState]
}

export default useStickyState
