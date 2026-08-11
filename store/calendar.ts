import { create } from 'zustand'

interface CalendarState {
  month: number
  year: number
  setMonth: (month: number) => void
  setYear: (year: number) => void
}

const now = new Date()

export const useCalendar = create<CalendarState>((set) => ({
  month: now.getMonth() + 1,
  year: now.getFullYear(),
  setMonth: (month) => set({ month }),
  setYear: (year) => set({ year }),
}))
