'use client'

import { forwardRef } from 'react'
import type { CalendarData } from '../lib/types'
import MonthGrid from './MonthGrid'

interface CalendarGridProps {
  year: number
  calendarData: CalendarData
  onRemoveVisit: (visitId: string) => void
}

const CalendarGrid = forwardRef<HTMLDivElement, CalendarGridProps>(
  ({ year, calendarData, onRemoveVisit }, ref) => {
    const visits = calendarData.visits

    return (
      <div ref={ref} className="space-y-8" data-export-target="calendar">
        <div className="mb-6 text-center">
          <h2 className="text-5xl font-extrabold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            {year}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 12 }, (_, month) => (
            <MonthGrid
              key={month}
              year={year}
              month={month}
              visits={visits}
              onRemoveVisit={onRemoveVisit}
            />
          ))}
        </div>
      </div>
    )
  }
)

CalendarGrid.displayName = 'CalendarGrid'

export default CalendarGrid
