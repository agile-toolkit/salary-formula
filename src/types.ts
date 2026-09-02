export type Screen = 'home' | 'calculator' | 'builder' | 'comparison' | 'scenarios' | 'learn' | 'equity'

export interface Factor {
  id: string
  name: string
  value: number
  min: number
  max: number
  step: number
  descriptionKey: string
  isBase?: boolean
}

export interface FormulaConfig {
  factors: Factor[]
  currency: string
}

export interface Profile {
  id: string
  name: string
  factors: Record<string, number>
  /** Currency the profile was saved under. Optional for backward
   *  compatibility with profiles saved before this field existed —
   *  callers should fall back to the current global currency selector. */
  currency?: string
}

export interface ScenarioFactor {
  value: number
  min: number
  max: number
  step: number
}

export interface Scenario {
  id: string
  name: string
  savedAt: string
  factors: Record<string, ScenarioFactor>
  currency: string
}
