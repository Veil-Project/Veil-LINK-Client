import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.minimal.css'

const Notifications = () => (
  <ToastContainer
    closeButton={false}
    position={toast.POSITION.BOTTOM_CENTER}
    hideProgressBar={true}
    toastClassName="absolute z-50 bottom-0 left-1/2 mb-4 bg-blue-500 border border-gray-800 whitespace-no-wrap font-medium shadow-lg leading-none text-sm text-white py-2 px-4 rounded-full"
  />
)

export default Notifications
