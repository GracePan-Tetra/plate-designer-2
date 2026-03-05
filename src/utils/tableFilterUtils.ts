import type { ColumnDef, ColumnType, FilterCondition, FilterGroup, FilterItem, FilterOperator, FilterState } from './tableFilterTypes';
import { isFilterGroup } from './tableFilterTypes';

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  contains: 'contains',
  does_not_contain: 'does not contain',
  is: 'is',
  is_not: 'is not',
  is_empty: 'is empty',
  is_not_empty: 'is not empty',
  eq: '=',
  neq: '≠',
  lt: '<',
  gt: '>',
  lte: '≤',
  gte: '≥',
};

const STRING_OPERATORS: FilterOperator[] = ['contains', 'does_not_contain', 'is', 'is_not', 'is_empty', 'is_not_empty'];
const NUMBER_OPERATORS: FilterOperator[] = ['eq', 'neq', 'lt', 'gt', 'lte', 'gte', 'is_empty', 'is_not_empty'];

export function getOperatorsForType(type: ColumnType = 'string'): FilterOperator[] {
  return type === 'number' ? NUMBER_OPERATORS : STRING_OPERATORS;
}

export function getDefaultOperator(type: ColumnType = 'string'): FilterOperator {
  return type === 'number' ? 'eq' : 'contains';
}

export function valueInputRequired(operator: FilterOperator): boolean {
  return operator !== 'is_empty' && operator !== 'is_not_empty';
}

export function countActiveConditions(filterState: FilterState): number {
  let count = 0;
  for (const item of filterState.items) {
    if (isFilterGroup(item)) count += item.conditions.length;
    else count += 1;
  }
  return count;
}

function getColumnType(field: string, columns: ColumnDef[]): ColumnType {
  return columns.find((c) => c.field === field)?.type ?? 'string';
}

export function evaluateCondition(
  row: Record<string, unknown>,
  condition: FilterCondition,
  columns: ColumnDef[]
): boolean {
  const rawVal = row[condition.field];
  const colType = getColumnType(condition.field, columns);
  const { operator, value } = condition;

  if (operator === 'is_empty') return rawVal === null || rawVal === undefined || String(rawVal).trim() === '';
  if (operator === 'is_not_empty') return rawVal !== null && rawVal !== undefined && String(rawVal).trim() !== '';

  if (colType === 'number') {
    const rowNum = typeof rawVal === 'number' ? rawVal : parseFloat(String(rawVal ?? ''));
    const condNum = parseFloat(value);
    if (isNaN(condNum)) return true;
    switch (operator) {
      case 'eq': return rowNum === condNum;
      case 'neq': return rowNum !== condNum;
      case 'lt': return rowNum < condNum;
      case 'gt': return rowNum > condNum;
      case 'lte': return rowNum <= condNum;
      case 'gte': return rowNum >= condNum;
      default: return true;
    }
  }

  const rowStr = String(rawVal ?? '').toLowerCase();
  const condStr = value.toLowerCase();
  if (!condStr) return true;
  switch (operator) {
    case 'contains': return rowStr.includes(condStr);
    case 'does_not_contain': return !rowStr.includes(condStr);
    case 'is': return rowStr === condStr;
    case 'is_not': return rowStr !== condStr;
    default: return true;
  }
}

function evaluateGroup(row: Record<string, unknown>, group: FilterGroup, columns: ColumnDef[]): boolean {
  if (group.conditions.length === 0) return true;
  if (group.conjunction === 'or') return group.conditions.some((c) => evaluateCondition(row, c, columns));
  return group.conditions.every((c) => evaluateCondition(row, c, columns));
}

function evaluateItem(row: Record<string, unknown>, item: FilterItem, columns: ColumnDef[]): boolean {
  if (isFilterGroup(item)) return evaluateGroup(row, item, columns);
  return evaluateCondition(row, item, columns);
}

export function applyFilterState(
  data: Record<string, unknown>[],
  filterState: FilterState,
  columns: ColumnDef[]
): Record<string, unknown>[] {
  if (filterState.items.length === 0) return data;
  return data.filter((row) => {
    if (filterState.conjunction === 'or') return filterState.items.some((item) => evaluateItem(row, item, columns));
    return filterState.items.every((item) => evaluateItem(row, item, columns));
  });
}
