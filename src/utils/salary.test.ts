import { describe, it, expect } from 'vitest'
import { factorBreakdown, formatCurrency } from './salary'
import type { Factor } from '../types'

function factor(id: string, value: number, isBase = false): Factor {
  return { id, name: id, value, min: 0, max: 2, step: 0.05, descriptionKey: '', isBase }
}

describe('factorBreakdown', () => {
  it('excludes the base factor and sums percentages to 100', () => {
    const factors = [factor('base', 80000, true), factor('a', 1), factor('b', 1), factor('c', 2)]
    const breakdown = factorBreakdown(factors)
    expect(breakdown.map(b => b.id)).toEqual(['a', 'b', 'c'])
    expect(breakdown.reduce((sum, b) => sum + b.pct, 0)).toBeCloseTo(100)
  })

  it('gives each factor a share proportional to its value', () => {
    const factors = [factor('base', 80000, true), factor('a', 1), factor('b', 3)]
    const breakdown = factorBreakdown(factors)
    expect(breakdown.find(b => b.id === 'a')?.pct).toBeCloseTo(25)
    expect(breakdown.find(b => b.id === 'b')?.pct).toBeCloseTo(75)
  })

  it('returns 0% for every factor when all non-base values are 0', () => {
    const factors = [factor('base', 80000, true), factor('a', 0), factor('b', 0)]
    const breakdown = factorBreakdown(factors)
    expect(breakdown.every(b => b.pct === 0)).toBe(true)
  })
})

describe('formatCurrency', () => {
  it('formats USD with grouping separators and no decimals', () => {
    expect(formatCurrency(80000, 'USD')).toBe('$80,000')
  })

  it('uses the currency-appropriate locale (RUB -> ru-RU grouping/symbol)', () => {
    const result = formatCurrency(80000, 'RUB')
    expect(result).toContain('₽')
    expect(result).toMatch(/80.000/) // ru-RU uses a non-breaking space as the group separator
  })

  it('never abbreviates large amounts (unlike the removed formatSalary)', () => {
    expect(formatCurrency(1250000, 'USD')).toBe('$1,250,000')
  })

  it('falls back gracefully instead of throwing for an unrecognised currency code', () => {
    expect(() => formatCurrency(80000, 'XYZ')).not.toThrow()
  })
})
