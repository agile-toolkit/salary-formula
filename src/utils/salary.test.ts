import { describe, it, expect } from 'vitest'
import { factorBreakdown } from './salary'
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
