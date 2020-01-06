import React from 'react'
import { navigate, RouteComponentProps } from '@reach/router'
import Sheet from 'components/UI/Sheet'

const Transaction = (props: RouteComponentProps) => (
  <Sheet onClose={() => navigate('/')}>
    <h1 className="leading-none text-2xl font-semibold border-b-2 border-gray-500 pb-3 mb-8">
      Transaction details
    </h1>

    
  </Sheet>
)

export default Transaction
