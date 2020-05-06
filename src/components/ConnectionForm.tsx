import React from 'react'
import { useForm } from 'react-hook-form'
import Button from 'components/UI/Button'

const ConnectionForm = ({
  onSubmit,
  defaultValues,
}: {
  onSubmit(data: any): void
  defaultValues: {}
}) => {
  const { register, handleSubmit } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-gray-500 rounded">
        <select
          autoFocus
          name="protocol"
          ref={register({ required: true })}
          className="block h-12 bg-transparent text-white w-full rounded-t px-3 appearance-none placeholder-gray-400 resize-none"
          placeholder="protocol"
        >
          <option value="http">http</option>
          <option value="https">https</option>
        </select>
        <input
          type="text"
          name="host"
          ref={register({ required: true })}
          className="block h-12 bg-transparent border-t border-gray-700 text-white w-full rounded-b px-3 placeholder-gray-400"
          placeholder="host"
        />
        <input
          type="text"
          name="port"
          ref={register({ required: true })}
          className="block h-12 bg-transparent border-t border-gray-700 text-white w-full rounded-b px-3 placeholder-gray-400"
          placeholder="port"
        />
      </div>

      <div className="mt-4">
        <Button primary size="lg" className="h-12 w-full">
          Save
        </Button>
      </div>
    </form>
  )
}

export default ConnectionForm
