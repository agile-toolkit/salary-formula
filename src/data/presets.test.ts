import { describe, it, expect } from 'vitest'
import { calcSalary, DEFAULT_FACTORS } from './presets'
import type { Factor } from '../types'

describe('calcSalary', () => {
  it('multiplies base by the product of all non-base factor values', () => {
    const factors: Factor[] = [
      { id: 'base', name: 'base', value: 100000, min: 0, max: 1, step: 1, descriptionKey: '', isBase: true },
      { id: 'a', name: 'a', value: 1.5, min: 0, max: 1, step: 1, descriptionKey: '' },
      { id: 'b', name: 'b', value: 2, min: 0, max: 1, step: 1, descriptionKey: '' },
    ]
    expect(calcSalary(factors)).toBe(300000)
  })

  it('rounds to the nearest whole currency unit', () => {
    const factors: Factor[] = [
      { id: 'base', name: 'base', value: 100000, min: 0, max: 1, step: 1, descriptionKey: '', isBase: true },
      { id: 'a', name: 'a', value: 1.005, min: 0, max: 1, step: 1, descriptionKey: '' },
    ]
    expect(calcSalary(factors)).toBe(100500)
  })

  it('returns 0 when no base factor is present', () => {
    const factors: Factor[] = [
      { id: 'a', name: 'a', value: 1.5, min: 0, max: 1, step: 1, descriptionKey: '' },
    ]
    expect(calcSalary(factors)).toBe(0)
  })

  it('matches the default factor stack baseline (all multipliers at 1.0)', () => {
    expect(calcSalary(DEFAULT_FACTORS)).toBe(80000)
  })
})
