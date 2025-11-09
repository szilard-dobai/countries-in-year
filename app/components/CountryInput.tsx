'use client'

import { useState } from 'react'
import type { CalendarData, Country } from '../lib/types'
import { searchCountries } from '../lib/countries'
import { expandDateRange, canAddVisitToDate } from '../lib/calendar'
import { generateId } from '../lib/utils'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Calendar } from '@/app/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import { Plus, CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'

interface CountryInputProps {
  calendarData: CalendarData
  onDataChange: (data: CalendarData) => void
}

export default function CountryInput({
  calendarData,
  onDataChange,
}: CountryInputProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [error, setError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const filteredCountries =
    searchQuery.length > 0 ? searchCountries(searchQuery) : []

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setSearchQuery(country.name)
    setShowDropdown(false)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSelectedCountry(null)
    setShowDropdown(value.length > 0)
  }

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range)
  }

  const handleClearDates = () => {
    setDateRange(undefined)
    setIsCalendarOpen(false)
  }

  const getDateRangeText = () => {
    if (!dateRange?.from) {
      return 'Pick a date'
    }
    if (dateRange.to) {
      return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
    }
    return format(dateRange.from, 'MMM d, yyyy')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedCountry) {
      setError('Please select a country')
      return
    }

    if (!dateRange?.from) {
      setError('Please select a date')
      return
    }

    const start = dateRange.from
    const end = dateRange.to || start

    if (end < start) {
      setError('End date cannot be before start date')
      return
    }

    const dates = expandDateRange(start, end)

    for (const date of dates) {
      if (!canAddVisitToDate(date, calendarData.visits)) {
        setError(
          `Maximum 2 countries per day exceeded for ${date.toLocaleDateString()}`
        )
        return
      }
    }

    const newVisits = dates.map((date) => ({
      id: generateId(),
      countryCode: selectedCountry.code,
      date,
    }))

    const newData = {
      visits: [...calendarData.visits, ...newVisits],
    }

    onDataChange(newData)

    setSearchQuery('')
    setSelectedCountry(null)
    setDateRange(undefined)
    setError('')
    setIsCalendarOpen(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative space-y-2">
        <Label htmlFor="country-search">Country</Label>
        <Input
          id="country-search"
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setShowDropdown(searchQuery.length > 0)}
          placeholder="Search countries..."
        />
        {showDropdown && filteredCountries.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
            {filteredCountries.slice(0, 10).map((country) => (
              <Button
                key={country.code}
                type="button"
                variant="ghost"
                onClick={() => handleCountrySelect(country)}
                className="w-full justify-start"
              >
                {country.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Date Range</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getDateRangeText()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
            <div className="p-3 border-b flex items-center justify-between">
              <p className="text-sm font-medium">Select date range</p>
              {dateRange?.from && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearDates}
                  className="h-7 px-2"
                >
                  <X className="h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}

      <Button
        type="submit"
        disabled={!selectedCountry || !dateRange?.from}
        className="w-full"
      >
        <Plus className="size-4" />
        Add Visit
      </Button>
    </form>
  )
}
