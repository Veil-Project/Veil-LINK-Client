import React, { useState, useEffect } from 'react'
import { useStore } from 'store'
import { StakingStatus } from 'store/slices/staking'
import { map, sum } from 'lodash'

import Button from 'components/UI/Button'
import PasswordPrompt from 'components/PasswordPrompt'
import { useToasts } from 'react-toast-notifications'
import StakingOverview from 'components/StakingOverview'
import SidebarBlock from './SidebarBlock'

interface StakingButtonProps {
  isAvailable: boolean
  currentStatus: StakingStatus
  requestedStatus: StakingStatus | null
  onEnable: any
}

const StakingButton = ({
  isAvailable,
  currentStatus,
  requestedStatus,
  onEnable,
}: StakingButtonProps) => {
  switch (currentStatus) {
    case 'enabled':
      return null
    case 'disabled':
      return isAvailable ? (
        <Button
          primary
          onClick={onEnable}
          disabled={requestedStatus === 'enabled'}
        >
          {requestedStatus === 'enabled' ? 'Please wait…' : 'Enable staking'}
        </Button>
      ) : (
        <div className="h-9 text-center text-sm font-semibold flex items-center justify-center rounded bg-gray-600 text-gray-300 pb-px">
          Staking unavailable
        </div>
      )
  }
}

const StakingBlock = () => {
  const [data, setData] = useState<number[]>([])
  const [requiresPassword, setRequiresPassword] = useState(false)
  const { addToast } = useToasts()
  const { state, actions, effects } = useStore()
  const { staking } = state

  useEffect(() => {
    if (staking.error) {
      addToast(staking.error, { appearance: 'error' })
    }
  }, [staking.error, addToast])

  useEffect(() => {
    ;(async () => {
      const txByDay = await Promise.all(
        [7, 6, 5, 4, 3, 2, 1].map(daysAgo =>
          effects.db.fetchStakesForDay(daysAgo)
        )
      )
      const data = txByDay.map((day: any) => sum(map(day, 'totalAmount')))
      setData(data)
    })()
  }, [effects.db, state.transactions.txids.length])

  const handleEnableStaking = async (password: string) => {
    const error = await actions.staking.enable(password)
    if (error) {
      addToast(error.message, { appearance: 'error' })
    } else {
      setRequiresPassword(false)
    }
  }

  return (
    <>
      {requiresPassword && (
        <PasswordPrompt
          title="Enable staking"
          onCancel={() => setRequiresPassword(false)}
          onSubmit={(password: string) => handleEnableStaking(password)}
        />
      )}
      <SidebarBlock title="Staking Overview">
        <StakingOverview
          isDimmed={staking.status.current === 'disabled'}
          data={data}
        />
        {staking.status.current === 'disabled' && (
          <div className="mt-4 grid">
            <StakingButton
              isAvailable={staking.isAvailable}
              currentStatus={staking.status.current}
              requestedStatus={staking.status.requested}
              onEnable={() => setRequiresPassword(true)}
            />
          </div>
        )}
      </SidebarBlock>
    </>
  )
}

export default StakingBlock
