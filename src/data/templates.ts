import type { Factor } from '../types'
import { DEFAULT_FACTORS } from './presets'

export interface FormulaTemplate {
  id: string
  nameKey: string
  descriptionKey: string
  factors: Factor[]
}

function withValues(
  overrides: Record<string, Partial<Pick<Factor, 'value' | 'min' | 'max' | 'step'>>>
): Factor[] {
  return DEFAULT_FACTORS.map(f => ({
    ...f,
    ...(overrides[f.id] ?? {}),
  }))
}

export const FORMULA_TEMPLATES: FormulaTemplate[] = [
  {
    id: 'balanced',
    nameKey: 'templates.balanced.name',
    descriptionKey: 'templates.balanced.desc',
    factors: withValues({}),
  },
  {
    id: 'remote-first',
    nameKey: 'templates.remote_first.name',
    descriptionKey: 'templates.remote_first.desc',
    factors: withValues({
      base:        { value: 90000, min: 30000, max: 250000, step: 1000 },
      seniority:   { value: 1.0,   min: 0.7,  max: 1.6,   step: 0.05 },
      skills:      { value: 1.0,   min: 0.7,  max: 1.4,   step: 0.05 },
      location:    { value: 1.3,   min: 0.7,  max: 1.5,   step: 0.05 },
      performance: { value: 1.0,   min: 0.85, max: 1.2,   step: 0.05 },
    }),
  },
  {
    id: 'startup',
    nameKey: 'templates.startup.name',
    descriptionKey: 'templates.startup.desc',
    factors: withValues({
      base:        { value: 70000, min: 20000, max: 180000, step: 1000 },
      seniority:   { value: 1.0,   min: 0.7,  max: 1.6,    step: 0.05 },
      skills:      { value: 1.1,   min: 0.8,  max: 1.4,    step: 0.05 },
      location:    { value: 1.0,   min: 0.8,  max: 1.3,    step: 0.05 },
      performance: { value: 1.1,   min: 0.85, max: 1.25,   step: 0.05 },
    }),
  },
  {
    id: 'enterprise',
    nameKey: 'templates.enterprise.name',
    descriptionKey: 'templates.enterprise.desc',
    factors: withValues({
      base:        { value: 80000, min: 40000, max: 200000, step: 1000 },
      seniority:   { value: 1.0,   min: 0.8,  max: 1.5,    step: 0.05 },
      skills:      { value: 1.0,   min: 0.9,  max: 1.1,    step: 0.05 },
      location:    { value: 1.0,   min: 0.9,  max: 1.1,    step: 0.05 },
      performance: { value: 1.0,   min: 0.9,  max: 1.1,    step: 0.05 },
    }),
  },
]
