import { useTranslation } from 'react-i18next'

interface Props {
  onStart: () => void
}

export default function HomeScreen({ onStart }: Props) {
  const { t } = useTranslation()

  const steps = [
    t('home.step1'),
    t('home.step2'),
    t('home.step3'),
    t('home.step4'),
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-2xl mb-6">
          <span className="text-3xl font-bold text-brand-600">$</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('home.headline')}</h1>
        <p className="text-lg text-gray-500 mb-8">{t('home.subheadline')}</p>
        <button onClick={onStart} className="btn-primary text-base px-8 py-3">
          {t('home.cta')}
        </button>
      </div>

      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 mb-2">{t('home.why_title')}</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{t('home.why_body')}</p>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">{t('home.how_title')}</h2>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-600">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-semibold text-xs">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
