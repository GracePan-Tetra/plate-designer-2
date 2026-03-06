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
      for (let row = 0; row < rows; row++) order.push(`${rowLabels[row]}-${col}`);
    } else {
      for (let row = rows - 1; row >= 0; row--) order.push(`${rowLabels[row]}-${col}`);
    }
  }
  return order;
}

/** Converts UI well label "A1" → internal key "A-1" */
export function uiToWellKey(ui: string): WellKey {
  return ui[0] + '-' + ui.slice(1);
}

/** Converts internal key "A-1" → UI label "A1" */
export function wellKeyToUi(key: WellKey): string {
  return key.replace('-', '');
}

/** Returns all well labels for a plate in row-major order, as UI strings ("A1", "A2", …) */
export function getWellOptions(format: PlateFormat): string[] {
  const { rows, cols, rowLabels } = PLATE_GEOMETRIES[format];
  const opts: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      opts.push(`${rowLabels[r]}${c}`);
    }
  }
  return opts;
}

/**
 * Apply mapping: assigns `replicates` consecutive serpentine wells per condition,
 * starting from `startWell` (internal key format, e.g. "A-1").
 */
export function autoFill(
  format: PlateFormat,
  selectedConditions: Condition[],
  startWellKey: string = 'A-1',
  replicates: number = 1,
): WellMap {
  const order = getSerpentineOrder(format);
  const startIdx = Math.max(0, order.indexOf(startWellKey));
  const wellMap: WellMap = {};

  selectedConditions.forEach((condition, condIdx) => {
    for (let rep = 0; rep < replicates; rep++) {
      const wellIdx = startIdx + condIdx * replicates + rep;
      if (wellIdx < order.length) {
        wellMap[order[wellIdx]] = { conditionId: condition.id, color: condition.color };
      }
    }
  });

  return wellMap;
}
