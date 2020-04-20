import React, { useState, useEffect } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import { useStore } from 'store'
import { useToasts } from 'react-toast-notifications'

import Modal from 'components/UI/Modal'
import Button from 'components/UI/Button'
import Spinner from 'components/UI/Spinner'
import useHotkeys from '@reecelucas/react-use-hotkeys'

const Configure = (props: RouteComponentProps) => {
  const [content, setContent] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { addToast } = useToasts()
  const { state, actions } = useStore()

  const cancel = () => {
    navigate('/')
  }

  useHotkeys('escape', cancel)

  useEffect(() => {
    ;(async () => {
      const content = await actions.daemon.readConfig()
      await setContent(content)
    })()
  }, [])

  const saveChanges = async () => {
    setIsSaving(true)
    try {
      await actions.daemon.writeConfig(content || '')
      addToast('Configuration saved', { appearance: 'success' })
      navigate('/')
    } catch (e) {
      addToast(e.message, { appearance: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      className="w-full max-w-2xl h-full flex"
      onClose={cancel}
      canClose={true}
    >
      {content !== null ? (
        <div className="w-full flex flex-col">
          <div
            className="h-12 px-6 text-sm flex items-center text-teal-500 font-semibold"
            style={{ backgroundColor: '#ffffff0f' }}
          >
            {state.daemon.actualDatadir}/veil.conf
          </div>
          <textarea
            onChange={e => setContent(e.target.value)}
            value={content}
            disabled={isSaving}
            className="flex-1 p-6 bg-transparent font-mono text-sm outline-none resize-none"
          />
          <div
            className="flex-none flex justify-end py-4 px-6"
            style={{ backgroundColor: '#ffffff0f' }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Button
                style={{ backgroundColor: '#ffffff11' }}
                onClick={cancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button primary onClick={saveChanges} disabled={isSaving}>
                Save changes
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </Modal>
  )
}
export default Configure
