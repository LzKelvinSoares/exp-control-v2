import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface SummaryCardProps {
  label: string
  value: string
  icon: LucideIcon
  loading?: boolean
  variant?: 'default' | 'positive' | 'negative'
}

export default function SummaryCard({ label, value, icon: Icon, loading, variant = 'default' }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn(
          'rounded-xl p-2.5',
          variant === 'positive' && 'bg-emerald-100 text-emerald-600',
          variant === 'negative' && 'bg-rose-100 text-rose-600',
          variant === 'default'  && 'bg-slate-100 text-slate-600',
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
      </CardContent>
    </Card>
  )
}
