import React from 'react'
import { navigate, RouteComponentProps } from '@reach/router'
import Sheet from 'components/UI/Sheet'

const Transaction = (props: RouteComponentProps) => (
  <Sheet onClose={() => navigate('/')}>
    Transaction details
  </Sheet>
)

export default Transaction
