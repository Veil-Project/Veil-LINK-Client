import React from 'react'
import formatBytes from 'utils/formatBytes'
import Spinner from 'components/UI/Spinner'

interface DownloadStatusProps {
  percent?: number | null
  speed?: number | null
  size?: {
    total: number | null
    transferred: number | null
  }
}

const DownloadStatus = ({ percent, size, speed }: DownloadStatusProps) => {
  return (
    <>
      <Spinner percentage={percent ? percent * 100 : null} />
      <div className="mt-4 text-sm text-center">
        {size && size.total && size.transferred ? (
          <span>
            {formatBytes(size.transferred)} of {formatBytes(size.total)} (
            {speed ? formatBytes(speed || 0) : '--'}
            /sec)
          </span>
        ) : (
          'Starting download…'
        )}
      </div>
    </>
  )
}

export default DownloadStatus
