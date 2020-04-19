import React from 'react'
import ReactJson from 'react-json-view'

interface JsonViewerProps {
  src: object
  collapsed?: number
}

const JsonViewer = ({ src, collapsed = 1 }: JsonViewerProps) => (
  <ReactJson
    src={src}
    name={null}
    theme="twilight"
    displayObjectSize={false}
    displayDataTypes={false}
    collapsed={collapsed}
    style={{
      fontFamily: 'inherit',
      padding: '4px 0',
      backgroundColor: 'transparent',
    }}
  />
)

export default JsonViewer
