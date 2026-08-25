export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
}

export function equityRatio(minSalary: number, maxSalary: number): number {
  return minSalary > 0 ? maxSalary / minSalary : 0
}

export type EquityRatioLevel = 'green' | 'amber' | 'red'

export function equityRatioLevel(ratio: number): EquityRatioLevel {
  if (ratio >= 3.0) return 'red'
  if (ratio >= 2.0) return 'amber'
  return 'green'
}
