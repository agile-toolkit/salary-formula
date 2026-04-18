import type { Factor } from '../types'
import { calcSalary } from '../data/presets'

/** Total annual salary from factor sliders (same model as the calculator). */
export function calculateSalary(factors: Factor[]): number {
  return calcSalary(factors)
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
