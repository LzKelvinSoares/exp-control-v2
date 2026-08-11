'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCalendar } from '@/store/calendar'
import { MONTHS } from '@/constants'

export default function MonthYearSelector() {
  const { month, year, setMonth, setYear } = useCalendar()

  function prev() {
    if (month === 1) { setMonth(12); setYear(year - 1) }
    else setMonth(month - 1)
  }

  function next() {
    if (month === 12) { setMonth(1); setYear(year + 1) }
    else setMonth(month + 1)
  }

  const label = MONTHS.find((m) => m.value === month)?.label ?? ''

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={prev} className="h-8 w-8">
        <ChevronLeft size={16} />
      </Button>
      <span className="text-sm font-semibold w-32 text-center">
        {label} {year}
      </span>
      <Button variant="ghost" size="icon" onClick={next} className="h-8 w-8">
        <ChevronRight size={16} />
      </Button>
    </div>
  )
}
