export type ColumnType = 'string' | 'number';

export interface ColumnDef {
  field: string;
  headerName: string;
  type?: ColumnType;
}

export type FilterOperator =
  | 'contains' | 'does_not_contain' | 'is' | 'is_not' | 'is_empty' | 'is_not_empty'
  | 'eq' | 'neq' | 'lt' | 'gt' | 'lte' | 'gte';

export type FilterConjunction = 'and' | 'or';

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
}

export interface FilterGroup {
  id: string;
  conjunction: FilterConjunction;
  conditions: FilterCondition[];
}

export type FilterItem = FilterCondition | FilterGroup;

export interface FilterState {
  conjunction: FilterConjunction;
  items: FilterItem[];
}

export function isFilterGroup(item: FilterItem): item is FilterGroup {
  return 'conditions' in item;
}

export const EMPTY_FILTER_STATE: FilterState = { conjunction: 'and', items: [] };

export type GroupSortOrder = 'asc' | 'desc' | 'count';

export type GroupByField = string;
