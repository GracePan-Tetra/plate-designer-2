import { PlateFormat, PlateGeometry, WellKey, WellMap, Condition } from '../types';

export const PLATE_GEOMETRIES: Record<PlateFormat, PlateGeometry> = {
  '96': {
    rows: 8,
    cols: 12,
    totalWells: 96,
    rowLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  },
  '384': {
    rows: 16,
    cols: 24,
    totalWells: 384,
    rowLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
  },
  '48': {
    rows: 6,
    cols: 8,
    totalWells: 48,
    rowLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
  },
};

/**
 * Generates the vertical serpentine well order:
 * Odd columns (1, 3, …): top → bottom (A → last row)
 * Even columns (2, 4, …): bottom → top (last row → A)
 */
export function getSerpentineOrder(format: PlateFormat): WellKey[] {
  const { rows, cols, rowLabels } = PLATE_GEOMETRIES[format];
  const order: WellKey[] = [];

  for (let col = 1; col <= cols; col++) {
    if (col % 2 === 1) {
      // Odd column: top → bottom
      for (let row = 0; row < rows; row++) {
        order.push(`${rowLabels[row]}-${col}`);
      }
    } else {
      // Even column: bottom → top
      for (let row = rows - 1; row >= 0; row--) {
        order.push(`${rowLabels[row]}-${col}`);
      }
    }
  }

  return order;
}

/**
 * Auto-fill: assigns one well per selected condition in serpentine order.
 */
export function autoFill(
  format: PlateFormat,
  selectedConditions: Condition[],
): WellMap {
  const order = getSerpentineOrder(format);
  const wellMap: WellMap = {};

  selectedConditions.forEach((condition, idx) => {
    if (idx < order.length) {
      wellMap[order[idx]] = {
        conditionId: condition.id,
        color: condition.color,
      };
    }
  });

  return wellMap;
}
