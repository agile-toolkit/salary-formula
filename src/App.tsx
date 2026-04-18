import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Screen, Factor, Profile } from './types'
import { DEFAULT_FACTORS } from './data/presets'
import HomeScreen from './components/HomeScreen'
import SalaryCalculator from './components/SalaryCalculator'
import FormulaBuilder from './components/FormulaBuilder'
import ComparisonView from './components/ComparisonView'
import LearnView from './components/LearnView'

const STORAGE_KEY = 'salary-formula-profiles'

function loadProfiles(): Profile[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveProfiles(profiles: Profile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
}

export default function App() {
  const { t, i18n } = useTranslation()
  const [screen, setScreen] = useState<Screen>('home')
  const [factors, setFactors] = useState<Factor[]>(DEFAULT_FACTORS)
  const [currency, setCurrency] = useState('USD')
  const [profiles, setProfiles] = useState<Profile[]>(loadProfiles)

  const handleSaveProfile = (profile: Profile) => {
    const updated = [...profiles, profile]
    setProfiles(updated)
    saveProfiles(updated)
  }

  const handleDeleteProfile = (id: string) => {
    const updated = profiles.filter(p => p.id !== id)
    setProfiles(updated)
    saveProfiles(updated)
  }

  const handleLoadProfile = (profile: Profile) => {
    setFactors(factors.map(f => ({ ...f, value: profile.factors[f.id] ?? f.value })))
    setScreen('calculator')
  }

  const navItems: { key: Screen; label: string }[] = [
    { key: 'calculator', label: t('nav.calculator') },
    { key: 'builder', label: t('nav.builder') },
    { key: 'comparison', label: t('nav.comparison') },
    { key: 'learn', label: t('nav.learn') },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setScreen('home')}
            className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            {t('app.title')}
          </button>
          <div className="flex items-center gap-1">
            {screen !== 'home' &&
              navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => setScreen(item.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    screen === item.key
                      ? 'bg-brand-100 text-brand-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            <button
              onClick={() => i18n.changeLanguage(i18n.language.startsWith('ru') ? 'en' : 'ru')}
              className="ml-2 text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              {i18n.language.startsWith('ru') ? 'EN' : 'RU'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {screen === 'home' && <HomeScreen onStart={() => setScreen('calculator')} />}
        {screen === 'calculator' && (
          <SalaryCalculator
            factors={factors}
            currency={currency}
            onFactorsChange={setFactors}
            onCurrencyChange={setCurrency}
            onSaveProfile={handleSaveProfile}
          />
        )}
        {screen === 'builder' && (
          <FormulaBuilder factors={factors} currency={currency} onFactorsChange={setFactors} />
        )}
        {screen === 'comparison' && (
          <ComparisonView
            profiles={profiles}
            factors={factors}
            currency={currency}
            onDelete={handleDeleteProfile}
            onLoad={handleLoadProfile}
          />
        )}
        {screen === 'learn' && <LearnView />}
      </main>
    </div>
  )
}
