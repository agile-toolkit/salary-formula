import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Factor, Profile } from '../types'
import { calcSalary, formatSalary, DEFAULT_FACTORS, CURRENCIES } from '../data/presets'
import FactorSlider from './FactorSlider'

interface Props {
  factors: Factor[]
  currency: string
  onFactorsChange: (factors: Factor[]) => void
  onCurrencyChange: (c: string) => void
  onSaveProfile: (profile: Profile) => void
}

export default function SalaryCalculator({
  factors,
  currency,
  onFactorsChange,
  onCurrencyChange,
  onSaveProfile,
}: Props) {
  const { t } = useTranslation()
  const [profileName, setProfileName] = useState('')
  const [saved, setSaved] = useState(false)

  const salary = calcSalary(factors)
  const base = factors.find(f => f.isBase)?.value ?? 0
  const multiplierStr = factors
    .filter(f => !f.isBase)
    .map(f => f.value.toFixed(2) + '×')
    .join(' × ')

  const handleChange = (id: string, value: number) => {
    onFactorsChange(factors.map(f => (f.id === id ? { ...f, value } : f)))
  }

  const handleReset = () => {
    onFactorsChange(DEFAULT_FACTORS)
    setProfileName('')
    setSaved(false)
  }

  const handleSave = () => {
    if (!profileName.trim()) return
    const factorMap: Record<string, number> = {}
    factors.forEach(f => (factorMap[f.id] = f.value))
    onSaveProfile({
      id: crypto.randomUUID(),
      name: profileName.trim(),
      factors: factorMap,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setProfileName('')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('calculator.title')}</h1>

      {/* Result */}
      <div className="card bg-brand-600 border-0 mb-6 text-white">
        <div className="text-sm opacity-80 mb-1">{t('calculator.result_label')}</div>
        <div className="text-5xl font-bold tabular-nums mb-2">
          {formatSalary(salary, currency)}
        </div>
        <div className="text-xs opacity-70">
          <span className="font-medium">{t('calculator.formula_label')}:</span>{' '}
          {formatSalary(base, currency)} × {multiplierStr}
        </div>
      </div>

      {/* Currency selector */}
      <div className="card mb-4">
        <label className="label">{t('calculator.currency_label')}</label>
        <div className="flex gap-2">
          {CURRENCIES.map(c => (
            <button
              key={c}
              onClick={() => onCurrencyChange(c)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                currency === c
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="card mb-4">
        {factors.map(f => (
          <FactorSlider key={f.id} factor={f} onChange={handleChange} />
        ))}
      </div>

      {/* Save profile */}
      <div className="card mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            className="input flex-1"
            placeholder={t('calculator.profile_name_placeholder')}
            value={profileName}
            onChange={e => setProfileName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={handleSave}
            disabled={!profileName.trim()}
            className="btn-primary whitespace-nowrap"
          >
            {saved ? t('calculator.saved') : t('calculator.save')}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleReset} className="btn-ghost">
          {t('calculator.reset')}
        </button>
      </div>
    </div>
  )
}
