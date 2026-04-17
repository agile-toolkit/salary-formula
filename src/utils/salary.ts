import type { FormulaFactor } from '../types';

export function calculateSalary(base: number, factors: FormulaFactor[]): number {
  const additiveFactors = factors.filter(f => !f.isMultiplier);
  const multiplierFactors = factors.filter(f => f.isMultiplier);

  const maxAdditive = additiveFactors.reduce((sum, f) => sum + f.max * f.weight, 0);
  const currentAdditive = additiveFactors.reduce((sum, f) => sum + f.value * f.weight, 0);

  const additiveRatio = maxAdditive > 0 ? currentAdditive / maxAdditive : 0;
  const combined = base + base * additiveRatio;

  const multiplied = multiplierFactors.reduce((acc, f) => acc * f.value, combined);

  return Math.round(multiplied);
}

export function formatCurrency(amount: number, currency: string, locale?: string): string {
  const loc = locale ?? (currency === 'RUB' ? 'ru-RU' : 'en-US');
  return new Intl.NumberFormat(loc, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
