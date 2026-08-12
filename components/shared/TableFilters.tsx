import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type FilterDef } from '@/hooks/useTableFilter'

interface TableFiltersProps<T> {
  defs: FilterDef<T>[]
  values: Record<string, string>
  hasActive: boolean
  onFilter: (key: string, value: string) => void
  onClear: () => void
}

export function TableFilters<T>({ defs, values, hasActive, onFilter, onClear }: TableFiltersProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {defs.map((def) => (
        def.type === 'text' ? (
          <Input
            key={def.key}
            placeholder={def.placeholder ?? def.label}
            value={values[def.key] ?? ''}
            onChange={(e) => onFilter(def.key, e.target.value)}
            className="h-8 w-40 text-sm"
          />
        ) : def.type === 'date' ? (
          <Input
            key={def.key}
            type="date"
            value={values[def.key] ?? ''}
            onChange={(e) => onFilter(def.key, e.target.value)}
            className="h-8 w-40 text-sm"
          />
        ) : (
          <Select
            key={def.key}
            value={values[def.key] ?? 'all'}
            onValueChange={(v) => onFilter(def.key, v)}
          >
            <SelectTrigger className="h-8 w-36 text-sm">
              <SelectValue placeholder={def.label}>
                {!values[def.key] || values[def.key] === 'all'
                  ? 'Todos'
                  : def.options?.find((o) => o.value === values[def.key])?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {def.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      ))}

      {hasActive && (
        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground" onClick={onClear}>
          <X size={14} className="mr-1" /> Limpar
        </Button>
      )}
    </div>
  )
}
