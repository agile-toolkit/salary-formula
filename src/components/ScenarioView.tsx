import { useTranslation } from 'react-i18next'
import type { Scenario, Factor } from '../types'
import { calcSalary, formatSalary } from '../data/presets'

interface Props {
  scenarios: Scenario[]
  factors: Factor[]
  onDelete: (id: string) => void
}

function toFactors(base: Factor[], scenario: Scenario): Factor[] {
  return base.map(f => ({
    ...f,
    value: scenario.factors[f.id]?.value ?? f.value,
    min: scenario.factors[f.id]?.min ?? f.min,
    max: scenario.factors[f.id]?.max ?? f.max,
    step: scenario.factors[f.id]?.step ?? f.step,
  }))
}

function DeltaBadge({ delta, isBase }: { delta: number; isBase?: boolean }) {
  if (Math.abs(delta) < 0.001) return null
  const positive = delta > 0
  const sign = positive ? '+' : ''
  const label = isBase
    ? `${sign}${delta >= 1000 ? Math.round(delta / 1000) + 'K' : Math.round(delta)}`
    : `${sign}${delta.toFixed(2)}×`
  return (
    <span
      className={`ml-1 text-xs font-medium px-1 py-0.5 rounded ${
        positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {label}
    </span>
  )
}

export default function ScenarioView({ scenarios, factors, onDelete }: Props) {
  const { t } = useTranslation()

  if (scenarios.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('scenario.title')}</h1>
        <div className="card text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🔀</div>
          <p>{t('scenario.empty')}</p>
          <p className="text-sm mt-2 text-gray-400">{t('scenario.empty_hint')}</p>
        </div>
      </div>
    )
  }

  const baseline = scenarios[0]
  const baselineFactors = toFactors(factors, baseline)
  const baselineSalary = calcSalary(baselineFactors)

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('scenario.title')}</h1>
      <p className="text-sm text-gray-500 mb-6">{t('scenario.diff_label')}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="text-left font-medium text-gray-500 pb-3 pr-4 min-w-[140px]">
                {t('scenario.factor_col')}
              </th>
              {scenarios.map((sc, i) => (
                <th key={sc.id} className="text-left pb-3 px-2 min-w-[160px]">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="font-semibold text-gray-900 block">{sc.name}</span>
                      {i === 0 && (
                        <span className="text-xs text-brand-600 font-normal">
                          {t('scenario.baseline_badge')}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onDelete(sc.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors text-xs mt-0.5 shrink-0"
                      title={t('scenario.delete')}
                    >
                      ✕
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {factors.map(f => {
              const baseVal = baseline.factors[f.id]?.value ?? f.value
              return (
                <tr key={f.id} className="border-t border-gray-100">
                  <td className="py-2 pr-4 text-gray-500">{t(`factors.${f.id}.label`)}</td>
                  {scenarios.map((sc, i) => {
                    const val = sc.factors[f.id]?.value ?? f.value
                    const delta = i === 0 ? 0 : val - baseVal
                    return (
                      <td key={sc.id} className="py-2 px-2 text-gray-800 font-medium tabular-nums">
                        {f.isBase ? formatSalary(val, sc.currency) : val.toFixed(2) + '×'}
                        {i > 0 && <DeltaBadge delta={delta} isBase={f.isBase} />}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            <tr className="border-t-2 border-gray-200">
              <td className="py-3 pr-4 font-semibold text-gray-700">{t('scenario.total_row')}</td>
              {scenarios.map((sc, i) => {
                const scFactors = toFactors(factors, sc)
                const salary = calcSalary(scFactors)
                const delta = i === 0 ? 0 : salary - baselineSalary
                return (
                  <td key={sc.id} className="py-3 px-2 font-bold text-brand-600 tabular-nums">
                    {formatSalary(salary, sc.currency)}
                    {i > 0 && <DeltaBadge delta={delta} isBase={true} />}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
