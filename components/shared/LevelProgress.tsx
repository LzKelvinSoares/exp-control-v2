'use client'

import { useUserPoints } from '@/hooks/queries/user/use-user-points'
import { USER_LEVELS } from '@/constants'

export default function LevelProgress() {
  const { data } = useUserPoints()
  const points = data?.points ?? 0

  const current = USER_LEVELS.findLast((l) => points >= l.minPoints) ?? USER_LEVELS[0]
  const next = USER_LEVELS.find((l) => l.level === current.level + 1)

  const rangeMin = current.minPoints
  const rangeMax = next ? next.minPoints : current.maxPoints
  const progress = next
    ? Math.min(100, Math.round(((points - rangeMin) / (rangeMax - rangeMin)) * 100))
    : 100

  return (
    <div className="px-4 py-3 border-t border-slate-700 space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{current.label}</span>
        <span>{points} pts</span>
      </div>
      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {next && (
        <p className="text-[10px] text-slate-500 text-right">{next.label} em {rangeMax - points} pts</p>
      )}
    </div>
  )
}
