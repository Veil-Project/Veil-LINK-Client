import React from 'react'
import { useForm } from 'react-hook-form'
import Button from 'components/UI/Button'

const LoginForm = ({
  onSubmit,
  defaultValues,
  disabled = false,
}: {
  onSubmit(data: any): void
  defaultValues: {}
  disabled?: boolean
}) => {
  const { register, handleSubmit } = useForm(defaultValues)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-gray-500 rounded">
        <input
          autoFocus
          type="password"
          name="user"
          ref={register({ required: true })}
          className="block w-full h-12 px-3 text-white placeholder-gray-400 bg-transparent rounded-t resize-none"
          placeholder="rpcuser"
        />
        <input
          type="password"
          name="pass"
          ref={register({ required: true })}
          className="block w-full h-12 px-3 text-white placeholder-gray-400 bg-transparent border-t border-gray-700 rounded-b"
          placeholder="rpcpassword"
        />
      </div>

      <div className="mt-4">
        <Button primary size="lg" disabled={disabled} className="w-full h-12">
          Connect now
        </Button>
      </div>
    </form>
  )
}

export default LoginForm
