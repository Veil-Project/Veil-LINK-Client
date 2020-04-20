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
  currentStatus: StakingStatus
  requestedStatus: StakingStatus | null
  onEnable: any
  onDisable: any
}

const StakingButton = ({
  currentStatus,
  requestedStatus,
  onEnable,
  onDisable,
}: StakingButtonProps) => {
  switch (currentStatus) {
    case 'enabled':
      return (
        <button
          onClick={onDisable}
          disabled={requestedStatus === 'enabled'}
          className={
            'font-semibold py-2 px-4 ' +
            (requestedStatus === 'disabled'
              ? 'text-gray-300'
              : 'text-teal-500 hover:text-white')
          }
        >
          {requestedStatus === 'disabled' ? 'Please wait…' : 'Disable staking'}
        </button>
      )
    case 'disabled':
      return (
        <button
          onClick={onEnable}
          disabled={requestedStatus === 'enabled'}
          className={
            'font-semibold py-2 px-4 ' +
            (requestedStatus === 'enabled'
              ? 'text-gray-300'
              : 'text-teal-500 hover:text-white')
          }
        >
          {requestedStatus === 'enabled' ? 'Please wait…' : 'Enable staking'}
        </button>
      )
  }
}

const StakingBlock = ({ onEnableStaking, onDisableStaking }: any) => {
  const [data, setData] = useState<number[]>([])
  const { state, effects } = useStore()
  const { staking } = state

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

  return (
    <SidebarBlock
      title="Staking Overview"
      titleAccessory={
        staking.isAvailable && (
          <StakingButton
            currentStatus={staking.status.current}
            requestedStatus={staking.status.requested}
            onEnable={onEnableStaking}
            onDisable={onDisableStaking}
          />
        )
      }
    >
      <StakingOverview
        isDimmed={staking.status.current === 'disabled'}
        data={data}
      />
    </SidebarBlock>
  )
}

export default StakingBlock
