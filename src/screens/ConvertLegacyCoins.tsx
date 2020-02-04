import React from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import api from 'api'
import Button from 'components/UI/Button'
import Modal from 'components/UI/Modal'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { getBalanceBreakdown } from 'store/slices/balance'
import JsonViewer from 'components/JsonViewer'

const ConvertLegacyCoins = (props: RouteComponentProps) => {
  const breakdown = useSelector(getBalanceBreakdown)

  const doConvertAll = async () => {
    const password = await window.promptForInput({
      title: 'Convert legacy coins',
      label: 'Enter wallet password',
      inputAttrs: {
        type: 'password',
      },
    })

    if (!password) return

    try {
      await api.unlockWallet(password)
      alert('TODO: convert coins')
    } catch (e) {
      toast(e.message, { type: 'error' })
      console.error(e)
    } finally {
      api.lockWallet()
    }
  }

  return (
    <Modal onClose={() => navigate('/')}>
      <div className="flex-1 flex flex-col">
        <div className="bg-orange-400 h-12 flex-none flex items-center justify-center text-orange-800 font-medium text-sm">
          This screen is work in progress
        </div>
        <div className="p-8">
          <JsonViewer src={breakdown} />
          <Button onClick={doConvertAll} primary size="lg">
            Convert all
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConvertLegacyCoins
