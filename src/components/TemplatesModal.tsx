import { useTranslation } from 'react-i18next'
import type { Factor } from '../types'
import { FORMULA_TEMPLATES } from '../data/templates'
import { calculateSalary, formatCurrency } from '../utils/salary'

interface Props {
  currency: string
  onApply: (factors: Factor[]) => void
  onClose: () => void
}

export default function TemplatesModal({ currency, onApply, onClose }: Props) {
  const { t } = useTranslation()

  function handleApply(factors: Factor[]) {
    onApply(factors)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">{t('builder.templates')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          {FORMULA_TEMPLATES.map(tpl => {
            const preview = calculateSalary(tpl.factors)
            const multiplierFactors = tpl.factors.filter(f => !f.isBase)
            return (
              <div key={tpl.id} className="card border border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">{t(tpl.nameKey)}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t(tpl.descriptionKey)}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {multiplierFactors.map(f => (
                        <span
                          key={f.id}
                          className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full"
                        >
                          {t(`factors.${f.name}.label`)}: {f.min}×–{f.max}×
                        </span>
                      ))}
                    </div>

                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
                      {t('builder.template_preview')}: {formatCurrency(preview, currency)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleApply(tpl.factors)}
                    className="btn-primary shrink-0"
                  >
                    {t('builder.template_use')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-6 pb-5 text-xs text-gray-400 dark:text-gray-600">
          {t('builder.template_hint')}
        </div>
      </div>
    </div>
  )
}
