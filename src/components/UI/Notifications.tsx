import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FiX } from 'react-icons/fi'

const CloseButton = ({ closeToast }: any) => <FiX onClick={closeToast} />

const Notifications = () => (
  <ToastContainer
    position={toast.POSITION.BOTTOM_CENTER}
    hideProgressBar={true}
    autoClose={3000}
    closeButton={<CloseButton />}
    toastClassName="leading-tight text-sm"
  />
)

export default Notifications
