import { describe, it, expect } from 'vitest'
import { encodeFormula, decodeFormula, decodeFormulaHash } from './formulaUrl'
import type { FormulaConfig } from '../types'

const config: FormulaConfig = {
  currency: 'EUR',
  factors: [
    { id: 'base', name: 'base', value: 90000, min: 0, max: 1, step: 1, descriptionKey: '', isBase: true },
    { id: 'seniority', name: 'seniority', value: 1.2, min: 0.6, max: 1.8, step: 0.05, descriptionKey: '' },
  ],
}

describe('encodeFormula / decodeFormula', () => {
  it('round-trips a formula config through encode and decode', () => {
    const encoded = encodeFormula(config)
    const decoded = decodeFormula(encoded)
    expect(decoded).toEqual({ factors: config.factors, currency: config.currency })
  })

  it('handles non-ASCII characters safely (encodeURIComponent before btoa)', () => {
    const withUnicode: FormulaConfig = { ...config, currency: 'RUB' }
    const encoded = encodeFormula(withUnicode)
    expect(decodeFormula(encoded)?.currency).toBe('RUB')
  })

  it('returns null for garbage input instead of throwing', () => {
    expect(decodeFormula('not-valid-base64!!!')).toBeNull()
  })

  it('returns null when the decoded JSON is missing required fields', () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify({ currency: 'USD' })))
    expect(decodeFormula(encoded)).toBeNull()
  })
})

describe('decodeFormulaHash', () => {
  it('extracts and decodes the #formula= hash segment', () => {
    const encoded = encodeFormula(config)
    expect(decodeFormulaHash(`#formula=${encoded}`)).toEqual({
      factors: config.factors,
      currency: config.currency,
    })
  })

  it('returns null when the hash has no formula segment', () => {
    expect(decodeFormulaHash('#somethingelse')).toBeNull()
    expect(decodeFormulaHash('')).toBeNull()
  })
})
