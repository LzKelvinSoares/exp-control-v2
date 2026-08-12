import type React from 'react'

interface DataCardProps {
  primary: React.ReactNode
  value?: React.ReactNode
  meta?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function DataCard({ primary, value, meta, actions, className }: DataCardProps) {
  return (
    <div className={`rounded-lg border bg-card p-4 space-y-3 ${className ?? ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">{primary}</div>
        {value && <div className="shrink-0">{value}</div>}
      </div>
      {meta && <div className="flex items-center gap-2 flex-wrap">{meta}</div>}
      {actions && <div className="flex items-center gap-1 justify-end">{actions}</div>}
    </div>
  )
}
