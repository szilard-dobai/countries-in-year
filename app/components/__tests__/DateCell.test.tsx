import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DateCell from '../DateCell'
import type { CountryVisit } from '../../lib/types'

describe('DateCell', () => {
  const mockOnRemoveVisit = vi.fn()

  beforeEach(() => {
    mockOnRemoveVisit.mockClear()
  })

  describe('Empty date cell', () => {
    it('should render empty cell when date is null', () => {
      const { container } = render(
        <DateCell
          date={null}
          visits={[]}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      const cell = container.querySelector('[role="gridcell"]')
      expect(cell).toBeInTheDocument()
      expect(cell).toHaveAttribute('aria-hidden', 'true')
    })

    it('should render date number when no visits', () => {
      const date = new Date(2025, 1, 15) // Feb 15, 2025
      render(
        <DateCell
          date={date}
          visits={[]}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      expect(screen.getByText('15')).toBeInTheDocument()
    })

    it('should highlight today date in red', () => {
      const today = new Date()
      render(
        <DateCell
          date={today}
          visits={[]}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      const dayNumber = screen.getByText(today.getDate().toString())
      expect(dayNumber).toHaveClass('text-red-500')
      expect(dayNumber).toHaveClass('font-bold')
    })
  })

  describe('Single country visit', () => {
    const singleVisit: CountryVisit[] = [
      {
        id: 'visit-1',
        countryCode: 'US',
        date: new Date(2025, 1, 15),
      },
    ]

    it('should render single flag emoji centered', () => {
      const date = new Date(2025, 1, 15)
      const { container } = render(
        <DateCell
          date={date}
          visits={singleVisit}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      // Check that flag emoji is rendered (US flag)
      const flagEmoji = container.querySelector('.text-lg')
      expect(flagEmoji).toBeInTheDocument()
      expect(flagEmoji).toHaveTextContent('🇺🇸')
    })

    it('should render single flag icon when flagDisplayMode is icon', () => {
      const date = new Date(2025, 1, 15)
      const { container } = render(
        <DateCell
          date={date}
          visits={singleVisit}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="icon"
        />
      )

      // Check that flag icon (svg) is rendered
      const flagIcon = container.querySelector('svg')
      expect(flagIcon).toBeInTheDocument()
    })

    it('should show delete button on hover and call onRemoveVisit', async () => {
      const user = userEvent.setup()
      const date = new Date(2025, 1, 15)
      render(
        <DateCell
          date={date}
          visits={singleVisit}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      const deleteButton = screen.getByRole('button', {
        name: /remove visits: united states/i,
      })
      expect(deleteButton).toBeInTheDocument()

      await user.click(deleteButton)
      expect(mockOnRemoveVisit).toHaveBeenCalledTimes(1)
      expect(mockOnRemoveVisit).toHaveBeenCalledWith('visit-1')
    })
  })

  describe('Two countries visit - vertical stacking', () => {
    const twoVisits: CountryVisit[] = [
      {
        id: 'visit-1',
        countryCode: 'LV',
        date: new Date(2025, 1, 2),
      },
      {
        id: 'visit-2',
        countryCode: 'VA',
        date: new Date(2025, 1, 2),
      },
    ]

    it('should render two flag emojis stacked vertically', () => {
      const date = new Date(2025, 1, 2)
      const { container } = render(
        <DateCell
          date={date}
          visits={twoVisits}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      // Check for vertical stacking container
      const stackContainer = container.querySelector('.flex-col')
      expect(stackContainer).toBeInTheDocument()

      // Check for two flag containers with flex-1 (equal height)
      const flagContainers = container.querySelectorAll('.flex-1')
      expect(flagContainers).toHaveLength(2)

      // Check for both flags
      const flags = container.querySelectorAll('.text-sm')
      expect(flags).toHaveLength(2)
      expect(flags[0]).toHaveTextContent('🇱🇻') // Latvia
      expect(flags[1]).toHaveTextContent('🇻🇦') // Vatican City
    })

    it('should render two flag icons stacked vertically when flagDisplayMode is icon', () => {
      const date = new Date(2025, 1, 2)
      const { container } = render(
        <DateCell
          date={date}
          visits={twoVisits}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="icon"
        />
      )

      // Check for vertical stacking container
      const stackContainer = container.querySelector('.flex-col')
      expect(stackContainer).toBeInTheDocument()

      // Check for two flag icons (svgs)
      const flagIcons = container.querySelectorAll('svg')
      expect(flagIcons).toHaveLength(2)
    })

    it('should use smaller font size for two stacked flags', () => {
      const date = new Date(2025, 1, 2)
      const { container } = render(
        <DateCell
          date={date}
          visits={twoVisits}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      // Stacked flags should use text-sm instead of text-lg
      const flags = container.querySelectorAll('.text-sm')
      expect(flags).toHaveLength(2)

      // Single flag should not exist
      const singleFlag = container.querySelector('.text-lg')
      expect(singleFlag).not.toBeInTheDocument()
    })

    it('should have zero gap between stacked flags', () => {
      const date = new Date(2025, 1, 2)
      const { container } = render(
        <DateCell
          date={date}
          visits={twoVisits}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      // Find the correct stacking container (not the parent flex-col)
      const stackContainer = container.querySelector(
        '.flex.flex-col.items-center.justify-center.gap-0'
      )
      expect(stackContainer).toBeInTheDocument()
      expect(stackContainer).toHaveClass('gap-0')
    })

    it('should remove all visits when delete button is clicked', async () => {
      const user = userEvent.setup()
      const date = new Date(2025, 1, 2)
      render(
        <DateCell
          date={date}
          visits={twoVisits}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      const deleteButton = screen.getByRole('button', {
        name: /remove visits: latvia, vatican city/i,
      })

      await user.click(deleteButton)

      // Should call onRemoveVisit for both visits
      expect(mockOnRemoveVisit).toHaveBeenCalledTimes(2)
      expect(mockOnRemoveVisit).toHaveBeenCalledWith('visit-1')
      expect(mockOnRemoveVisit).toHaveBeenCalledWith('visit-2')
    })

    it('should have correct aria-label with both countries', () => {
      const date = new Date(2025, 1, 2)
      const { container } = render(
        <DateCell
          date={date}
          visits={twoVisits}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      const cell = container.querySelector('[role="gridcell"]')
      expect(cell).toHaveAttribute(
        'aria-label',
        'February 2, visited Latvia, Vatican City'
      )
    })
  })

  describe('Edge cases', () => {
    it('should handle visits for different dates gracefully', () => {
      const date = new Date(2025, 1, 15)
      const visits: CountryVisit[] = [
        {
          id: 'visit-1',
          countryCode: 'US',
          date: new Date(2025, 1, 10), // Different date
        },
      ]

      render(
        <DateCell
          date={date}
          visits={visits}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      // Should show date number since no visits match this date
      expect(screen.getByText('15')).toBeInTheDocument()
    })

    it('should handle country without name gracefully', () => {
      const date = new Date(2025, 1, 15)
      const visits: CountryVisit[] = [
        {
          id: 'visit-1',
          countryCode: 'XX',
          date: new Date(2025, 1, 15),
        },
      ]

      const { container } = render(
        <DateCell
          date={date}
          visits={visits}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      const cell = container.querySelector('[role="gridcell"]')
      expect(cell).toBeInTheDocument()
    })
  })

  describe('Regression tests for two-country stacking', () => {
    it('should NOT render flags horizontally side-by-side', () => {
      const date = new Date(2025, 1, 2)
      const twoVisits: CountryVisit[] = [
        {
          id: 'visit-1',
          countryCode: 'LV',
          date: new Date(2025, 1, 2),
        },
        {
          id: 'visit-2',
          countryCode: 'VA',
          date: new Date(2025, 1, 2),
        },
      ]

      const { container } = render(
        <DateCell
          date={date}
          visits={twoVisits}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      // Should use flex-col (vertical), NOT flex-row (horizontal)
      const stackContainer = container.querySelector('.flex-col')
      expect(stackContainer).toBeInTheDocument()

      const horizontalContainer = container.querySelector('.flex-row')
      expect(horizontalContainer).not.toBeInTheDocument()
    })

    it('should render exactly two flags when there are two visits', () => {
      const date = new Date(2025, 1, 2)
      const twoVisits: CountryVisit[] = [
        {
          id: 'visit-1',
          countryCode: 'UG',
          date: new Date(2025, 1, 2),
        },
        {
          id: 'visit-2',
          countryCode: 'KE',
          date: new Date(2025, 1, 2),
        },
      ]

      const { container } = render(
        <DateCell
          date={date}
          visits={twoVisits}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      const flagContainers = container.querySelectorAll('.flex-1')
      expect(flagContainers).toHaveLength(2)

      const flags = container.querySelectorAll('.text-sm')
      expect(flags).toHaveLength(2)
    })

    it('should allocate equal vertical space to both flags (flex-1)', () => {
      const date = new Date(2025, 1, 2)
      const twoVisits: CountryVisit[] = [
        {
          id: 'visit-1',
          countryCode: 'FR',
          date: new Date(2025, 1, 2),
        },
        {
          id: 'visit-2',
          countryCode: 'ES',
          date: new Date(2025, 1, 2),
        },
      ]

      const { container } = render(
        <DateCell
          date={date}
          visits={twoVisits}
          onRemoveVisit={mockOnRemoveVisit}
          flagDisplayMode="emoji"
        />
      )

      // Both containers should have flex-1 for equal space
      const flagContainers = container.querySelectorAll('.flex-1')
      expect(flagContainers).toHaveLength(2)
      flagContainers.forEach((container) => {
        expect(container).toHaveClass('flex-1')
      })
    })
  })
})
