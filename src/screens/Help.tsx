import React from 'react'

import Modal from 'components/UI/Modal'
import ExternalLink from 'components/ExternalLink'
import VeilLogo from 'components/Icon/VeilLogo'
import { useStore } from 'store'

const Help = () => {
  const { state } = useStore()

  const revealConfig = () => {
    window.remote.shell.showItemInFolder(
      `${state.daemon.actualDatadir}/veil.conf`
    )
  }

  const revealDebugLog = () => {
    window.remote.shell.showItemInFolder(
      `${state.daemon.actualDatadir}/${
        state.blockchain.chain === 'test' ? 'testnet4/' : ''
      }debug.log`
    )
  }

  return (
    <Modal className="p-10" canClose={true}>
      <ul className="grid grid-cols-2 gap-2 leading-loose text-center">
        <li className="flex w-48">
          <ExternalLink
            href="https://veil-project.com"
            className="w-full p-4 text-gray-300 rounded hover:text-white"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <div className="flex items-center justify-center h-24">
              <VeilLogo className="w-20 h-20 mx-auto" />
            </div>
            Veil Website
          </ExternalLink>
        </li>
        <li className="flex w-48">
          <ExternalLink
            href="https://veil.freshdesk.com/support/home"
            className="w-full p-4 text-gray-300 rounded hover:text-white"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <div className="flex items-center justify-center h-24">
              <svg
                height="72px"
                width="72px"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m439.964844 486.578125 64.441406 17.828125-17.824219-64.441406c16.074219-24.742188 25.417969-54.261719 25.417969-85.964844 0-87.261719-70.738281-158-158-158s-158 70.738281-158 158 70.738281 158 158 158c31.703125 0 61.222656-9.34375 85.964844-25.421875zm0 0"
                  fill="#0f5aef"
                />
                <path
                  d="m195.5 0-80 195.5 80 195.5c107.800781 0 195.5-87.699219 195.5-195.5s-87.699219-195.5-195.5-195.5zm0 0"
                  fill="#5aecff"
                />
                <path
                  d="m0 195.5c0 35.132812 9.351562 69.339844 27.109375 99.371094l-26.390625 95.40625 95.410156-26.386719c30.03125 17.757813 64.238282 27.109375 99.371094 27.109375v-391c-107.800781 0-195.5 87.699219-195.5 195.5zm0 0"
                  fill="#5aecff"
                />
                <path d="m180.5 271h30v30h-30zm0 0" fill="#444a52" />
                <path
                  d="m180.5 204.394531v36.605469h15l10-25.167969-10-25.167969zm0 0"
                  fill="#444a52"
                />
                <path
                  d="m135.5 150h30c0-16.542969 13.457031-30 30-30l10-15-10-15c-33.085938 0-60 26.914062-60 60zm0 0"
                  fill="#444a52"
                />
                <path
                  d="m195.5 90v30c16.542969 0 30 13.457031 30 30 0 8.519531-3.46875 16.382812-9.765625 22.144531l-20.234375 18.519531v50.335938h15v-23.394531l25.488281-23.328125c12.398438-11.347656 19.511719-27.484375 19.511719-44.277344 0-33.085938-26.914062-60-60-60zm0 0"
                  fill="#444a52"
                />
              </svg>
            </div>
            Veil Support Center
          </ExternalLink>
        </li>
        <li className="flex w-48">
          <ExternalLink
            href="https://discord.veil-project.com"
            className="w-full p-4 text-gray-300 rounded hover:text-white"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <div className="flex items-center justify-center h-24">
              <div className="flex items-center justify-center p-5 pt-6 bg-blue-500 rounded-full">
                <svg
                  enableBackground="new 0 0 24 24"
                  height="40px"
                  width="40px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="-mb-1 fill-current"
                >
                  <g className="text-teal-500">
                    <path d="m3.58 21.196h14.259l-.681-2.205c.101.088 5.842 5.009 5.842 5.009v-21.525c-.068-1.338-1.22-2.475-2.648-2.475l-16.767.003c-1.427 0-2.585 1.139-2.585 2.477v16.24c0 1.411 1.156 2.476 2.58 2.476zm10.548-15.513-.033.012.012-.012zm-7.631 1.269c1.833-1.334 3.532-1.27 3.532-1.27l.137.135c-2.243.535-3.26 1.537-3.26 1.537.104-.022 4.633-2.635 10.121.066 0 0-1.019-.937-3.124-1.537l.186-.183c.291.001 1.831.055 3.479 1.26 0 0 1.844 3.15 1.844 7.02-.061-.074-1.144 1.666-3.931 1.726 0 0-.472-.534-.808-1 1.63-.468 2.24-1.404 2.24-1.404-3.173 1.998-5.954 1.686-9.281.336-.031 0-.045-.014-.061-.03v-.006c-.016-.015-.03-.03-.061-.03h-.06c-.204-.134-.34-.2-.34-.2s.609.936 2.174 1.404c-.411.469-.818 1.002-.818 1.002-2.786-.066-3.802-1.806-3.802-1.806 0-3.876 1.833-7.02 1.833-7.02z" />
                    <path d="m14.308 12.771c.711 0 1.29-.6 1.29-1.34 0-.735-.576-1.335-1.29-1.335v.003c-.708 0-1.288.598-1.29 1.338 0 .734.579 1.334 1.29 1.334z" />
                    <path d="m9.69 12.771c.711 0 1.29-.6 1.29-1.34 0-.735-.575-1.335-1.286-1.335l-.004.003c-.711 0-1.29.598-1.29 1.338 0 .734.579 1.334 1.29 1.334z" />
                  </g>
                </svg>
              </div>
            </div>
            Veil Discord
          </ExternalLink>
        </li>
        <li className="flex w-48">
          <ExternalLink
            href={`https://${
              state.blockchain.chain === 'test' ? 'testnet' : 'explorer'
            }.veil-project.com`}
            className="w-full p-4 text-gray-300 rounded hover:text-white"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <div className="flex items-center justify-center h-24">
              <svg
                id="Layer_3"
                enableBackground="new 0 0 64 64"
                height="72px"
                width="72px"
                className="fill-current"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path d="m43 46-11-6-11 6 11 6z" className="text-blue-400" />
                  <path d="m21 46v10l11 6v-10" className="text-blue-600" />
                  <path d="m43 46v10l-11 6v-10" className="text-blue-500" />
                  <path d="m62 27-11-6-11 6 11 6z" className="text-blue-400" />
                  <path d="m40 27v10l11 6v-10" className="text-blue-600" />
                  <path d="m62 27v10l-11 6v-10" className="text-blue-500" />
                  <path d="m24 27-11-6-11 6 11 6z" className="text-blue-400" />
                  <path d="m2 27v10l11 6v-10" className="text-blue-600" />
                  <path d="m24 27v10l-11 6v-10" className="text-blue-500" />
                  <path d="m43 8-11-6-11 6 11 6z" className="text-blue-400" />
                  <path d="m21 8v10l11 6v-10" className="text-blue-600" />
                  <path d="m43 8v10l-11 6v-10" className="text-blue-500" />
                  <g>
                    <path
                      d="m24 52h-11c-.553 0-1-.448-1-1v-5h2v4h10z"
                      className="text-teal-500"
                    />
                  </g>
                  <g>
                    <path
                      d="m51 52h-11v-2h10v-4h2v5c0 .552-.447 1-1 1z"
                      className="text-teal-500"
                    />
                  </g>
                  <g>
                    <path
                      d="m52 25h-2v-11h-10v-2h11c.553 0 1 .448 1 1z"
                      className="text-teal-500"
                    />
                  </g>
                  <g>
                    <path
                      d="m14 25h-2v-12c0-.552.447-1 1-1h11v2h-10z"
                      className="text-teal-500"
                    />
                  </g>
                </g>
              </svg>
            </div>
            Veil Block Explorer
          </ExternalLink>
        </li>
      </ul>
      {state.app.connectionMethod !== 'rpc' && (
        <div className="flex flex-col items-center mt-6 -mb-2 text-sm font-medium leading-loose text-center">
          <button
            className="text-gray-300 underline hover:text-white hover:no-underline"
            onClick={revealConfig}
          >
            Reveal configuration file
          </button>
          <button
            className="text-gray-300 underline hover:text-white hover:no-underline"
            onClick={revealDebugLog}
          >
            Reveal debug log
          </button>
        </div>
      )}
    </Modal>
  )
}
export default Help
