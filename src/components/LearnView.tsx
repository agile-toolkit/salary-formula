import { useTranslation } from 'react-i18next'

const FACTOR_IDS = ['base', 'seniority', 'skills', 'location', 'performance']

export default function LearnView() {
  const { t } = useTranslation()

  const pitfalls = [
    t('learn.pitfall1'),
    t('learn.pitfall2'),
    t('learn.pitfall3'),
    t('learn.pitfall4'),
  ]

  const principles = [
    { title: t('learn.p1_title'), body: t('learn.p1_body') },
    { title: t('learn.p2_title'), body: t('learn.p2_body') },
    { title: t('learn.p3_title'), body: t('learn.p3_body') },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('learn.title')}</h1>

      <div className="card">
        <p className="text-gray-600 text-sm leading-relaxed">{t('learn.intro')}</p>
      </div>

      {/* Formula visual */}
      <div className="card bg-gray-900 text-white border-0">
        <div className="text-center font-mono text-sm md:text-base leading-loose">
          <span className="text-green-400">Salary</span>
          <span className="text-gray-400"> = </span>
          <span className="text-yellow-300">Base</span>
          <span className="text-gray-400"> × </span>
          <span className="text-blue-300">Seniority</span>
          <span className="text-gray-400"> × </span>
          <span className="text-purple-300">Skills</span>
          <span className="text-gray-400"> × </span>
          <span className="text-pink-300">Location</span>
          <span className="text-gray-400"> × </span>
          <span className="text-orange-300">Performance</span>
        </div>
      </div>

      {/* Principles */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">{t('learn.principles_title')}</h2>
        <div className="space-y-4">
          {principles.map((p, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-semibold text-xs">
                {i + 1}
              </div>
              <div>
                <div className="font-medium text-gray-800 text-sm mb-0.5">{p.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{p.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Factor guide */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">{t('learn.factors_title')}</h2>
        <div className="space-y-4">
          {FACTOR_IDS.map(id => (
            <div key={id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
              <div className="font-medium text-gray-800 text-sm mb-1">
                {t(`factors.${id}.label`)}
              </div>
              <div className="text-xs text-gray-500 leading-relaxed">
                {t(`factors.${id}.desc`)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pitfalls */}
      <div className="card border-orange-100 bg-orange-50">
        <h2 className="font-semibold text-orange-900 mb-3">{t('learn.pitfalls_title')}</h2>
        <ul className="space-y-2">
          {pitfalls.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-orange-800">
              <span className="flex-shrink-0">⚠️</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
