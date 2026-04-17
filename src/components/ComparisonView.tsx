import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormulaConfig, FormulaFactor } from '../types';
import { calculateSalary, formatCurrency } from '../utils/salary';
import { v4 as uuid } from '../utils/uuid';

interface Person {
  id: string;
  name: string;
  factors: FormulaFactor[];
}

interface Props {
  config: FormulaConfig;
}

export default function ComparisonView({ config }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : undefined;

  const [persons, setPersons] = useState<Person[]>([]);
  const [newName, setNewName] = useState('');

  function addPerson() {
    if (!newName.trim()) return;
    setPersons(prev => [...prev, {
      id: uuid(),
      name: newName.trim(),
      factors: config.factors.map(f => ({ ...f, id: uuid() })),
    }]);
    setNewName('');
  }

  function updatePersonFactor(personId: string, factorId: string, value: number) {
    setPersons(prev => prev.map(p =>
      p.id === personId
        ? { ...p, factors: p.factors.map(f => f.id === factorId ? { ...f, value } : f) }
        : p
    ));
  }

  function removePerson(id: string) {
    setPersons(prev => prev.filter(p => p.id !== id));
  }

  function exportCSV() {
    const headers = ['Name', ...config.factors.map(f => f.name), 'Salary'];
    const rows = persons.map(p => [
      p.name,
      ...p.factors.map(f => String(f.value)),
      String(calculateSalary(config.baseSalary, p.factors)),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'salary-comparison.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const maxSalary = persons.length
    ? Math.max(...persons.map(p => calculateSalary(config.baseSalary, p.factors)))
    : 1;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{t('comparison.title')}</h2>
        {persons.length > 0 && (
          <button
            onClick={exportCSV}
            className="text-sm text-brand-600 hover:text-brand-800 border border-brand-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            {t('comparison.export')}
          </button>
        )}
      </div>

      {/* Add person */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          placeholder={t('comparison.namePlaceholder')}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addPerson()}
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <button
          onClick={addPerson}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + {t('comparison.addPerson')}
        </button>
      </div>

      {persons.length === 0 ? (
        <p className="text-slate-400 text-sm italic">{t('comparison.noPersons')}</p>
      ) : (
        <div className="space-y-4">
          {persons.map(person => {
            const salary = calculateSalary(config.baseSalary, person.factors);
            const pct = Math.round((salary / maxSalary) * 100);
            return (
              <div key={person.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">{person.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-brand-600">
                      {formatCurrency(salary, config.currency, locale)}
                    </span>
                    <button onClick={() => removePerson(person.id)} className="text-slate-300 hover:text-red-400 text-lg transition-colors">×</button>
                  </div>
                </div>
                <div className="bg-slate-100 rounded-full h-2 mb-3">
                  <div
                    className="h-2 bg-brand-500 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {person.factors.map(f => (
                    <div key={f.id} className="text-xs">
                      <div className="flex justify-between text-slate-500 mb-0.5">
                        <span className="truncate">{f.name}</span>
                        <span className="font-medium text-slate-700 ml-1">{f.value}</span>
                      </div>
                      <input
                        type="range"
                        min={f.min} max={f.max} step={f.step} value={f.value}
                        onChange={e => updatePersonFactor(person.id, f.id, Number(e.target.value))}
                        className="w-full h-1.5 rounded cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
