import type { CountryVisit } from './types'

/**
 * Calculates the total number of unique countries visited
 */
export function calculateTotalCountriesVisited(visits: CountryVisit[]): number {
  const uniqueCountries = new Set(visits.map((visit) => visit.countryCode))
  return uniqueCountries.size
}

/**
 * Calculates the total number of visits (including repeat visits to same country)
 */
export function calculateTotalVisits(visits: CountryVisit[]): number {
  return visits.length
}

/**
 * Calculates visit counts by country
 */
export function calculateVisitsByCountry(
  visits: CountryVisit[]
): Map<string, number> {
  const countMap = new Map<string, number>()

  for (const visit of visits) {
    const currentCount = countMap.get(visit.countryCode) || 0
    countMap.set(visit.countryCode, currentCount + 1)
  }

  return countMap
}

/**
 * Calculates the most visited countries, sorted by visit count descending
 */
export function calculateMostVisitedCountries(
  visits: CountryVisit[],
  limit = 5
): Array<{ countryCode: string; count: number }> {
  const countMap = calculateVisitsByCountry(visits)

  const sorted = Array.from(countMap.entries())
    .map(([countryCode, count]) => ({ countryCode, count }))
    .sort((a, b) => b.count - a.count)

  return limit > 0 ? sorted.slice(0, limit) : sorted
}

/**
 * Calculates the least visited countries, sorted by visit count ascending
 */
export function calculateLeastVisitedCountries(
  visits: CountryVisit[],
  limit = 5
): Array<{ countryCode: string; count: number }> {
  const countMap = calculateVisitsByCountry(visits)

  const sorted = Array.from(countMap.entries())
    .map(([countryCode, count]) => ({ countryCode, count }))
    .sort((a, b) => a.count - b.count)

  return limit > 0 ? sorted.slice(0, limit) : sorted
}

/**
 * Calculates monthly breakdown of visits for a given year
 */
export function calculateMonthlyBreakdown(
  visits: CountryVisit[],
  year: number
): Array<{ month: number; visitCount: number; uniqueCountries: number }> {
  const monthlyData = Array.from({ length: 12 }, (_, month) => ({
    month,
    visitCount: 0,
    uniqueCountries: 0,
    countries: new Set<string>(),
  }))

  for (const visit of visits) {
    if (visit.date.getFullYear() === year) {
      const month = visit.date.getMonth()
      monthlyData[month].visitCount++
      monthlyData[month].countries.add(visit.countryCode)
    }
  }

  return monthlyData.map(({ month, visitCount, countries }) => ({
    month,
    visitCount,
    uniqueCountries: countries.size,
  }))
}

/**
 * Calculates average visits per country
 */
export function calculateAverageVisitsPerCountry(
  visits: CountryVisit[]
): number {
  const totalCountries = calculateTotalCountriesVisited(visits)
  if (totalCountries === 0) return 0

  return visits.length / totalCountries
}

/**
 * Finds the country with the most visits
 */
export function findMostVisitedCountry(
  visits: CountryVisit[]
): { countryCode: string; count: number } | null {
  const mostVisited = calculateMostVisitedCountries(visits, 1)
  return mostVisited.length > 0 ? mostVisited[0] : null
}
