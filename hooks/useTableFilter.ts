import { useMemo, useState } from 'react'

export interface FilterDef<T> {
  key: string
  label: string
  type: 'text' | 'select'
  placeholder?: string
  options?: { value: string; label: string }[]
  accessor?: (row: T) => string
}

export function useTableFilter<T>(data: T[], defs: FilterDef<T>[]) {
  const [values, setValues] = useState<Record<string, string>>({})

  const hasActiveFilters = Object.values(values).some((v) => v && v !== 'all')

  const filteredData = useMemo(() => {
    if (!hasActiveFilters) return data
    return data.filter((row) =>
      defs.every((def) => {
        const v = values[def.key]
        if (!v || v === 'all') return true
        const cell = def.accessor
          ? def.accessor(row)
          : String((row as Record<string, unknown>)[def.key] ?? '')
        return def.type === 'text'
          ? cell.toLowerCase().includes(v.toLowerCase())
          : cell === v
      })
    )
  }, [data, values, defs, hasActiveFilters])

  function setFilter(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setValues({})
  }

  return { filteredData, filterValues: values, setFilter, clearFilters, hasActiveFilters }
}
