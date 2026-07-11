import type { Factor, FormulaConfig } from '../types'

export function encodeFormula(config: FormulaConfig): string {
  return btoa(encodeURIComponent(JSON.stringify(config)))
}

export function decodeFormula(encoded: string): { factors: Factor[]; currency: string } | null {
  try {
    const config = JSON.parse(decodeURIComponent(atob(encoded))) as FormulaConfig
    if (!Array.isArray(config.factors) || !config.currency) return null
    return { factors: config.factors, currency: config.currency }
  } catch {
    return null
  }
}

export function decodeFormulaHash(hash: string): { factors: Factor[]; currency: string } | null {
  if (!hash.startsWith('#formula=')) return null
  return decodeFormula(hash.slice('#formula='.length))
}
