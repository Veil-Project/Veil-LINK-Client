import React from 'react';
import Button from '../components/UI/Button'
import Sheet from '../components/UI/Sheet'
import { navigate, RouteComponentProps } from '@reach/router';

const Send = (props: RouteComponentProps) => {
  return (
    <Sheet onClose={() => navigate('/')}>
      <h1 className="leading-none text-2xl font-semibold border-b-2 border-gray-500 pb-3 mb-8">
        Send Veil
      </h1>
      
      <div className="flex-1">
        <input type="text" autoFocus className="bg-gray-800 text-lg h-12 w-full rounded px-4 placeholder-gray-400" placeholder="Recipient name or address" />
        <div className="my-6 flex flex-wrap -m-1">
          Contacts go here…
        </div>
      </div>
      <div className="flex">
        <Button primary onClick={() => alert('todo')}>Send transaction</Button>
      </div>
    </Sheet>
  )
}

export default Send
