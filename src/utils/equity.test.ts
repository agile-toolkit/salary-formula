import { describe, it, expect } from 'vitest'
import { median, equityRatio, equityRatioLevel } from './equity'

describe('median', () => {
  it('returns the middle value for an odd-length list', () => {
    expect(median([10, 30, 20])).toBe(20)
  })

  it('averages the two middle values for an even-length list', () => {
    expect(median([10, 20, 30, 40])).toBe(25)
  })

  it('does not mutate the input array', () => {
    const input = [3, 1, 2]
    median(input)
    expect(input).toEqual([3, 1, 2])
  })
})

describe('equityRatio', () => {
  it('divides max by min', () => {
    expect(equityRatio(50000, 150000)).toBe(3)
  })

  it('returns 0 when min salary is 0 to avoid dividing by zero', () => {
    expect(equityRatio(0, 100000)).toBe(0)
  })
})

describe('equityRatioLevel', () => {
  it('is green below 2.0', () => {
    expect(equityRatioLevel(1.99)).toBe('green')
  })

  it('is amber at the 2.0 boundary', () => {
    expect(equityRatioLevel(2.0)).toBe('amber')
  })

  it('is red at the 3.0 boundary', () => {
    expect(equityRatioLevel(3.0)).toBe('red')
  })

  it('is red above 3.0', () => {
    expect(equityRatioLevel(4.5)).toBe('red')
  })
})
