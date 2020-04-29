import React, { useState } from 'react'
import { useStore } from 'store'

import Modal from 'components/UI/Modal'
import Button from 'components/UI/Button'

const UpdateNotification = () => {
  const { state, actions } = useStore()
  const { autoUpdate } = state

  const cancel = () => {
    actions.autoUpdate.dismiss()
  }
  const updateNow = () => {
    actions.autoUpdate.install()
  }

  return (
    <Modal
      id="updateNotification"
      className="w-full max-w-lg flex"
      onClose={cancel}
      canClose={true}
    >
      <div className="w-full flex flex-col p-6">
        <div className="text-center">
          <div className="text-white font-semibold text-xl">
            A new version of Veil X is available!
          </div>
          <div className="text-gray-300">
            Veil X {autoUpdate.latestVersion} is now available. Do you want to
            update now?
          </div>
        </div>
        <div
          className="my-6 p-4 rounded text-sm h-64 overflow-auto"
          style={{ backgroundColor: '#ffffff0f' }}
        >
          <div className="text-teal-500 font-semibold leading-none mb-2">
            Release notes:
          </div>
          <div
            className="c-rich-text"
            dangerouslySetInnerHTML={{ __html: autoUpdate.releaseNotes }}
          />
        </div>
        <div className="flex-none flex justify-between">
          <Button
            to={`https://github.com/Veil-Project/Veil-Link-Client/releases/tag/${autoUpdate.latestVersion}`}
            style={{ backgroundColor: '#ffffff11' }}
          >
            Learn more…
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button style={{ backgroundColor: '#ffffff11' }} onClick={cancel}>
              Later
            </Button>
            <Button primary onClick={updateNow}>
              Update now
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default UpdateNotification
