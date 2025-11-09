import { getCountryByCode } from '../lib/countries'

export interface CountryRankingItem {
  countryCode: string
  count: number
  rank: number
}

interface CountryRankingListProps {
  items: CountryRankingItem[]
  maxItems?: number
}

export default function CountryRankingList({
  items,
  maxItems = 10,
}: CountryRankingListProps) {
  const displayItems = maxItems > 0 ? items.slice(0, maxItems) : items

  if (displayItems.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
        No country visits yet
      </div>
    )
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="text-lg" title="1st place">
            🥇
          </span>
        )
      case 2:
        return (
          <span className="text-lg" title="2nd place">
            🥈
          </span>
        )
      case 3:
        return (
          <span className="text-lg" title="3rd place">
            🥉
          </span>
        )
      default:
        return (
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6 text-center">
            {rank}
          </span>
        )
    }
  }

  return (
    <div className="space-y-2">
      {displayItems.map((item) => {
        const country = getCountryByCode(item.countryCode)
        const countryName = country?.name || item.countryCode

        return (
          <div
            key={item.countryCode}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <div className="flex-shrink-0 w-6 flex items-center justify-center">
              {getRankBadge(item.rank)}
            </div>

            <div className="flex-shrink-0 w-8 h-6 flex items-center">
              <FlagPlaceholder countryCode={item.countryCode} />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate block">
                {countryName}
              </span>
            </div>

            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {item.count} {item.count === 1 ? 'visit' : 'visits'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FlagPlaceholder({ countryCode }: { countryCode: string }) {
  const country = getCountryByCode(countryCode)

  if (!country) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-sm flex items-center justify-center">
        <span className="text-white text-[6px] font-mono">{countryCode}</span>
      </div>
    )
  }

  let FlagComponent

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    FlagComponent = require(`country-flag-icons/react/3x2/${countryCode}`).default
  } catch {
    FlagComponent = null
  }

  if (!FlagComponent) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm flex items-center justify-center">
        <span className="text-white text-[6px] font-mono">{countryCode}</span>
      </div>
    )
  }

  return (
    <FlagComponent
      className="w-full h-full rounded-sm object-cover"
      title={country.name}
    />
  )
}
