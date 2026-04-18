import { useTranslation } from 'react-i18next'
import type { Factor } from '../types'
import { SENIORITY_LABELS, PERFORMANCE_LABELS } from '../data/presets'

interface Props {
  factor: Factor
  onChange: (id: string, value: number) => void
}

function getLabel(factor: Factor, value: number): string {
  if (factor.id === 'seniority') {
    const rounded = Math.round(value * 20) / 20
    return SENIORITY_LABELS[rounded] ?? ''
  }
  if (factor.id === 'performance') {
    const rounded = Math.round(value * 20) / 20
    return PERFORMANCE_LABELS[rounded] ?? ''
  }
  return ''
}

export default function FactorSlider({ factor, onChange }: Props) {
  const { t } = useTranslation()

  const label = getLabel(factor, factor.value)
  const isBase = factor.isBase

  const formatValue = (v: number) => {
    if (isBase) {
      return v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
    }
    return v.toFixed(2) + '×'
  }

  const pct = ((factor.value - factor.min) / (factor.max - factor.min)) * 100

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-medium text-gray-800 text-sm">
            {t(`factors.${factor.id}.label`)}
          </span>
          {label && (
            <span className="ml-2 text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full">
              {label}
            </span>
          )}
        </div>
        <span className="text-lg font-semibold text-brand-600 tabular-nums min-w-[5rem] text-right">
          {formatValue(factor.value)}
        </span>
      </div>

      <div className="relative mb-1">
        <input
          type="range"
          min={factor.min}
          max={factor.max}
          step={factor.step}
          value={factor.value}
          onChange={e => onChange(factor.id, parseFloat(e.target.value))}
          className="w-full h-2 appearance-none bg-gray-200 rounded-full cursor-pointer accent-brand-600"
          style={{
            background: `linear-gradient(to right, #2563eb ${pct}%, #e5e7eb ${pct}%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatValue(factor.min)}</span>
        <span>{formatValue(factor.max)}</span>
      </div>

      <p className="mt-1.5 text-xs text-gray-500">{t(`factors.${factor.id}.desc`)}</p>
    </div>
  )
}
