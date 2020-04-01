import React from 'react'
import Spinner from '../components/UI/Spinner'

interface LoadingProps {
  message?: string
  progress?: number | null
}

const Loading = ({ message, progress }: LoadingProps) => (
  <div className="m-auto relative w-64">
    <Spinner percentage={progress} />
    {message && <div className="w-full text-center mt-4">{message}</div>}
  </div>
)

export default Loading
