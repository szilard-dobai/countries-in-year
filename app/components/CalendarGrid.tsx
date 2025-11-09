'use client'

import { useState } from 'react'
import type { CalendarData } from '../lib/types'
import { loadCalendarData } from '../lib/storage'
import MonthGrid from './MonthGrid'

interface CalendarGridProps {
  year: number
}

function getInitialData(): CalendarData {
  if (typeof window === 'undefined') {
    return { visits: [] }
  }
  return loadCalendarData() || { visits: [] }
}

export default function CalendarGrid({ year }: CalendarGridProps) {
  const [calendarData] = useState<CalendarData>(getInitialData)

  const visits = calendarData.visits

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 12 }, (_, month) => (
          <MonthGrid key={month} year={year} month={month} visits={visits} />
        ))}
      </div>
    </div>
  )
}
