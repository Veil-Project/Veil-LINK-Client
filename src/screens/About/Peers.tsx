import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RouteComponentProps } from '@reach/router'
import { useStore } from 'store'
import JsonViewer from 'components/JsonViewer'
import { FiX, FiArrowUp, FiArrowDown } from 'react-icons/fi'

const Peers = (props: RouteComponentProps) => {
  const [peers, setPeers] = useState<any[]>([])
  const [selectedPeer, setSelectedPeer] = useState(null)
  const { effects } = useStore()

  const getPeers = async () => {
    const peers = await effects.rpc.getPeerInfo()
    console.log(peers)
    setPeers(peers)
  }

  useEffect(() => {
    getPeers()
  }, [])

  return (
    <div className="w-full flex flex-col text-sm">
      <div className="flex-1 pt-2 overflow-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-xs uppercase tracking-wide font-medium text-gray-400">
                ID
              </th>
              <th className="p-2 text-xs uppercase tracking-wide font-medium text-gray-400 text-left">
                Node / Service
              </th>
              <th className="p-2 text-xs uppercase tracking-wide font-medium text-gray-400 text-left">
                Version
              </th>
            </tr>
          </thead>
          <tbody>
            {peers.map(peer => (
              <tr
                key={peer.id}
                onClick={() => setSelectedPeer(peer)}
                className={
                  selectedPeer === peer ? 'bg-blue-500' : 'bg-transparent'
                }
              >
                <td className="border-t border-gray-500 p-2 text-center">
                  {peer.id}
                </td>
                <td className="border-t border-gray-500 p-2">
                  <div className="flex items-center">
                    <div className="mr-1">
                      {peer.inbound ? <FiArrowDown /> : <FiArrowUp />}
                    </div>
                    {peer.addr}
                  </div>
                </td>
                <td className="border-t border-gray-500 p-2">{peer.subver}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <motion.div
        className="overflow-auto relative"
        initial={{ height: 0 }}
        animate={{ height: selectedPeer !== null ? '50%' : 0 }}
      >
        <div
          className="border-t-2 p-6"
          style={{ borderColor: 'rgba(0,0,0,.15)' }}
        >
          <JsonViewer src={selectedPeer || {}} />
        </div>
        <button
          onClick={() => setSelectedPeer(null)}
          className="rounded-full p-4 absolute top-0 right-0 z-50 text-gray-300 hover:text-white"
        >
          <FiX size="16" />
        </button>
      </motion.div>
    </div>
  )
}

export default Peers
