import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import html2canvas from 'html2canvas'
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
  const [exporting, setExporting] = useState(false)
  const cardsRef = useRef<HTMLDivElement>(null)

  if (profiles.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">{t('comparison.title')}</h1>
        <div className="card text-center py-12 text-gray-500 dark:text-gray-400">
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

  async function handleExportImage() {
    if (!cardsRef.current || exporting) return
    setExporting(true)
    try {
      const canvas = await html2canvas(cardsRef.current, { scale: 2, useCORS: true })
      const link = document.createElement('a')
      link.download = 'salary-comparison.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setExporting(false)
    }
  }

  function handleExportCsv() {
    const headers = ['name', ...factors.map(f => f.id), 'total_salary']
    const rows = profiles.map(p => {
      const merged = factors.map(f => ({ ...f, value: p.factors[f.id] ?? f.value }))
      const total = calcSalary(merged)
      const factorVals = factors.map(f => String(p.factors[f.id] ?? f.value))
      return [p.name, ...factorVals, String(total)]
    })
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'salary-comparison.csv'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t('comparison.title')}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportImage}
            disabled={exporting}
            className="btn-ghost text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {exporting ? '…' : t('comparison.export_image')}
          </button>
          <button
            onClick={handleExportCsv}
            className="btn-ghost text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t('comparison.export_csv')}
          </button>
          <button
            onClick={handleShareWithSprintMetrics}
            className="btn-ghost text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            {shared ? t('comparison.share_done') : t('comparison.share_sprint_metrics')}
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-3 py-2 text-sm text-blue-700 dark:text-blue-300">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
        {t('comparison.team_rate_shared')}
      </div>

      <div ref={cardsRef} className="space-y-4">
        {profiles.map(profile => {
          const merged = factors.map(f => ({ ...f, value: profile.factors[f.id] ?? f.value }))
          const salary = calcSalary(merged)
          const barPct = maxSalary > 0 ? (salary / maxSalary) * 100 : 0

          return (
            <div key={profile.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50">{profile.name}</h3>
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
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
                <div
                  className="h-2 bg-brand-500 rounded-full transition-all"
                  style={{ width: `${barPct}%` }}
                />
              </div>

              {/* Factor breakdown */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {factors.map(f => (
                  <div key={f.id} className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">{t(`factors.${f.id}.label`)}</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium tabular-nums">
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
