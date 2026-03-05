import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, arrayMove, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type {
  ColumnDef, FilterState, FilterCondition, FilterGroup,
  FilterConjunction, FilterItem,
} from '../../utils/tableFilterTypes';
import { isFilterGroup, EMPTY_FILTER_STATE } from '../../utils/tableFilterTypes';
import {
  getOperatorsForType, getDefaultOperator, valueInputRequired, OPERATOR_LABELS,
} from '../../utils/tableFilterUtils';

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeCondition(field: string, type: import('../../utils/tableFilterTypes').ColumnType = 'string'): FilterCondition {
  return { id: crypto.randomUUID(), field, operator: getDefaultOperator(type), value: '' };
}

function addCondition(state: FilterState, columns: ColumnDef[]): FilterState {
  const firstCol = columns[0];
  const cond = makeCondition(firstCol.field, firstCol.type ?? 'string');
  return { ...state, items: [...state.items, cond] };
}

function addConditionGroup(state: FilterState): FilterState {
  const group: FilterGroup = { id: crypto.randomUUID(), conjunction: 'and', conditions: [] };
  return { ...state, items: [...state.items, group] };
}

function updateItem(state: FilterState, id: string, updated: FilterItem): FilterState {
  return { ...state, items: state.items.map((it) => (it.id === id ? updated : it)) };
}

function deleteItem(state: FilterState, id: string): FilterState {
  return { ...state, items: state.items.filter((it) => it.id !== id) };
}

// ─── ConditionRow ────────────────────────────────────────────────────────────

function ConditionRow({
  condition, isFirst, parentConjunction, columns, onChange, onDelete,
}: {
  condition: FilterCondition;
  isFirst: boolean;
  parentConjunction: FilterConjunction;
  columns: ColumnDef[];
  onChange: (updated: FilterCondition) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: condition.id });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  const colDef = columns.find((c) => c.field === condition.field) ?? columns[0];
  const colType = colDef.type ?? 'string';
  const operators = getOperatorsForType(colType);
  const needsValue = valueInputRequired(condition.operator);
  const [localValue, setLocalValue] = useState(condition.value);

  const commitValue = useCallback(() => {
    if (localValue !== condition.value) onChange({ ...condition, value: localValue });
  }, [localValue, condition, onChange]);

  const handleFieldChange = (field: string) => {
    const newColDef = columns.find((c) => c.field === field) ?? columns[0];
    onChange({ ...condition, field, operator: getDefaultOperator(newColDef.type ?? 'string'), value: '' });
    setLocalValue('');
  };

  return (
    <Box ref={setNodeRef} sx={{ ...style, display: 'flex', alignItems: 'center', gap: 1, py: 0.75 }}>
      <Box sx={{ minWidth: 52, textAlign: 'right' }}>
        {isFirst ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>Where</Typography>
        ) : (
          <Typography variant="body2" sx={{ px: 0.75, py: 0.25, bgcolor: 'action.hover', borderRadius: 1, fontSize: 12, fontWeight: 500, display: 'inline-block' }}>
            {parentConjunction === 'and' ? 'And' : 'Or'}
          </Typography>
        )}
      </Box>

      <Select size="small" value={condition.field} onChange={(e) => handleFieldChange(e.target.value)} sx={{ minWidth: 120 }}>
        {columns.map((c) => <MenuItem key={c.field} value={c.field}>{c.headerName}</MenuItem>)}
      </Select>

      <Select size="small" value={condition.operator} onChange={(e) => onChange({ ...condition, operator: e.target.value as FilterCondition['operator'] })} sx={{ minWidth: 130 }}>
        {operators.map((op) => <MenuItem key={op} value={op}>{OPERATOR_LABELS[op]}</MenuItem>)}
      </Select>

      {needsValue && (
        <TextField
          size="small"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={commitValue}
          onKeyDown={(e) => { if (e.key === 'Enter') commitValue(); }}
          placeholder="Enter a value…"
          sx={{ minWidth: 120 }}
        />
      )}

      <IconButton size="small" onClick={onDelete} sx={{ ml: 'auto' }}>
        <DeleteOutlinedIcon fontSize="small" />
      </IconButton>
      <Box component="span" sx={{ cursor: 'grab', touchAction: 'none', display: 'flex', p: 0.25 }} {...attributes} {...listeners}>
        <DragIndicatorIcon sx={{ fontSize: 18, color: 'action.active' }} />
      </Box>
    </Box>
  );
}

// ─── FilterPanel ─────────────────────────────────────────────────────────────

export interface ConditionFilterPanelProps {
  columns: ColumnDef[];
  filterState: FilterState;
  onFilterStateChange: (state: FilterState) => void;
}

export function ConditionFilterPanel({ columns, filterState, onFilterStateChange }: ConditionFilterPanelProps) {
  const hasItems = filterState.items.length > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = filterState.items.findIndex((it) => it.id === active.id);
    const newIdx = filterState.items.findIndex((it) => it.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    onFilterStateChange({ ...filterState, items: arrayMove([...filterState.items], oldIdx, newIdx) });
  };

  return (
    <Box sx={{ minWidth: 480, p: 2 }}>
      {!hasItems && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, mb: 2, bgcolor: 'grey.50', borderRadius: 1, border: 1, borderColor: 'divider' }}>
          <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">No filter conditions applied</Typography>
        </Box>
      )}

      {hasItems && (
        <Box mb={1.5}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="body2" color="text.secondary">In this view, show records</Typography>
            {filterState.items.length > 1 && (
              <Select size="small" value={filterState.conjunction}
                onChange={(e) => onFilterStateChange({ ...filterState, conjunction: e.target.value as FilterConjunction })}
                sx={{ minWidth: 80 }}>
                <MenuItem value="and">And</MenuItem>
                <MenuItem value="or">Or</MenuItem>
              </Select>
            )}
          </Box>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filterState.items.map((it) => it.id)} strategy={verticalListSortingStrategy}>
              {filterState.items.map((item, idx) =>
                isFilterGroup(item) ? null : (
                  <ConditionRow
                    key={item.id}
                    condition={item}
                    isFirst={idx === 0}
                    parentConjunction={filterState.conjunction}
                    columns={columns}
                    onChange={(updated) => onFilterStateChange(updateItem(filterState, item.id, updated))}
                    onDelete={() => onFilterStateChange(deleteItem(filterState, item.id))}
                  />
                )
              )}
            </SortableContext>
          </DndContext>
        </Box>
      )}

      <Box display="flex" gap={2} pt={1.5} sx={{ borderTop: hasItems ? 1 : 0, borderColor: 'divider' }}>
        <Link component="button" variant="body2" onClick={() => onFilterStateChange(addCondition(filterState, columns))} sx={{ cursor: 'pointer' }}>
          + Add condition
        </Link>
        <Link component="button" variant="body2" onClick={() => onFilterStateChange(addConditionGroup(filterState))} sx={{ cursor: 'pointer' }}>
          + Add condition group
        </Link>
        {hasItems && (
          <Link component="button" variant="body2" color="error" onClick={() => onFilterStateChange(EMPTY_FILTER_STATE)} sx={{ cursor: 'pointer', ml: 'auto' }}>
            Clear all
          </Link>
        )}
      </Box>
    </Box>
  );
}
