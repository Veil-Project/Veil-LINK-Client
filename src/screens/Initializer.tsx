import React from 'react'
import { Redirect } from '@reach/router'

const Initializer = () => {
  const getLocation = () => {
    return '/home'
    //const {
    //  isWalletsLoaded,
    //  hasWallets,
    //} = props

    //// still initializing - no location change
    //if (!isWalletsLoaded) {
    //  return null
    //}

    //// If we have at least one wallet send the user to the homepage.
    //// Otherwise send them to the onboarding processes.
    //return hasWallets ? '/home' : '/setup'
  }

  const location = getLocation()
  return location && <Redirect to={location} />
}

export default Initializer