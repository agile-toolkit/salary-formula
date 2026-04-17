import { useTranslation } from 'react-i18next';
import type { FormulaConfig, FormulaFactor } from '../types';
import { calculateSalary, formatCurrency } from '../utils/salary';

interface Props {
  config: FormulaConfig;
  onChange: (patch: Partial<FormulaConfig>) => void;
  onNext: () => void;
}

export default function SalaryCalculator({ config, onChange, onNext }: Props) {
  const { t, i18n } = useTranslation();

  if (config.factors.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">{t('calculator.noFormula')}</p>
      </div>
    );
  }

  const salary = calculateSalary(config.baseSalary, config.factors);
  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : undefined;

  function updateValue(id: string, value: number) {
    onChange({
      factors: config.factors.map(f => f.id === id ? { ...f, value } : f),
    });
  }

  const additive = config.factors.filter(f => !f.isMultiplier);
  const multipliers = config.factors.filter(f => f.isMultiplier);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{t('calculator.title')}</h2>

      {/* Result banner */}
      <div className="bg-brand-600 text-white rounded-2xl p-6 text-center shadow-lg">
        <p className="text-sm opacity-80 mb-1">{t('calculator.result')}</p>
        <p className="text-5xl font-bold tracking-tight">
          {formatCurrency(salary, config.currency, locale)}
        </p>
        <p className="text-xs opacity-60 mt-2">{t('calculator.formula')}</p>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        {additive.length > 0 && (
          <FactorGroup
            label="Additive factors"
            factors={additive}
            currency={config.currency}
            locale={locale}
            onUpdate={updateValue}
            t={t}
          />
        )}
        {multipliers.length > 0 && (
          <FactorGroup
            label="Multiplier factors"
            factors={multipliers}
            currency={config.currency}
            locale={locale}
            onUpdate={updateValue}
            t={t}
          />
        )}
      </div>

      {/* Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">{t('calculator.breakdown')}</h3>
        <div className="space-y-1 text-sm">
          <Row label="Base salary" value={formatCurrency(config.baseSalary, config.currency, locale)} />
          {additive.map(f => (
            <Row key={f.id} label={`${f.name} (${f.value}/${f.max})`} value={`+${formatCurrency(Math.round(config.baseSalary * (f.value * f.weight / (config.factors.filter(x => !x.isMultiplier).reduce((s, x) => s + x.max * x.weight, 0) || 1))), config.currency, locale)}`} />
          ))}
          {multipliers.map(f => (
            <Row key={f.id} label={`${f.name}`} value={`× ${f.value}`} highlight />
          ))}
          <div className="border-t border-slate-200 pt-2 mt-2">
            <Row label="Total" value={formatCurrency(salary, config.currency, locale)} bold />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
        >
          {t('common.next')} →
        </button>
      </div>
    </div>
  );
}

function FactorGroup({ label, factors, currency, locale, onUpdate, t }: {
  label: string; factors: FormulaFactor[]; currency: string; locale?: string;
  onUpdate: (id: string, v: number) => void; t: (k: string) => string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">{label}</h3>
      <div className="space-y-4">
        {factors.map(f => (
          <div key={f.id}>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-sm font-semibold text-slate-700">{f.name}</label>
              <span className="text-sm font-bold text-brand-600">
                {f.isMultiplier ? `× ${f.value}` : f.value}
              </span>
            </div>
            {f.description && (
              <p className="text-xs text-slate-400 mb-2">{f.description}</p>
            )}
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={f.value}
              onChange={e => onUpdate(f.id, Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>{f.min}</span>
              <span>{f.max}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
      <span>{label}</span>
      <span className={highlight ? 'text-amber-600' : ''}>{value}</span>
    </div>
  );
}
