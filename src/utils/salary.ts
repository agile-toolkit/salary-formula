import type { Factor } from '../types'
import { calcSalary } from '../data/presets'

/** Total annual salary from factor sliders (same model as the calculator). */
export function calculateSalary(factors: Factor[]): number {
  return calcSalary(factors)
}

export interface FactorBreakdownEntry {
  id: string
  value: number
  pct: number
}

/** Each non-base factor's share of the summed non-base factor values, as a percentage. */
export function factorBreakdown(factors: Factor[]): FactorBreakdownEntry[] {
  const nonBase = factors.filter(f => !f.isBase)
  const total = nonBase.reduce((sum, f) => sum + f.value, 0)
  return nonBase.map(f => ({
    id: f.id,
    value: f.value,
    pct: total > 0 ? (f.value / total) * 100 : 0,
  }))
}

export function formatCurrency(amount: number, currency: string, locale?: string): string {
  const loc =
    locale ?? (currency === 'RUB' ? 'ru-RU' : currency === 'EUR' ? 'de-DE' : 'en-US')
  try {
    return new Intl.NumberFormat(loc, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}
