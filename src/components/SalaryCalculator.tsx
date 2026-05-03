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

interface WpSkill {
  id: string
  name: string
  proficiency: number
}

interface WpProfile {
  id: string
  name: string
  skills: WpSkill[]
}

function readWpProfiles(): WpProfile[] {
  try {
    const data = JSON.parse(localStorage.getItem('wp-profiles-export') ?? 'null')
    return Array.isArray(data?.profiles) ? data.profiles : []
  } catch {
    return []
  }
}

function proficiencyToSkillsMultiplier(avgProficiency: number, min: number, max: number): number {
  const clamped = Math.max(1, Math.min(5, avgProficiency))
  const raw = min + ((clamped - 1) / 4) * (max - min)
  return Math.round(raw / 0.05) * 0.05
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
  const [wpLinked, setWpLinked] = useState<{ id: string; name: string } | null>(null)
  const [wpPickerProfiles, setWpPickerProfiles] = useState<WpProfile[]>([])
  const [showWpPicker, setShowWpPicker] = useState(false)
  const [wpNoData, setWpNoData] = useState(false)

  const salary = calcSalary(factors)
  const base = factors.find(f => f.isBase)?.value ?? 0
  const multiplierStr = factors
    .filter(f => !f.isBase)
    .map(f => f.value.toFixed(2) + '×')
    .join(' × ')

  const handleChange = (id: string, value: number) => {
    if (id === 'skills' && wpLinked) setWpLinked(null)
    onFactorsChange(factors.map(f => (f.id === id ? { ...f, value } : f)))
  }

  const handleReset = () => {
    onFactorsChange(DEFAULT_FACTORS)
    setProfileName('')
    setSaved(false)
    setWpLinked(null)
    setShowWpPicker(false)
    setWpNoData(false)
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

  const linkWpProfile = (profile: WpProfile) => {
    const skillsFactor = factors.find(f => f.id === 'skills')
    const min = skillsFactor?.min ?? 0.7
    const max = skillsFactor?.max ?? 1.4
    const avgProficiency =
      profile.skills.length > 0
        ? profile.skills.reduce((sum, s) => sum + s.proficiency, 0) / profile.skills.length
        : 3
    const multiplier = proficiencyToSkillsMultiplier(avgProficiency, min, max)
    onFactorsChange(factors.map(f => (f.id === 'skills' ? { ...f, value: multiplier } : f)))
    setWpLinked({ id: profile.id, name: profile.name })
    setShowWpPicker(false)
    setWpNoData(false)
  }

  const handleImportWp = () => {
    const profiles = readWpProfiles()
    setWpNoData(false)
    if (profiles.length === 0) {
      setWpNoData(true)
    } else if (profiles.length === 1) {
      linkWpProfile(profiles[0])
    } else {
      setWpPickerProfiles(profiles)
      setShowWpPicker(true)
    }
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
          <div key={f.id}>
            <FactorSlider factor={f} onChange={handleChange} />
            {f.id === 'skills' && (
              <div className="pb-3 -mt-1">
                {wpLinked ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                      {t('calculator.wp_linked', { name: wpLinked.name })}
                    </span>
                    <button
                      onClick={() => setWpLinked(null)}
                      className="text-xs text-gray-400 hover:text-gray-600 underline"
                    >
                      {t('calculator.wp_unlink')}
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={handleImportWp}
                      className="text-xs text-brand-600 hover:text-brand-700 underline"
                    >
                      {t('calculator.wp_import')}
                    </button>
                    {wpNoData && (
                      <span className="ml-2 text-xs text-gray-400">
                        {t('calculator.wp_no_data')}
                      </span>
                    )}
                  </div>
                )}
                {showWpPicker && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {wpPickerProfiles.map(p => (
                      <button
                        key={p.id}
                        onClick={() => linkWpProfile(p)}
                        className="text-xs px-2 py-1 border border-brand-300 text-brand-700 rounded hover:bg-brand-50 transition-colors"
                      >
                        {p.name}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowWpPicker(false)}
                      className="text-xs px-2 py-1 text-gray-400 hover:text-gray-600"
                    >
                      {t('calculator.wp_cancel')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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
