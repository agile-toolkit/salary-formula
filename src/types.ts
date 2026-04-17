export interface FormulaFactor {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
  step: number;
  value: number;
  weight: number;
  isMultiplier: boolean;
}

export interface FormulaConfig {
  id: string;
  name: string;
  baseSalary: number;
  currency: string;
  factors: FormulaFactor[];
  createdAt: string;
  updatedAt: string;
}

export type View = 'home' | 'builder' | 'calculator' | 'comparison';
