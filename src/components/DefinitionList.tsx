import React from 'react'

interface RowProps {
  label: string
  amount: number
}

const Row = ({ label, amount }: RowProps) => (
  <div className="flex justify-between items-baseline">
    <span className="font-medium">{label}</span>
    <span className="h-px bg-gray-600 flex-1 mx-2" />
    <span className="text-teal-500 font-semibold">
      {amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}{' '}
      VEIL
    </span>
  </div>
)

const DefinitionList = ({ data }: { data: ([string, number] | null)[] }) => {
  return (
    <div className="leading-relaxed text-sm">
      {data.map(row => (row ? <Row label={row[0]} amount={row[1]} /> : null))}
    </div>
  )
}

export default DefinitionList
