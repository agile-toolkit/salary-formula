import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Profile, Factor } from '../types'
import { calcSalary, formatSalary } from '../data/presets'

const SPRINT_METRICS_KEY = 'sprint_metrics_salary_bridge_v1'

interface Props {
  profiles: Profile[]
  factors: Factor[]
  currency: string
  onDelete: (id: string) => void
  onLoad: (profile: Profile) => void
}

export default function ComparisonView({ profiles, factors, currency, onDelete, onLoad }: Props) {
  const { t } = useTranslation()
  const [shared, setShared] = useState(false)

  if (profiles.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('comparison.title')}</h1>
        <div className="card text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <p>{t('comparison.empty')}</p>
        </div>
      </div>
    )
  }

  const maxSalary = Math.max(
    ...profiles.map(p => {
      const merged = factors.map(f => ({ ...f, value: p.factors[f.id] ?? f.value }))
      return calcSalary(merged)
    })
  )

  function handleShareWithSprintMetrics() {
    const data = {
      profiles: profiles.map(p => {
        const merged = factors.map(f => ({ ...f, value: p.factors[f.id] ?? f.value }))
        return { name: p.name, annualSalary: calcSalary(merged), currency }
      }),
      exportedAt: new Date().toISOString(),
    }
    localStorage.setItem(SPRINT_METRICS_KEY, JSON.stringify(data))
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('comparison.title')}</h1>
        <button
          onClick={handleShareWithSprintMetrics}
          className="btn-ghost text-sm text-indigo-600 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors"
        >
          {shared ? t('comparison.share_done') : t('comparison.share_sprint_metrics')}
        </button>
      </div>

      <div className="space-y-4">
        {profiles.map(profile => {
          const merged = factors.map(f => ({ ...f, value: profile.factors[f.id] ?? f.value }))
          const salary = calcSalary(merged)
          const barPct = maxSalary > 0 ? (salary / maxSalary) * 100 : 0

          return (
            <div key={profile.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                  <span className="text-2xl font-bold text-brand-600 tabular-nums">
                    {formatSalary(salary, currency)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onLoad(profile)}
                    className="btn-ghost text-brand-600"
                  >
                    {t('comparison.add')}
                  </button>
                  <button
                    onClick={() => onDelete(profile.id)}
                    className="btn-ghost text-red-500"
                  >
                    {t('comparison.delete')}
                  </button>
                </div>
              </div>

              {/* Bar */}
              <div className="h-2 bg-gray-100 rounded-full mb-3">
                <div
                  className="h-2 bg-brand-500 rounded-full transition-all"
                  style={{ width: `${barPct}%` }}
                />
              </div>

              {/* Factor breakdown */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {factors.map(f => (
                  <div key={f.id} className="flex justify-between text-xs">
                    <span className="text-gray-500">{t(`factors.${f.id}.label`)}</span>
                    <span className="text-gray-700 font-medium tabular-nums">
                      {f.isBase
                        ? formatSalary(profile.factors[f.id] ?? f.value, currency)
                        : (profile.factors[f.id] ?? f.value).toFixed(2) + '×'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
