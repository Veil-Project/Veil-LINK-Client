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
          className="block h-12 bg-transparent text-white w-full rounded-t px-3 placeholder-gray-400 resize-none"
          placeholder="rpcuser"
        />
        <input
          type="password"
          name="pass"
          ref={register({ required: true })}
          className="block h-12 bg-transparent border-t border-gray-700 text-white w-full rounded-b px-3 placeholder-gray-400"
          placeholder="rpcpassword"
        />
      </div>

      <div className="mt-4">
        <Button primary size="lg" disabled={disabled} className="h-12 w-full">
          Connect now
        </Button>
      </div>
    </form>
  )
}

export default LoginForm
