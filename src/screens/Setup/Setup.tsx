import React from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { RouteComponentProps } from '@reach/router'

import { useSelector, useDispatch } from 'react-redux'
import { switchMode, setStep, selectors, Mode } from 'reducers/setup'
import { createWallet } from 'reducers/wallet'

import * as Steps from './Steps'
import Button from 'components/UI/Button'
 
interface Step {
  screen: any,
  valid?: boolean,
}
type Steps = Array<Step>

const Setup = (props: RouteComponentProps) => {
  const selectedMode = useSelector(selectors.mode)
  const currentStep = useSelector(selectors.step)

  const seed = useSelector(selectors.seed)
  const seedIsVisible = useSelector(selectors.seedIsVisible)

  const seedConfirmation = useSelector(selectors.seedConfirmation)
  const seedAutocompleteMatches = useSelector(selectors.seedAutocompleteMatches)
  const focusedSeedIndex = useSelector(selectors.focusedSeedIndex)
  const isSeedConfirmationValid = useSelector(selectors.isSeedConfirmationValid)

  const password = useSelector(selectors.password)
  const passwordConfirmation = useSelector(selectors.passwordConfirmation)
  const isPasswordValid = useSelector(selectors.isPasswordValid)

  const dispatch = useDispatch()

  const gotoPrevStep = () => {
    dispatch(setStep(currentStep - 1))
  }

  const gotoNextStep = () => {
    dispatch(setStep(currentStep + 1))
  }

  const doSwitchMode = (mode: Mode) => {
    dispatch(switchMode(mode))
  }

  const skipSetup = () => {
    dispatch(createWallet())
  }

  let steps: Steps
  switch (selectedMode) {
    case 'create-wallet':
      steps = [
        {
          screen: <Steps.SeedView seed={seed} isVisible={seedIsVisible} />,
          valid: seedIsVisible,
        },
        {
          screen:
            <Steps.SeedConfirm
              seed={seed}
              seedConfirmation={seedConfirmation}
              focusedSeedIndex={focusedSeedIndex}
              seedAutocompleteMatches={seedAutocompleteMatches}
            />,
          valid: isSeedConfirmationValid,
        },
        {
          screen: <Steps.SetPassword password={password} passwordConfirmation={passwordConfirmation} />,
          valid: isPasswordValid,
        },
        {
          screen: <Steps.WalletCreate />,
        }
      ]
      break;

    case 'restore-wallet':
      steps = [
        {
          screen: <Steps.SeedConfirm
            seed={seed}
            seedConfirmation={seedConfirmation}
            focusedSeedIndex={focusedSeedIndex}
            seedAutocompleteMatches={seedAutocompleteMatches}
          />,
          valid: seedConfirmation && seedConfirmation.filter(word => !word || word === '').length === 0,
        },
        {
          screen: <Steps.SetPassword password={password} passwordConfirmation={passwordConfirmation} />,
          valid: !!password,
        },
        {
          screen: <Steps.WalletRestore />,
        },
      ]
      break;

    default:
      steps = []
  }

  steps.unshift({
    screen: <Steps.Welcome selectedMode={selectedMode} switchMode={doSwitchMode} />,
    valid: !!selectedMode
  })

  const step = steps[currentStep]
  
  return (
    <div className="flex-1 w-full flex flex-col">
      <div className="h-titlebar draggable"></div>
      
      {step.screen}

      {currentStep < steps.length-1 && (
        <footer className="flex justify-between items-center p-8 border-t border-gray-500">
          {currentStep > 0 ? (
            <button tabIndex={-1} className="text-gray-300 text-sm hover:text-white flex items-center p-4 -m-4" onClick={gotoPrevStep}>
              <FiArrowLeft className="mr-1 mt-1" /> Back
            </button>
          ) : (
            <div>
              <button tabIndex={-1} className="text-gray-300 text-sm hover:text-white flex items-center p-4 -m-4" onClick={skipSetup}>
                Skip setup
              </button>
            </div>
          )}
          <div>
            <Button primary disabled={!step.valid} onClick={gotoNextStep}>
              Continue
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}

export default Setup
