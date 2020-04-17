import React from 'react'
import { Router, Link, RouteComponentProps, navigate } from '@reach/router'

import General from './About/General'
import Peers from './About/Peers'

import Modal from 'components/UI/Modal'

// TODO: figure out correct type for wrapping Link props
const ActiveLink = (props: any) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => ({
      className: isCurrent
        ? 'px-4 h-10 rounded flex items-center justify-start bg-gray-500 text-sm text-white font-medium'
        : 'px-4 h-10 rounded flex items-center justify-start text-gray-300 text-sm font-medium hover:text-white hover:bg-gray-700',
    })}
  />
)

const About = (props: RouteComponentProps) => (
  <Modal
    className="w-full max-w-2xl h-full flex"
    onClose={() => navigate('/')}
    canClose={true}
  >
    <div
      className="flex-none w-48 p-4 flex flex-col"
      style={{ backgroundColor: 'rgba(0,0,0,.15)' }}
    >
      <ActiveLink to="./">General</ActiveLink>
      <ActiveLink to="peers">Peers</ActiveLink>
    </div>
    <div className="flex-1 flex">
      <Router className="w-full flex-1 flex">
        <General path="/" />
        <Peers path="peers" />
      </Router>
    </div>
  </Modal>
)

export default About
