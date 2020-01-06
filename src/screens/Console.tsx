import React, { ChangeEvent, KeyboardEvent, useRef, useEffect, RefObject } from 'react'
import { navigate, RouteComponentProps } from '@reach/router'

import { useSelector, useDispatch } from 'react-redux'
import { selectors, actions } from 'reducers/console'

import Modal from 'components/UI/Modal'
import { FiChevronRight, FiX } from 'react-icons/fi'

const Console = (props: RouteComponentProps) => {
  const commands = useSelector(selectors.commands)
  const currentCommand = useSelector(selectors.currentCommand)
  const dispatch = useDispatch()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(actions.setCurrentCommand(e.target.value))
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement> & ChangeEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      dispatch(actions.sendCommand(e.target.value))
    }
  }

  const commandsEndRef: React.RefObject<HTMLDivElement> = useRef(null)

  const scrollToBottom = () => {
    commandsEndRef?.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [commands])

  return (
    <Modal>
      <button onClick={() => navigate('/')} className="rounded-full p-4 absolute top-0 right-0 text-gray-300 hover:text-white">
        <FiX size="20" /> 
      </button>
      <div className="w-full flex flex-col">
        <div className="flex-1 p-4 overflow-y-scroll">
          {commands.map(command => (
            <div className="flex items-center font-mono">
              <div className="text-gray-300">{command.timestamp.toLocaleTimeString()}</div>
              <div className="ml-4">{command.command}</div>
            </div>
          ))}
          <div ref={commandsEndRef} />
        </div>
        <div className="mt-auto flex-none h-16 flex items-center bg-gray-700 px-4">
          <FiChevronRight size={20} className="text-gray-300" />
          <input 
            type="text"
            className="w-full bg-transparent p-2 outline-none font-mono" 
            autoFocus
            value={currentCommand}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </Modal>
  )
}

export default Console
