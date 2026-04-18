import type { FormulaFactor } from '../types';
import { v4 as uuid } from '../utils/uuid';

export const DEFAULT_FACTORS: FormulaFactor[] = [
  {
    id: uuid(),
    name: 'Seniority',
    description: 'Years of relevant professional experience (0–20+)',
    min: 0,
    max: 20,
    step: 1,
    value: 5,
    weight: 1,
    isMultiplier: false,
  },
  {
    id: uuid(),
    name: 'Skill Score',
    description: 'Self-assessed skill level on a 1–10 scale (Dreyfus model)',
    min: 1,
    max: 10,
    step: 1,
    value: 6,
    weight: 1,
    isMultiplier: false,
  },
  {
    id: uuid(),
    name: 'Location Coefficient',
    description: 'Cost-of-living multiplier for the team member\'s location (0.5–2.0)',
    min: 0.5,
    max: 2.0,
    step: 0.1,
    value: 1.0,
    weight: 1,
    isMultiplier: true,
  },
  {
    id: uuid(),
    name: 'Performance Factor',
    description: 'Team-assessed performance modifier (0.8 = needs improvement, 1.2 = exceptional)',
    min: 0.8,
    max: 1.2,
    step: 0.05,
    value: 1.0,
    weight: 1,
    isMultiplier: true,
  },
];

export const DEFAULT_BASE_SALARY = 50000;
export const DEFAULT_CURRENCY = 'USD';
