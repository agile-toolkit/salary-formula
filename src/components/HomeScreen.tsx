import { useTranslation } from 'react-i18next';
import type { FormulaConfig } from '../types';

interface Props {
  configs: FormulaConfig[];
  onNew: () => void;
  onTemplate: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HomeScreen({ configs, onNew, onTemplate, onLoad, onDelete }: Props) {
  const { t } = useTranslation();
  const antipatterns: string[] = t('home.antipatternsList', { returnObjects: true }) as string[];

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <div className="text-5xl mb-4">💰</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">{t('home.headline')}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">{t('home.intro')}</p>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <button onClick={onNew} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors shadow-sm">
            {t('home.newFormula')}
          </button>
          <button onClick={onTemplate} className="bg-white hover:bg-slate-50 text-brand-700 border-2 border-brand-300 px-6 py-3 rounded-lg font-semibold text-lg transition-colors">
            {t('home.template')}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-semibold text-slate-800 mb-3">{t('home.why')}</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{t('home.whyText')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-semibold text-slate-800 mb-3">{t('home.antipatterns')}</h2>
          <ul className="space-y-1">
            {antipatterns.map((p, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">⚠</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {configs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">{t('home.loadFormula')}</h2>
          <div className="space-y-2">
            {configs.map(cfg => (
              <div key={cfg.id} className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm">
                <div>
                  <span className="font-medium text-slate-800">{cfg.name || <span className="italic text-slate-400">(untitled)</span>}</span>
                  <span className="text-slate-400 text-xs ml-3">{new Date(cfg.updatedAt).toLocaleDateString()}</span>
                  <span className="text-slate-400 text-xs ml-2">· {cfg.factors.length} factors</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onLoad(cfg.id)} className="text-brand-600 hover:text-brand-800 text-sm font-medium px-3 py-1 rounded hover:bg-brand-50 transition-colors">
                    {t('home.continue')}
                  </button>
                  <button onClick={() => onDelete(cfg.id)} className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors">
                    {t('home.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
