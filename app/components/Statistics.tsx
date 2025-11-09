import type { CalendarData } from '../lib/types'
import {
  calculateTotalCountriesVisited,
  calculateTotalVisits,
  calculateMostVisitedCountries,
  calculateAverageVisitsPerCountry,
} from '../lib/statistics'
import StatisticsCard from './StatisticsCard'
import CountryRankingList, {
  type CountryRankingItem,
} from './CountryRankingList'

interface StatisticsProps {
  calendarData: CalendarData
  year?: number
}

export default function Statistics({ calendarData, year }: StatisticsProps) {
  const visits = year
    ? calendarData.visits.filter((visit) => visit.date.getFullYear() === year)
    : calendarData.visits

  const totalCountries = calculateTotalCountriesVisited(visits)
  const totalVisits = calculateTotalVisits(visits)
  const averageVisits = calculateAverageVisitsPerCountry(visits)
  const mostVisited = calculateMostVisitedCountries(visits, 5)

  const rankingItems: CountryRankingItem[] = mostVisited.map((item, index) => ({
    ...item,
    rank: index + 1,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Statistics {year && `(${year})`}
        </h2>

        <div className="grid grid-cols-1 gap-3">
          <StatisticsCard
            title="Countries Visited"
            value={totalCountries}
            subtitle={totalCountries === 1 ? 'country' : 'countries'}
          />

          <StatisticsCard
            title="Total Visits"
            value={totalVisits}
            subtitle={totalVisits === 1 ? 'visit' : 'visits'}
          />

          {totalCountries > 0 && (
            <StatisticsCard
              title="Average"
              value={averageVisits.toFixed(1)}
              subtitle="visits per country"
            />
          )}
        </div>
      </div>

      {mostVisited.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">
            Most Visited Countries
          </h3>
          <CountryRankingList items={rankingItems} maxItems={5} />
        </div>
      )}

      {totalVisits === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No visits recorded yet</p>
          <p className="text-xs mt-1">
            Add your first country visit to see statistics
          </p>
        </div>
      )}
    </div>
  )
}
