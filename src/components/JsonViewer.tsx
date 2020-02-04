import React from 'react'
import ReactJson from 'react-json-view'

interface JsonViewerProps {
  src: object
}

const JsonViewer = ({ src }: JsonViewerProps) => (
  <ReactJson
    src={src}
    name={null}
    theme="twilight"
    displayObjectSize={false}
    displayDataTypes={false}
    collapsed={1}
    style={{
      fontFamily: 'inherit',
      padding: '4px 0',
      backgroundColor: 'transparent',
    }}
  />
)

export default JsonViewer
