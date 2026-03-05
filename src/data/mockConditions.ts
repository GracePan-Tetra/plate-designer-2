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

const LOAD_CHALLENGES = [5, 20, 30, 80];
const RESIN_NAMES = ['Capto Q', 'Capto S', 'MabSelect PrismA'];
const STARTING_MATERIALS = ['Clarified Lysate', 'CHO Cell Culture', 'Harvested Media'];

export const mockConditions: Condition[] = Array.from({ length: 120 }, (_, i) => ({
  id: `TAKBXXX${String(i + 1).padStart(3, '0')}`,
  load_challenge: LOAD_CHALLENGES[i % LOAD_CHALLENGES.length],
  resin_name: RESIN_NAMES[i % RESIN_NAMES.length],
  starting_material: STARTING_MATERIALS[i % STARTING_MATERIALS.length],
  color: CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length],
}));
