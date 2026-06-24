import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Factor, Scenario } from '../types'
import { calculateSalary, formatCurrency } from '../utils/salary'
import TemplatesModal from './TemplatesModal'

const PENDING_CHANGE_KEY = 'salary-formula:pendingChangeRecord'
const CHANGE_PLANNER_URL = 'https://agile-toolkit.github.io/change-planner/'
const LAST_REVIEWED_KEY = 'salary-formula:lastReviewed'

function writePendingChangeRecord(name: string, factors: Factor[], currency: string) {
  const factorDeltas: Record<string, string> = {}
  factors
    .filter(f => !f.isBase)
    .forEach(f => {
      const delta = f.value - 1
      factorDeltas[f.id] = (delta >= 0 ? '+' : '') + delta.toFixed(2)
    })
  localStorage.setItem(
    PENDING_CHANGE_KEY,
    JSON.stringify({
      title: `Salary formula updated: ${name}`,
      type: 'formula_revision',
      scenarioName: name,
      factorDeltas,
      currency,
      createdAt: new Date().toISOString(),
    })
  )
}

interface Props {
  factors: Factor[]
  currency: string
  onFactorsChange: (factors: Factor[]) => void
  onSaveScenario: (scenario: Scenario) => void
}

export default function FormulaBuilder({ factors, currency, onFactorsChange, onSaveScenario }: Props) {
  const { t } = useTranslation()
  const [scenarioName, setScenarioName] = useState('')
  const [saved, setSaved] = useState(false)
  const [logChange, setLogChange] = useState(false)
  const [changeLogged, setChangeLogged] = useState(false)
  const [templateApplied, setTemplateApplied] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reviewed, setReviewed] = useState(false)

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleMarkReviewed() {
    localStorage.setItem(LAST_REVIEWED_KEY, new Date().toISOString())
    setReviewed(true)
    setTimeout(() => setReviewed(false), 2000)
  }
  const preview = calculateSalary(factors)

  function handleApplyTemplate(newFactors: Factor[]) {
    onFactorsChange(newFactors)
    setTemplateApplied(true)
    setTimeout(() => setTemplateApplied(false), 2000)
  }

  function patchFactor(id: string, partial: Partial<Factor>) {
    onFactorsChange(factors.map(f => (f.id === id ? { ...f, ...partial } : f)))
  }

  function handleSave() {
    const name = scenarioName.trim()
    if (!name) return
    const factorMap: Scenario['factors'] = {}
    factors.forEach(f => {
      factorMap[f.id] = { value: f.value, min: f.min, max: f.max, step: f.step }
    })
    onSaveScenario({
      id: crypto.randomUUID(),
      name,
      savedAt: new Date().toISOString(),
      factors: factorMap,
      currency,
    })
    if (logChange) {
      writePendingChangeRecord(name, factors, currency)
      setChangeLogged(true)
      setTimeout(() => setChangeLogged(false), 5000)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setScenarioName('')
    setLogChange(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {showTemplates && (
        <TemplatesModal
          currency={currency}
          onApply={handleApplyTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('builder.title')}</h1>
          <p className="text-gray-500 text-sm">{t('builder.subtitle')}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleMarkReviewed}
            className="btn-secondary"
          >
            {reviewed ? t('builder.review_done') : t('builder.mark_reviewed')}
          </button>
          <button
            onClick={handleCopyLink}
            className="btn-secondary"
          >
            {copied ? t('builder.link_copied') : t('builder.copy_link')}
          </button>
          <button
            onClick={() => setShowTemplates(true)}
            className="btn-secondary"
          >
            {templateApplied ? t('builder.template_applied') : t('builder.templates')}
          </button>
        </div>
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

      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3">{t('scenario.save')}</h2>
        <div className="flex gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder={t('scenario.name_placeholder')}
            value={scenarioName}
            onChange={e => setScenarioName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={handleSave}
            disabled={!scenarioName.trim()}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saved ? t('scenario.saved') : t('scenario.save_btn')}
          </button>
        </div>
        <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 rounded accent-brand-600"
            checked={logChange}
            onChange={e => setLogChange(e.target.checked)}
          />
          <span className="text-sm text-gray-600">{t('scenario.log_change')}</span>
        </label>
        <p className="text-xs text-gray-400 mt-2">{t('scenario.save_hint')}</p>
        {changeLogged && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-800">
            <span>{t('scenario.change_logged')}</span>
            <a
              href={CHANGE_PLANNER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline whitespace-nowrap hover:text-green-900"
            >
              {t('scenario.open_change_planner')}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
