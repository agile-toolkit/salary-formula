import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormulaConfig, FormulaFactor } from '../types';
import { v4 as uuid } from '../utils/uuid';

interface Props {
  config: FormulaConfig;
  onChange: (patch: Partial<FormulaConfig>) => void;
  onNext: () => void;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'RUB', 'CHF', 'PLN'];

export default function FormulaBuilder({ config, onChange, onNext }: Props) {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);

  function save() {
    onChange({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addFactor() {
    const f: FormulaFactor = {
      id: uuid(),
      name: '',
      description: '',
      min: 0,
      max: 10,
      step: 1,
      value: 5,
      weight: 1,
      isMultiplier: false,
    };
    onChange({ factors: [...config.factors, f] });
  }

  function updateFactor(id: string, patch: Partial<FormulaFactor>) {
    onChange({ factors: config.factors.map(f => f.id === id ? { ...f, ...patch } : f) });
  }

  function removeFactor(id: string) {
    onChange({ factors: config.factors.filter(f => f.id !== id) });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{t('builder.title')}</h2>

      {/* Base config */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('builder.formulaName')}</label>
            <input
              type="text"
              value={config.name}
              placeholder={t('builder.formulaNamePlaceholder')}
              onChange={e => onChange({ name: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('builder.baseSalary')}</label>
            <input
              type="number"
              value={config.baseSalary}
              min={0}
              step={1000}
              onChange={e => onChange({ baseSalary: Number(e.target.value) })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('builder.currency')}</label>
            <select
              value={config.currency}
              onChange={e => onChange({ currency: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Explainer */}
      <button
        onClick={() => setShowExplainer(v => !v)}
        className="text-sm text-brand-600 hover:text-brand-800 underline"
      >
        {showExplainer ? '▲' : '▼'} {t('builder.explainer')}
      </button>
      {showExplainer && (
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 text-sm text-brand-800">
          {t('builder.explainerText')}
        </div>
      )}

      {/* Factors */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800">{t('builder.factors')}</h3>
          <button
            onClick={addFactor}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            + {t('builder.addFactor')}
          </button>
        </div>
        <div className="space-y-4">
          {config.factors.map((factor, idx) => (
            <FactorCard
              key={factor.id}
              factor={factor}
              index={idx + 1}
              onChange={patch => updateFactor(factor.id, patch)}
              onRemove={() => removeFactor(factor.id)}
              t={t}
            />
          ))}
          {config.factors.length === 0 && (
            <p className="text-slate-400 text-sm italic text-center py-4">
              No factors yet — add one above or load the M3.0 template.
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={save}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          {saved ? t('builder.saved') : t('builder.save')}
        </button>
        <button
          onClick={onNext}
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          {t('common.next')} →
        </button>
      </div>
    </div>
  );
}

function FactorCard({ factor, index, onChange, onRemove, t }: {
  factor: FormulaFactor; index: number;
  onChange: (p: Partial<FormulaFactor>) => void;
  onRemove: () => void;
  t: (k: string) => string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Factor {index}</span>
        <button onClick={onRemove} className="text-slate-300 hover:text-red-400 text-lg leading-none transition-colors">×</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">{t('builder.factorName')}</label>
          <input
            type="text"
            value={factor.name}
            placeholder={t('builder.factorNamePlaceholder')}
            onChange={e => onChange({ name: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">{t('builder.description')}</label>
          <input
            type="text"
            value={factor.description}
            placeholder={t('builder.descriptionPlaceholder')}
            onChange={e => onChange({ description: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['min', 'max', 'step'] as const).map(field => (
            <div key={field}>
              <label className="text-xs font-semibold text-slate-600 mb-1 block capitalize">{t(`builder.${field}`)}</label>
              <input
                type="number"
                value={factor[field]}
                step={0.1}
                onChange={e => onChange({ [field]: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          ))}
        </div>
        <div className="flex items-end gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">{t('builder.weight')}</label>
            <input
              type="number"
              value={factor.weight}
              min={0.1}
              step={0.1}
              onChange={e => onChange({ weight: Number(e.target.value) })}
              className="w-24 border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div className="flex gap-3 pb-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                checked={!factor.isMultiplier}
                onChange={() => onChange({ isMultiplier: false })}
                className="accent-brand-600"
              />
              <span className="text-sm text-slate-600">{t('builder.isAdditive')}</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                checked={factor.isMultiplier}
                onChange={() => onChange({ isMultiplier: true })}
                className="accent-brand-600"
              />
              <span className="text-sm text-slate-600">{t('builder.isMultiplier')}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
