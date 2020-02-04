import React, { useEffect } from 'react'

import { useSelector } from 'react-redux'
import { selectors } from 'store/slices/setup'
import api from 'api'

import Spinner from 'components/UI/Spinner'

const WalletRestore = () => {
  const seed = useSelector(selectors.seed)

  useEffect(() => {
    const doStartDaemon = async () => {
      await api.start(seed.join(' '))
    }
    doStartDaemon()
  }, [seed])

  return (
    <div className="flex-1 flex items-center justify-center">
      <Spinner />
    </div>
  )
}

export default WalletRestore
