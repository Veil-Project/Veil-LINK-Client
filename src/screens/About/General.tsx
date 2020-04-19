import React, { useState, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { version } from '../../../package.json'
import { useStore } from 'store'
import ExternalLink from 'components/ExternalLink'

const General = (props: RouteComponentProps) => {
  const [networkInfo, setNetworkInfo] = useState<any>({})
  const { state, effects } = useStore()
  const { blockchain, daemon } = state

  const getNetworkInfo = async () => {
    try {
      const info = await effects.rpc.getNetworkInfo()
      setNetworkInfo(info)
    } catch (e) {}
  }

  useEffect(() => {
    getNetworkInfo()
  }, [])

  return (
    <div className="w-full p-6 text-sm">
      <dl>
        <div
          className="rounded py-2 flex"
          style={{ backgroundColor: '#ffffff11' }}
        >
          <dt className="flex-none w-1/3 pr-2 text-right font-medium text-teal-500">
            App version:
          </dt>
          <dl className="flex-1 pl-3">{version}</dl>
        </div>
        <div className="rounded py-2 flex">
          <dt className="flex-none w-1/3 pr-2 text-right font-medium text-teal-500">
            Veild version:
          </dt>
          <dl className="flex-1 pl-3">{daemon.version}</dl>
        </div>
        <div
          className="rounded py-2 flex"
          style={{ backgroundColor: '#ffffff11' }}
        >
          <dt className="flex-none w-1/3 pr-2 text-right font-medium text-teal-500">
            User agent:
          </dt>
          <dl className="flex-1 pl-3">{networkInfo.subversion}</dl>
        </div>
        <div className="rounded py-2 flex">
          <dt className="flex-none w-1/3 pr-2 text-right font-medium text-teal-500">
            Chain:
          </dt>
          <dl className="flex-1 pl-3">{blockchain.chain}</dl>
        </div>
        <div
          className="rounded py-2 flex"
          style={{ backgroundColor: '#ffffff11' }}
        >
          <dt className="flex-none w-1/3 pr-2 text-right font-medium text-teal-500">
            Height:
          </dt>
          <dl className="flex-1 pl-3">
            {blockchain.chain === 'main' ? (
              <ExternalLink
                title={blockchain.bestBlock}
                href={`https://explorer.veil-project.com/block/{blockchain.bestBlock}`}
              >
                {blockchain.height}
              </ExternalLink>
            ) : (
              blockchain.height
            )}
          </dl>
        </div>
      </dl>
    </div>
  )
}

export default General
