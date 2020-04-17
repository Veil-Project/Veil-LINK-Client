import React from 'react'
import { Router, Link, RouteComponentProps } from '@reach/router'

import General from './Settings/General'
import Network from './Settings/Network'
import Privacy from './Settings/Privacy'
import Advanced from './Settings/Advanced'

import Modal from 'components/UI/Modal'
import Button from 'components/UI/Button'

// TODO: figure out correct type for wrapping Link props
const ActiveLink = (props: any) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => ({
      className: isCurrent
        ? 'px-4 h-10 rounded flex items-center justify-start bg-gray-700 text-sm text-white font-medium'
        : 'px-4 h-10 rounded flex items-center justify-start text-gray-300 text-sm font-medium hover:text-white hover:bg-gray-700',
    })}
  />
)

const Settings = (props: RouteComponentProps) => (
  <Modal hideClose={true}>
    <div className="w-full flex flex-col">
      <div className="flex-1 flex">
        <div
          className="flex-none w-48 p-4 flex flex-col"
          style={{ backgroundColor: 'rgba(0,0,0,.15)' }}
        >
          <ActiveLink to="./">General</ActiveLink>
          <ActiveLink to="network">Network</ActiveLink>
          <ActiveLink to="privacy">Privacy</ActiveLink>
          <ActiveLink to="advanced">Advanced</ActiveLink>
        </div>
        <div className="flex-1 p-6">
          <Router>
            <General path="/" />
            <Network path="network" />
            <Privacy path="privacy" />
            <Advanced path="advanced" />
          </Router>
        </div>
      </div>
      <div
        className="flex-none flex justify-end px-6 py-4"
        style={{ backgroundColor: 'rgba(255,255,255,.025)' }}
      >
        <Button to="/" primary>
          Done
        </Button>
      </div>
    </div>
  </Modal>
)

export default Settings
