import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface BreakdownItem {
  label: string
  value: string
}

interface SummaryCardProps {
  label: string
  value: string
  icon: LucideIcon
  loading?: boolean
  variant?: 'default' | 'positive' | 'negative'
  breakdown?: BreakdownItem[]
}

export default function SummaryCard({ label, value, icon: Icon, loading, variant = 'default', breakdown }: SummaryCardProps) {
  const [open, setOpen] = useState(false)
  const hasBreakdown = !loading && breakdown && breakdown.length > 0

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={cn(
            'rounded-xl p-2.5 shrink-0',
            variant === 'positive' && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
            variant === 'negative' && 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
            variant === 'default'  && 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
          )}>
            <Icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            {loading
              ? <Skeleton className="h-6 w-28 mt-1" />
              : <p className="text-lg font-bold truncate">{value}</p>
            }
          </div>
          {hasBreakdown && (
            <button
              onClick={() => setOpen((o) => !o)}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={open ? 'Ocultar detalhes' : 'Ver detalhes'}
            >
              <ChevronDown size={16} className={cn('transition-transform duration-200', open && 'rotate-180')} />
            </button>
          )}
        </div>

        {hasBreakdown && open && (
          <div className="mt-3 border-t pt-3 space-y-1.5">
            {breakdown!.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground truncate">{item.label}</span>
                <span className="text-xs font-medium shrink-0">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
