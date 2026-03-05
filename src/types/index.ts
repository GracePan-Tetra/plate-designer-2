export type PlateFormat = '96' | '384' | '48';

export interface PlateGeometry {
  rows: number;
  cols: number;
  totalWells: number;
  rowLabels: string[];
}

export interface Condition {
  id: string;
  load_challenge: number;
  resin_name: string;
  starting_material: string;
  color: string;
}

export type WellKey = string; // "A-1", "H-12", etc.

export interface WellAssignment {
  conditionId: string;
  color: string;
}

export type WellMap = Record<WellKey, WellAssignment>;

export type ViewMode = 'unique' | 'column';
