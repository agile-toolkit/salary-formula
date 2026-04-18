export type Screen = 'home' | 'calculator' | 'builder' | 'comparison' | 'learn'

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
}
