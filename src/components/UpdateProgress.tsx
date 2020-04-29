import React from 'react'
import { useStore } from 'store'

import Modal from 'components/UI/Modal'
import DownloadStatus from './DownloadStatus'

const UpdateProgress = () => {
  const { state } = useStore()
  const { downloadProgress } = state.autoUpdate

  return (
    <Modal
      id="updateProgress"
      className="w-full max-w-md p-10"
      hideClose={true}
    >
      <DownloadStatus
        percent={
          downloadProgress?.percent ? downloadProgress.percent / 100.0 : null
        }
        size={{
          total: downloadProgress?.total,
          transferred: downloadProgress?.transferred,
        }}
        speed={downloadProgress?.bytesPerSecond}
      />
    </Modal>
  )
}

export default UpdateProgress
