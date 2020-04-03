import React from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import Button from 'components/UI/Button'
import Modal from 'components/UI/Modal'
import { useToasts } from 'react-toast-notifications'
import { useStore } from 'store'
import JsonViewer from 'components/JsonViewer'

const ConvertLegacyCoins = (props: RouteComponentProps) => {
  const { addToast } = useToasts()
  const { state, effects } = useStore()
  const breakdown = state.balance

  const doConvertAll = async () => {
    // const password = await window.promptForInput({
    //   title: 'Convert legacy coins',
    //   label: 'Enter wallet password',
    //   inputAttrs: {
    //     type: 'password',
    //   },
    // })
    const password = ''

    if (!password) return

    try {
      await effects.rpc.unlockWallet(password)
      alert('TODO: convert coins')
    } catch (e) {
      addToast(e.message, { appearance: 'error' })
      console.error(e)
    } finally {
      effects.rpc.lockWallet()
    }
  }

  return (
    <Modal onClose={() => navigate('/')} canClose={true}>
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
