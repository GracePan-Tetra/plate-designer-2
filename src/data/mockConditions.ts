import { Condition } from '../types';

export const CATEGORICAL_COLORS = [
  '#6366F1',
  '#A78BFA',
  '#EF4444',
  '#EAB308',
  '#10B981',
  '#F97316',
  '#06B6D4',
  '#EC4899',
];

const FACTOR1_VALUES = ['Control', 'Vehicle', 'Inhibitor', 'Activator', 'Positive', 'Cytokine'];

export const mockConditions: Condition[] = Array.from({ length: 120 }, (_, i) => ({
  id: `TAKBXXX${String(i + 1).padStart(3, '0')}`,
  factor1: FACTOR1_VALUES[i % FACTOR1_VALUES.length],
  factor2: 'Ibuprofen',
  factor3: '10mg',
  factor4: 'pH 7',
  color: CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length],
}));
