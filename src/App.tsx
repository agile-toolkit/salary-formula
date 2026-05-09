import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Screen, Factor, Profile, Scenario } from './types'
import { DEFAULT_FACTORS } from './data/presets'
import HomeScreen from './components/HomeScreen'
import SalaryCalculator from './components/SalaryCalculator'
import FormulaBuilder from './components/FormulaBuilder'
import ComparisonView from './components/ComparisonView'
import ScenarioView from './components/ScenarioView'
import LearnView from './components/LearnView'

const STORAGE_KEY = 'salary-formula-profiles'
const SCENARIOS_KEY = 'salary_scenarios_v1'

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

function loadScenarios(): Scenario[] {
  try {
    return JSON.parse(localStorage.getItem(SCENARIOS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveScenarios(scenarios: Scenario[]) {
  localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios))
}

export default function App() {
  const { t, i18n } = useTranslation()
  const [screen, setScreen] = useState<Screen>('home')
  const [factors, setFactors] = useState<Factor[]>(DEFAULT_FACTORS)
  const [currency, setCurrency] = useState('USD')
  const [profiles, setProfiles] = useState<Profile[]>(loadProfiles)
  const [scenarios, setScenarios] = useState<Scenario[]>(loadScenarios)

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

  const handleSaveScenario = (scenario: Scenario) => {
    const updated = [...scenarios, scenario]
    setScenarios(updated)
    saveScenarios(updated)
  }

  const handleDeleteScenario = (id: string) => {
    const updated = scenarios.filter(s => s.id !== id)
    setScenarios(updated)
    saveScenarios(updated)
  }

  const navItems: { key: Screen; label: string }[] = [
    { key: 'calculator', label: t('nav.calculator') },
    { key: 'builder', label: t('nav.builder') },
    { key: 'comparison', label: t('nav.comparison') },
    { key: 'scenarios', label: t('nav.scenarios') },
    { key: 'learn', label: t('nav.learn') },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a
              href="https://agile-toolkit.github.io/"
              title="Agile Toolkit"
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" rx="1"/>
                <rect x="9" y="1" width="6" height="6" rx="1"/>
                <rect x="1" y="9" width="6" height="6" rx="1"/>
                <rect x="9" y="9" width="6" height="6" rx="1"/>
              </svg>
            </a>
            <button
              onClick={() => setScreen('home')}
              className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              {t('app.title')}
            </button>
          </div>
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
              onClick={() => {
                const langs = ['en', 'es', 'be', 'ru']
                const current = langs.find(l => i18n.language.startsWith(l)) ?? 'en'
                i18n.changeLanguage(langs[(langs.indexOf(current) + 1) % langs.length])
              }}
              className="ml-2 text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              {(() => {
                const langs = ['en', 'es', 'be', 'ru']
                const current = langs.find(l => i18n.language.startsWith(l)) ?? 'en'
                return langs[(langs.indexOf(current) + 1) % langs.length].toUpperCase()
              })()}
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
          <FormulaBuilder
            factors={factors}
            currency={currency}
            onFactorsChange={setFactors}
            onSaveScenario={handleSaveScenario}
          />
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
        {screen === 'scenarios' && (
          <ScenarioView
            scenarios={scenarios}
            factors={factors}
            onDelete={handleDeleteScenario}
          />
        )}
        {screen === 'learn' && <LearnView />}
      </main>
    </div>
  )
}
