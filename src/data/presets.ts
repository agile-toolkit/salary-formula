import type { Factor } from '../types'

export const DEFAULT_FACTORS: Factor[] = [
  {
    id: 'base',
    name: 'base',
    value: 80000,
    min: 20000,
    max: 300000,
    step: 1000,
    descriptionKey: 'factors.base.desc',
    isBase: true,
  },
  {
    id: 'seniority',
    name: 'seniority',
    value: 1.0,
    min: 0.6,
    max: 1.8,
    step: 0.05,
    descriptionKey: 'factors.seniority.desc',
  },
  {
    id: 'skills',
    name: 'skills',
    value: 1.0,
    min: 0.7,
    max: 1.4,
    step: 0.05,
    descriptionKey: 'factors.skills.desc',
  },
  {
    id: 'location',
    name: 'location',
    value: 1.0,
    min: 0.5,
    max: 1.5,
    step: 0.05,
    descriptionKey: 'factors.location.desc',
  },
  {
    id: 'performance',
    name: 'performance',
    value: 1.0,
    min: 0.85,
    max: 1.25,
    step: 0.05,
    descriptionKey: 'factors.performance.desc',
  },
]

export const SENIORITY_LABELS: Record<number, string> = {
  0.6: 'Intern',
  0.7: 'Junior',
  0.8: 'Junior+',
  0.9: 'Mid',
  1.0: 'Mid+',
  1.1: 'Senior',
  1.2: 'Senior+',
  1.3: 'Lead',
  1.4: 'Staff',
  1.5: 'Principal',
  1.6: 'Director',
  1.7: 'VP',
  1.8: 'C-Level',
}

export const PERFORMANCE_LABELS: Record<number, string> = {
  0.85: 'Below Expectations',
  0.9: 'Meets Some',
  0.95: 'Meets Expectations',
  1.0: 'Fully Meets',
  1.05: 'Exceeds Some',
  1.1: 'Exceeds',
  1.15: 'Significantly Exceeds',
  1.2: 'Outstanding',
  1.25: 'Exceptional',
}

export function calcSalary(factors: Factor[]): number {
  const base = factors.find(f => f.isBase)?.value ?? 0
  const multiplier = factors
    .filter(f => !f.isBase)
    .reduce((acc, f) => acc * f.value, 1)
  return Math.round(base * multiplier)
}

export const CURRENCIES = ['USD', 'EUR', 'RUB', 'GBP'] as const
export type Currency = typeof CURRENCIES[number]

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  RUB: '₽',
  GBP: '£',
}

export function formatSalary(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency
  if (amount >= 1000000) return `${symbol}${(amount / 1000000).toFixed(2)}M`
  if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(0)}K`
  return `${symbol}${amount}`
}
