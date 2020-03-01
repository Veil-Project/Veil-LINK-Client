import React from 'react'
import Spinner from '../components/UI/Spinner'
import { RouteComponentProps } from '@reach/router'

interface LoadingProps {
  message?: string
  progress?: number
}

const Loading = ({ message, progress }: LoadingProps) => (
  <div className="m-auto relative">
    <Spinner />
    {message && (
      <div className="absolute w-64 text-center mt-4 left-1/2 transform -translate-x-1/2">
        {message}
      </div>
    )}
  </div>
)

export default Loading
