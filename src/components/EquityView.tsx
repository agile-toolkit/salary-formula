import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Profile, Factor } from '../types'
import { calcSalary } from '../data/presets'
import { formatCurrency } from '../utils/salary'

interface Props {
  profiles: Profile[]
  factors: Factor[]
  currency: string
}

function computeSalary(profile: Profile, factors: Factor[]): number {
  const merged = factors.map(f => ({ ...f, value: profile.factors[f.id] ?? f.value }))
  return calcSalary(merged)
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
}

export default function EquityView({ profiles, factors, currency }: Props) {
  const { t } = useTranslation()
  const [sortAsc, setSortAsc] = useState(false)

  if (profiles.length < 2) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">{t('equity.title')}</h1>
        <div className="card text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">⚖️</div>
          <p>{t('equity.no_profiles')}</p>
        </div>
      </div>
    )
  }

  const salaries = profiles.map(p => ({ id: p.id, name: p.name, salary: computeSalary(p, factors) }))
  const salaryValues = salaries.map(s => s.salary)
  const minSalary = Math.min(...salaryValues)
  const maxSalary = Math.max(...salaryValues)
  const medianSalary = median(salaryValues)
  const equityRatio = minSalary > 0 ? maxSalary / minSalary : 0

  const ratioColor =
    equityRatio >= 3.0
      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      : equityRatio >= 2.0
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
      : 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'

  const sorted = [...salaries].sort((a, b) =>
    sortAsc ? a.salary - b.salary : b.salary - a.salary
  )

  const nonBaseFactors = factors.filter(f => !f.isBase)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t('equity.title')}</h1>

      {/* Equity ratio */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {t('equity.ratio')}
          </h2>
          <span className={`text-lg font-bold px-3 py-1 rounded-full border ${ratioColor}`}>
            {equityRatio.toFixed(2)}×
          </span>
        </div>

        {/* Distribution bar */}
        <div className="relative mt-2">
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full relative overflow-hidden">
            {/* filled range from min to max */}
            <div
              className="absolute h-full bg-blue-200 rounded-full"
              style={{ left: 0, right: 0 }}
            />
            {/* median marker */}
            {maxSalary > minSalary && (
              <div
                className="absolute h-full w-0.5 bg-blue-600"
                style={{
                  left: `${((medianSalary - minSalary) / (maxSalary - minSalary)) * 100}%`,
                }}
              />
            )}
          </div>

          {/* labels below */}
          <div className="flex justify-between mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatCurrency(minSalary, currency)}</span>
            <span className="text-blue-700 dark:text-blue-400 font-medium">
              {t('equity.median')}: {formatCurrency(medianSalary, currency)}
            </span>
            <span>{formatCurrency(maxSalary, currency)}</span>
          </div>
        </div>

        {equityRatio >= 2.0 && (
          <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
            {equityRatio >= 3.0
              ? t('equity.ratio_high')
              : t('equity.ratio_warn')}
          </p>
        )}
      </div>

      {/* Per-factor spread */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          {t('equity.spread')}
        </h2>
        <div className="space-y-3">
          {nonBaseFactors.map(factor => {
            const vals = profiles.map(p => p.factors[factor.id] ?? factor.value)
            const fMin = Math.min(...vals)
            const fMax = Math.max(...vals)
            const spread = fMax - fMin
            const range = factor.max - factor.min || 1
            const barLeft = ((fMin - factor.min) / range) * 100
            const barWidth = Math.max((spread / range) * 100, 2)
            return (
              <div key={factor.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {t(`factors.${factor.id}.label`)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {fMin.toFixed(2)}× – {fMax.toFixed(2)}×
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full relative overflow-hidden">
                  <div
                    className="absolute h-full bg-blue-400 rounded-full"
                    style={{ left: `${barLeft}%`, width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Ranked profiles */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {t('equity.ranked')}
          </h2>
          <button
            onClick={() => setSortAsc(v => !v)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
          >
            {sortAsc ? t('equity.sort_desc') : t('equity.sort_asc')}
          </button>
        </div>
        <div className="space-y-2">
          {sorted.map(({ id, name, salary }) => {
            const delta = medianSalary > 0
              ? Math.round(((salary - medianSalary) / medianSalary) * 100)
              : 0
            const deltaColor =
              delta > 0 ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : delta < 0 ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
            const deltaLabel = delta > 0 ? `+${delta}%` : `${delta}%`
            return (
              <div key={id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[50%]">{name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                    {formatCurrency(salary, currency)}
                  </span>
                  {delta !== 0 && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${deltaColor}`}>
                      {deltaLabel}
                    </span>
                  )}
                  {delta === 0 && (
                    <span className="text-xs text-gray-400 dark:text-gray-600 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                      {t('equity.at_median')}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
