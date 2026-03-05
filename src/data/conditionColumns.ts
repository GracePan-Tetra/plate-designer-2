export interface ConditionColumn {
  field: string;
  headerName: string;
  type: 'string' | 'number';
}

export const CONDITION_COLUMNS: ConditionColumn[] = [
  { field: 'id', headerName: 'Condition ID', type: 'string' },
  { field: 'load_challenge', headerName: 'load_challenge', type: 'number' },
  { field: 'resin_name', headerName: 'resin_name', type: 'string' },
  { field: 'starting_material', headerName: 'starting material', type: 'string' },
];

/** Columns available for grouping (excludes the ID field) */
export const GROUPABLE_COLUMNS = CONDITION_COLUMNS.filter((c) => c.field !== 'id');
