import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormulaConfig, View } from './types';
import { DEFAULT_FACTORS, DEFAULT_BASE_SALARY, DEFAULT_CURRENCY } from './data/defaultFormula';
import HomeScreen from './components/HomeScreen';
import FormulaBuilder from './components/FormulaBuilder';
import SalaryCalculator from './components/SalaryCalculator';
import ComparisonView from './components/ComparisonView';

const STORAGE_KEY = 'salary-formula-configs';
const CURRENT_KEY = 'salary-formula-current';

function makeEmptyConfig(): FormulaConfig {
  return {
    id: crypto.randomUUID(),
    name: '',
    baseSalary: DEFAULT_BASE_SALARY,
    currency: DEFAULT_CURRENCY,
    factors: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function makeTemplateConfig(): FormulaConfig {
  return {
    id: crypto.randomUUID(),
    name: 'M3.0 Template',
    baseSalary: DEFAULT_BASE_SALARY,
    currency: DEFAULT_CURRENCY,
    factors: DEFAULT_FACTORS.map(f => ({ ...f, id: crypto.randomUUID() })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function loadAll(): FormulaConfig[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveAll(list: FormulaConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function App() {
  const { i18n } = useTranslation();
  const [view, setView] = useState<View>('home');
  const [configs, setConfigs] = useState<FormulaConfig[]>(loadAll);
  const [current, setCurrent] = useState<FormulaConfig>(() => {
    const id = localStorage.getItem(CURRENT_KEY);
    const all = loadAll();
    return all.find(c => c.id === id) ?? makeEmptyConfig();
  });

  useEffect(() => { localStorage.setItem(CURRENT_KEY, current.id); }, [current.id]);

  function updateCurrent(patch: Partial<FormulaConfig>) {
    const updated = { ...current, ...patch, updatedAt: new Date().toISOString() };
    setCurrent(updated);
    setConfigs(prev => {
      const idx = prev.findIndex(c => c.id === updated.id);
      const next = idx >= 0
        ? prev.map(c => c.id === updated.id ? updated : c)
        : [...prev, updated];
      saveAll(next);
      return next;
    });
  }

  function newConfig() { setCurrent(makeEmptyConfig()); setView('builder'); }
  function loadTemplate() { const t = makeTemplateConfig(); setCurrent(t); setView('builder'); }
  function loadConfig(id: string) {
    const found = configs.find(c => c.id === id);
    if (found) { setCurrent(found); setView('builder'); }
  }
  function deleteConfig(id: string) {
    setConfigs(prev => { const n = prev.filter(c => c.id !== id); saveAll(n); return n; });
    if (current.id === id) setCurrent(makeEmptyConfig());
  }

  const navTabs: { key: View; labelKey: string }[] = [
    { key: 'builder', labelKey: 'nav.builder' },
    { key: 'calculator', labelKey: 'nav.calculator' },
    { key: 'comparison', labelKey: 'nav.comparison' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-600 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setView('home')} className="font-bold text-lg tracking-tight hover:opacity-80">
            Salary Formula
          </button>
          <button
            onClick={() => i18n.changeLanguage(i18n.language.startsWith('ru') ? 'en' : 'ru')}
            className="text-sm bg-brand-700 hover:bg-brand-500 px-3 py-1 rounded transition-colors"
          >
            {i18n.language.startsWith('ru') ? 'EN' : 'RU'}
          </button>
        </div>
        {view !== 'home' && (
          <div className="max-w-4xl mx-auto px-4 pb-1 flex gap-1">
            {navTabs.map(tab => (
              <NavBtn key={tab.key} active={view === tab.key} labelKey={tab.labelKey} onClick={() => setView(tab.key)} />
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {view === 'home' && (
          <HomeScreen configs={configs} onNew={newConfig} onTemplate={loadTemplate} onLoad={loadConfig} onDelete={deleteConfig} />
        )}
        {view === 'builder' && (
          <FormulaBuilder config={current} onChange={updateCurrent} onNext={() => setView('calculator')} />
        )}
        {view === 'calculator' && (
          <SalaryCalculator config={current} onChange={updateCurrent} onNext={() => setView('comparison')} />
        )}
        {view === 'comparison' && (
          <ComparisonView config={current} />
        )}
      </main>
    </div>
  );
}

function NavBtn({ active, labelKey, onClick }: { active: boolean; labelKey: string; onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-t transition-colors ${active ? 'bg-white text-brand-700 font-semibold' : 'text-purple-100 hover:text-white hover:bg-brand-500'}`}
    >
      {t(labelKey)}
    </button>
  );
}
