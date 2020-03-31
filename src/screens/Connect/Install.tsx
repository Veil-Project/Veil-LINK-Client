import React, { MouseEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from 'store'
import formatPath from 'utils/formatPath'

import Button from 'components/UI/Button'

import formatBytes from 'utils/formatBytes'
import Spinner from 'components/UI/Spinner'

interface DaemonDetailsProps {
  path: string | null
  version: string | null
  checksum: string | null
}

const DaemonDetails = ({ version, path, checksum }: DaemonDetailsProps) => (
  <>
    <dl className="text-left">
      <dt className="font-semibold text-teal-500 text-sm">Path</dt>
      <dd className="leading-snug">{formatPath(path || '')}</dd>
      <dt className="mt-2 font-semibold text-teal-500 text-sm">Checksum</dt>
      <dd className="leading-snug">{checksum}</dd>
      <dt className="mt-2 font-semibold text-teal-500 text-sm">Version</dt>
      <dd className="leading-snug">
        {version ? (
          version
        ) : (
          <span className="text-red-500">Not available</span>
        )}
      </dd>
    </dl>
  </>
)

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
      <div className="mt-4 text-sm text-gray-300 text-center">
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

const Install = ({ setMode }: { setMode: Function }) => {
  const [verifyInstallation, setVerifyInstallation] = useState(false)
  const { state, actions, effects } = useStore()
  const { download, version, checksum, path } = state.daemon

  const downloadFile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    try {
      await actions.daemon.download()
      setVerifyInstallation(true)
    } catch (e) {
      alert(
        "Unable to download file. Make sure you're connected to the internet and try again."
      )
    }
  }

  const showOpenDialog = async () => {
    const path = await effects.electron.openFile()
    if (path) {
      await actions.daemon.setPath(path[0])
      setVerifyInstallation(true)
    }
  }

  return (
    <>
      <div className="my-auto">
        <header>
          <h2 className="text-2xl font-bold">Install Veil helper</h2>
          <p className="mt-1 text-lg text-gray-300">
            Download the blockchain helper, or locate an existing veild, if
            you’re already running your own.
          </p>
        </header>

        <div className="mt-8 bg-gray-700 rounded-lg p-6 flex flex-col">
          {verifyInstallation ? (
            <>
              <DaemonDetails
                version={version}
                checksum={checksum}
                path={path}
              />
              <div className="flex mt-6">
                <Button
                  size="xl"
                  className="mr-1 flex-1 w-full"
                  onClick={() => setVerifyInstallation(false)}
                >
                  Change
                </Button>
                <Button
                  primary
                  size="xl"
                  disabled={!version}
                  className="ml-1 flex-1 w-full"
                  onClick={() => setMode('start')}
                >
                  Continue
                </Button>
              </div>
            </>
          ) : download.inProgress ? (
            <DownloadStatus {...download.status} />
          ) : (
            <>
              <Button
                primary
                size="xl"
                className="w-full"
                onClick={downloadFile}
              >
                Download and install
              </Button>
              <Button
                size="xl"
                className="mt-4 w-full"
                onClick={showOpenDialog}
              >
                Open local file…
              </Button>
            </>
          )}
        </div>
      </div>

      <motion.div
        className="text-sm text-gray-400"
        animate={{ opacity: verifyInstallation || download.inProgress ? 0 : 1 }}
      >
        Prefer to have full control?
        <br />
        <button
          onClick={() => setMode('login')}
          className="underline hover:text-white hover:no-underline"
        >
          Connect via RPC
        </button>
      </motion.div>
    </>
  )
}

export default Install
