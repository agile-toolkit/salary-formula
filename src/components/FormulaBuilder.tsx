import { useTranslation } from 'react-i18next'
import type { Factor } from '../types'
import { calculateSalary, formatCurrency } from '../utils/salary'

interface Props {
  factors: Factor[]
  currency: string
  onFactorsChange: (factors: Factor[]) => void
}

export default function FormulaBuilder({ factors, currency, onFactorsChange }: Props) {
  const { t } = useTranslation()
  const preview = calculateSalary(factors)

  function patchFactor(id: string, partial: Partial<Factor>) {
    onFactorsChange(factors.map(f => (f.id === id ? { ...f, ...partial } : f)))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('builder.title')}</h1>
        <p className="text-gray-500 text-sm">{t('builder.subtitle')}</p>
      </div>

      <div className="card flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {t('builder.preview')}
          </p>
          <p className="text-2xl font-bold text-brand-600 tabular-nums">
            {formatCurrency(preview, currency)}
          </p>
        </div>
        <p className="text-sm text-gray-500">{t('builder.preview_hint')}</p>
      </div>

      <div className="space-y-4">
        {factors.map(factor => (
          <div key={factor.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h2 className="font-semibold text-gray-900">
                  {t(`factors.${factor.name}.label`)}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {t(factor.descriptionKey)}
                </p>
              </div>
              {factor.isBase && (
                <span className="text-xs font-medium bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">
                  {t('builder.base_badge')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="label text-xs">{t('builder.min')}</label>
                <input
                  type="number"
                  className="input"
                  value={factor.min}
                  onChange={e => patchFactor(factor.id, { min: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="label text-xs">{t('builder.max')}</label>
                <input
                  type="number"
                  className="input"
                  value={factor.max}
                  onChange={e => patchFactor(factor.id, { max: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="label text-xs">{t('builder.step')}</label>
                <input
                  type="number"
                  className="input"
                  step="any"
                  value={factor.step}
                  onChange={e => patchFactor(factor.id, { step: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="label text-xs">{t('builder.current_value')}</label>
                <input
                  type="number"
                  className="input"
                  step={factor.step}
                  min={factor.min}
                  max={factor.max}
                  value={factor.value}
                  onChange={e => patchFactor(factor.id, { value: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">{t('builder.disclaimer')}</p>
    </div>
  )
}
