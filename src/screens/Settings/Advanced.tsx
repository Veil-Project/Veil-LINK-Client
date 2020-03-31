import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { useStore } from 'store'
import Button from 'components/UI/Button'

const Advanced = (props: RouteComponentProps) => {
  const { actions } = useStore()
  const handleReset = () => {
    actions.app.reset()
  }

  return (
    <div>
      <Button primary onClick={handleReset}>
        Reset settings
      </Button>
    </div>
  )
}
export default Advanced
