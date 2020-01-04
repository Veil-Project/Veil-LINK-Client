import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { createWallet } from 'reducers/wallet'

import Spinner from 'components/UI/Spinner'

const WalletCreate = () => {  
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(createWallet())
  })

  return (
    <div className="flex-1 flex items-center justify-center">
      <Spinner />
    </div>
  )
}

export default WalletCreate