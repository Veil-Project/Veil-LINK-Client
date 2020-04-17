import React, { useState } from 'react'
import { Router, Link, RouteComponentProps, navigate } from '@reach/router'

import Modal from 'components/UI/Modal'
import Button from 'components/UI/Button'
import { useForm } from 'react-hook-form'
import StrengthMeter from 'components/StrengthMeter'
import scorePassword from 'utils/scorePassword'
import { useStore } from 'store'
import { useToasts } from 'react-toast-notifications'

const ChangePassword = (props: RouteComponentProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, watch } = useForm()
  const { effects } = useStore()
  const { addToast } = useToasts()

  const currentPassword = watch('currentPassword')
  const newPassword = watch('newPassword')
  const newPasswordConfirmation = watch('newPasswordConfirmation')
  const passwordStrength = scorePassword(newPassword)

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      await effects.rpc.changePassword(data.currentPassword, data.newPassword)
      addToast('Password changed!', { appearance: 'success' })
      navigate('/')
    } catch (e) {
      addToast(e.message, { appearance: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      className="w-full max-w-sm p-8 pt-6"
      onClose={() => navigate('/')}
      canClose={!isSubmitting}
    >
      <h1 className="mb-6 text-lg text-center leading-none">Change password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          autoFocus
          name="currentPassword"
          type="password"
          placeholder="Current password"
          ref={register()}
          className="h-12 mb-2 bg-gray-500 rounded px-4 w-full text-lg outline-none placeholder-gray-400"
        />
        <input
          name="newPassword"
          type="password"
          placeholder="New password"
          ref={register()}
          className="mt-px h-12 bg-gray-500 rounded-t px-4 w-full text-lg outline-none placeholder-gray-400"
        />
        <input
          name="newPasswordConfirmation"
          type="password"
          placeholder="Confirm new password"
          ref={register()}
          className="mt-px h-12 bg-gray-500 rounded-b px-4 w-full text-lg outline-none placeholder-gray-400"
        />

        <div className="mt-2 mb-6">
          <StrengthMeter strength={passwordStrength} />
        </div>

        <Button
          disabled={
            isSubmitting ||
            !currentPassword ||
            !newPassword ||
            newPassword !== newPasswordConfirmation
          }
          primary
          size="lg"
          className="w-full h-12"
        >
          Change password
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-400">
        This password can not be recovered. If you forget or lose it, the wallet
        must be restored from the seed.
      </div>
    </Modal>
  )
}

export default ChangePassword
