import React from 'react'
import { Link } from '@reach/router'

interface TitleBarProps {
  title: string
  children: any
}

const TitleBar = ({ title, children }: TitleBarProps) => (
  <div
    className="flex-none bg-gray-700 mb-px flex select-none draggable"
    style={{ height: 37 }}
  >
    <div className="flex-1 pointer-events-none" />
    <div className="flex-none self-center leading-none">
      <Link to="/" className="text-sm font-medium text-gray-300">
        {title}
      </Link>
    </div>
    <div className="flex-1 flex justify-end items-center pr-3">{children}</div>
  </div>
)

export default TitleBar
