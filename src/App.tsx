import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { Screen, Factor, FormulaConfig, Profile, Scenario } from './types'
import { DEFAULT_FACTORS } from './data/presets'
import AppHeader from './components/AppHeader'
import ThemeToggle from './components/ThemeToggle'
import HomeScreen from './components/HomeScreen'
import SalaryCalculator from './components/SalaryCalculator'
import FormulaBuilder from './components/FormulaBuilder'
import ComparisonView from './components/ComparisonView'
import ScenarioView from './components/ScenarioView'
import LearnView from './components/LearnView'
import EquityView from './components/EquityView'
import { encodeFormula, decodeFormulaHash } from './utils/formulaUrl'

function loadFromHash(): { factors: Factor[]; currency: string } | null {
  return decodeFormulaHash(window.location.hash)
}

const STORAGE_KEY = 'salary-formula-profiles'
const SCENARIOS_KEY = 'salary_scenarios_v1'
const LAST_SESSION_KEY = 'salary-formula:lastSession'
const TEAM_HOURLY_RATE_KEY = 'salary-formula:teamHourlyRate'

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

function writeTeamHourlyRate(profiles: Profile[], currency: string, factors: Factor[]) {
  if (profiles.length === 0) {
    localStorage.removeItem(TEAM_HOURLY_RATE_KEY)
    return
  }
  const totalAnnual = profiles.reduce((sum, p) => {
    const base = p.factors['base'] ?? factors.find(f => f.isBase)?.value ?? 0
    const multiplier = factors
      .filter(f => !f.isBase)
      .reduce((acc, f) => acc * (p.factors[f.id] ?? f.value), 1)
    return sum + Math.round(base * multiplier)
  }, 0)
  localStorage.setItem(
    TEAM_HOURLY_RATE_KEY,
    JSON.stringify({
      totalAnnual,
      currency,
      profileCount: profiles.length,
      hourlyRate: Math.round(totalAnnual / 52 / 40),
      updatedAt: new Date().toISOString(),
    })
  )
}

function writeLastSession(
  profiles: Profile[],
  scenarios: Scenario[],
  currency: string,
  factors: Factor[]
) {
  const salaries = profiles.map(p => {
    const base = p.factors['base'] ?? factors.find(f => f.isBase)?.value ?? 0
    const multiplier = factors
      .filter(f => !f.isBase)
      .reduce((acc, f) => acc * (p.factors[f.id] ?? f.value), 1)
    return Math.round(base * multiplier)
  })
  const lastScenario = scenarios.length > 0 ? scenarios[scenarios.length - 1].name : null
  localStorage.setItem(
    LAST_SESSION_KEY,
    JSON.stringify({
      lastScenario,
      profileCount: profiles.length,
      totalSalaryRange:
        salaries.length > 0
          ? { min: Math.min(...salaries), max: Math.max(...salaries), currency }
          : null,
      updatedAt: new Date().toISOString(),
    })
  )
}

export default function App() {
  const { t } = useTranslation()
  const [screen, setScreen] = useState<Screen>('home')
  const fromHash = loadFromHash()
  const [factors, setFactors] = useState<Factor[]>(fromHash?.factors ?? DEFAULT_FACTORS)
  const [currency, setCurrency] = useState(fromHash?.currency ?? 'USD')

  useEffect(() => {
    const config: FormulaConfig = { factors, currency }
    history.replaceState(null, '', `#formula=${encodeFormula(config)}`)
  }, [factors, currency])
  const [profiles, setProfiles] = useState<Profile[]>(loadProfiles)
  const [scenarios, setScenarios] = useState<Scenario[]>(loadScenarios)

  const handleSaveProfile = (profile: Profile) => {
    const updated = [...profiles, profile]
    setProfiles(updated)
    saveProfiles(updated)
    writeLastSession(updated, scenarios, currency, factors)
    writeTeamHourlyRate(updated, currency, factors)
  }

  const handleDeleteProfile = (id: string) => {
    const updated = profiles.filter(p => p.id !== id)
    setProfiles(updated)
    saveProfiles(updated)
    writeTeamHourlyRate(updated, currency, factors)
  }

  const handleLoadProfile = (profile: Profile) => {
    setFactors(factors.map(f => ({ ...f, value: profile.factors[f.id] ?? f.value })))
    setScreen('calculator')
  }

  const handleSaveScenario = (scenario: Scenario) => {
    const updated = [...scenarios, scenario]
    setScenarios(updated)
    saveScenarios(updated)
    writeLastSession(profiles, updated, currency, factors)
  }

  const handleDeleteScenario = (id: string) => {
    const updated = scenarios.filter(s => s.id !== id)
    setScenarios(updated)
    saveScenarios(updated)
  }

  const navItems = screen !== 'home'
    ? [
        { key: 'calculator', label: t('nav.calculator'), active: screen === 'calculator', onClick: () => setScreen('calculator') },
        { key: 'builder', label: t('nav.builder'), active: screen === 'builder', onClick: () => setScreen('builder') },
        { key: 'comparison', label: t('nav.comparison'), active: screen === 'comparison', onClick: () => setScreen('comparison') },
        { key: 'scenarios', label: t('nav.scenarios'), active: screen === 'scenarios', onClick: () => setScreen('scenarios') },
        { key: 'equity', label: t('nav.equity'), active: screen === 'equity', onClick: () => setScreen('equity') },
        { key: 'learn', label: t('nav.learn'), active: screen === 'learn', onClick: () => setScreen('learn') },
      ]
    : []

  return (
    <div className="min-h-screen flex flex-col" data-accent="cobalt">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        {t('app.skip_to_content')}
      </a>
      <AppHeader
        title={t('app.title')}
        onTitleClick={() => setScreen('home')}
        navItems={navItems}
      ><ThemeToggle /></AppHeader>

      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
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
        {screen === 'equity' && (
          <EquityView profiles={profiles} factors={factors} currency={currency} />
        )}
        {screen === 'learn' && <LearnView />}
      </main>
    </div>
  )
}
