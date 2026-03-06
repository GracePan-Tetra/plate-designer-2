import { Fragment, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import FilterListIcon from '@mui/icons-material/FilterList';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Condition } from '../../types';
import { EMPTY_FILTER_STATE, type FilterState } from '../../utils/tableFilterTypes';
import { applyFilterState, countActiveConditions } from '../../utils/tableFilterUtils';
import { ConditionFilterPanel } from './ConditionFilterPanel';

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50];

const COLUMNS = [
  { field: 'id', headerName: 'Condition ID', type: 'string' as const },
  { field: 'load_challenge', headerName: 'load_challenge', type: 'number' as const },
  { field: 'resin_name', headerName: 'resin_name', type: 'string' as const },
  { field: 'starting_material', headerName: 'starting material', type: 'string' as const },
];

const GROUP_COLUMNS = COLUMNS.filter((c) => c.field !== 'id');

interface Props {
  conditions: Condition[];
  selectedIds: string[];
  page: number;
  isExpanded: boolean;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onPageChange: (page: number) => void;
  onToggleExpand: () => void;
}

function groupRows(data: Condition[], field: string): Map<string, Condition[]> {
  const map = new Map<string, Condition[]>();
  for (const row of data) {
    const key = String((row as unknown as Record<string, unknown>)[field] ?? '(blank)');
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(row);
  }
  return map;
}

// Custom pagination component
function CustomPagination({
  page,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Build page number list: 1 2 3 ... N
  const getPages = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 2) return [1, 2, 3, '...', totalPages];
    if (page >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', page, page + 1, page + 2, '...', totalPages];
  };

  const pages = getPages();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.75, borderTop: '1px solid #E5E7EB', flexShrink: 0 }}>
      {/* Prev */}
      <IconButton
        size="small"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        sx={{ p: 0.5 }}
      >
        <ChevronLeftIcon sx={{ fontSize: '1rem' }} />
      </IconButton>

      {/* Page numbers */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
        {pages.map((p, i) =>
          p === '...' ? (
            <Typography key={`ellipsis-${i}`} variant="caption" sx={{ px: 0.5, color: 'text.secondary' }}>
              ...
            </Typography>
          ) : (
            <Box
              key={p}
              onClick={() => onPageChange((p as number) - 1)}
              sx={{
                minWidth: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: page === (p as number) - 1 ? 700 : 400,
                bgcolor: page === (p as number) - 1 ? 'primary.main' : 'transparent',
                color: page === (p as number) - 1 ? '#fff' : 'text.primary',
                '&:hover': {
                  bgcolor: page === (p as number) - 1 ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              {p}
            </Box>
          )
        )}
      </Box>

      {/* Next */}
      <IconButton
        size="small"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        sx={{ p: 0.5 }}
      >
        <ChevronRightIcon sx={{ fontSize: '1rem' }} />
      </IconButton>

      <Box sx={{ flex: 1 }} />

      {/* Rows per page */}
      <Select
        size="small"
        value={pageSize}
        onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(0); }}
        sx={{
          fontSize: '0.78rem',
          height: 28,
          '& .MuiSelect-select': { py: 0, px: 1 },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
        }}
      >
        {PAGE_SIZE_OPTIONS.map((s) => (
          <MenuItem key={s} value={s} sx={{ fontSize: '0.78rem' }}>
            {s} / page
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

export default function ConditionsTable({
  conditions,
  selectedIds,
  page,
  isExpanded,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onPageChange,
  onToggleExpand,
}: Props) {
  const [filterState, setFilterState] = useState<FilterState>(EMPTY_FILTER_STATE);
  const [groupByField, setGroupByField] = useState<string>('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [groupAnchorEl, setGroupAnchorEl] = useState<HTMLElement | null>(null);
  const [pageSize, setPageSize] = useState(10);

  // Apply filter
  const filtered = useMemo(() => {
    type ConditionRecord = Record<string, unknown>;
    const asRecords: ConditionRecord[] = conditions.map((c) => ({ ...(c as unknown as ConditionRecord) }));
    const filteredRecords = applyFilterState(asRecords, filterState, COLUMNS);
    const filteredIds = new Set(filteredRecords.map((r) => r['id'] as string));
    return conditions.filter((c) => filteredIds.has(c.id));
  }, [conditions, filterState]);

  // Group or paginate
  const grouped = useMemo(() => {
    if (!groupByField) return null;
    return groupRows(filtered, groupByField);
  }, [filtered, groupByField]);

  const paginated = grouped ? null : filtered.slice(page * pageSize, page * pageSize + pageSize);

  const activeFilterCount = countActiveConditions(filterState);
  const activeConditionId = selectedIds[0];

  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selectedIds.includes(c.id));
  const someSelected = filtered.some((c) => selectedIds.includes(c.id));

  const handleSelectAllClick = () => {
    if (allFilteredSelected) onDeselectAll();
    else onSelectAll();
  };

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const renderRow = (condition: Condition) => {
    const isSelected = selectedIds.includes(condition.id);
    const isActive = condition.id === activeConditionId;
    return (
      <TableRow
        key={condition.id}
        selected={isSelected}
        onClick={() => onToggleSelect(condition.id)}
        sx={{
          cursor: 'pointer',
          outline: isActive ? `2px solid ${condition.color}` : 'none',
          outlineOffset: '-2px',
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox size="small" checked={isSelected} onChange={() => {}} />
        </TableCell>
        <TableCell sx={{ fontSize: '0.78rem', fontWeight: isActive ? 700 : 400 }}>{condition.id}</TableCell>
        <TableCell sx={{ fontSize: '0.78rem' }}>{condition.load_challenge}</TableCell>
        <TableCell sx={{ fontSize: '0.78rem' }}>{condition.resin_name}</TableCell>
        <TableCell sx={{ fontSize: '0.78rem' }}>{condition.starting_material}</TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Filter / Group / Expand toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, gap: 0.5 }}>
        <Button
          size="small"
          startIcon={<FilterListIcon sx={{ fontSize: '0.9rem !important' }} />}
          onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          sx={{
            color: activeFilterCount > 0 ? 'primary.main' : 'text.secondary',
            fontWeight: activeFilterCount > 0 ? 600 : 400,
            fontSize: '0.78rem',
            minWidth: 0,
            px: 1,
          }}
        >
          Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </Button>

        <Button
          size="small"
          startIcon={<WorkspacesIcon sx={{ fontSize: '0.9rem !important' }} />}
          onClick={(e) => setGroupAnchorEl(e.currentTarget)}
          sx={{
            color: groupByField ? 'primary.main' : 'text.secondary',
            fontWeight: groupByField ? 600 : 400,
            fontSize: '0.78rem',
            minWidth: 0,
            px: 1,
          }}
        >
          Group
        </Button>

        <Button
          size="small"
          startIcon={isExpanded
            ? <CloseFullscreenIcon sx={{ fontSize: '0.9rem !important' }} />
            : <OpenInFullIcon sx={{ fontSize: '0.9rem !important' }} />}
          onClick={onToggleExpand}
          sx={{ color: 'text.secondary', fontSize: '0.78rem', minWidth: 0, px: 1 }}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </Box>

      {/* Filter popover */}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { mt: 0.5 } } }}
      >
        <ConditionFilterPanel
          columns={COLUMNS}
          filterState={filterState}
          onFilterStateChange={setFilterState}
        />
      </Popover>

      {/* Group popover */}
      <Popover
        open={Boolean(groupAnchorEl)}
        anchorEl={groupAnchorEl}
        onClose={() => setGroupAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { p: 2, minWidth: 260 } } }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>Group by</Typography>
        <Select
          size="small"
          fullWidth
          displayEmpty
          value={groupByField}
          onChange={(e) => {
            setGroupByField(e.target.value);
            setExpandedGroups(new Set());
          }}
        >
          <MenuItem value="">None</MenuItem>
          {GROUP_COLUMNS.map((col) => (
            <MenuItem key={col.field} value={col.field}>{col.headerName}</MenuItem>
          ))}
        </Select>
        {groupByField && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5, gap: 1 }}>
            <Button size="small" variant="text" onClick={() => setExpandedGroups(new Set(grouped ? [...grouped.keys()] : []))}>
              Expand all
            </Button>
            <Button size="small" variant="text" onClick={() => setExpandedGroups(new Set())}>
              Collapse all
            </Button>
          </Box>
        )}
      </Popover>

      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  checked={allFilteredSelected}
                  indeterminate={someSelected && !allFilteredSelected}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {COLUMNS.map((col) => (
                <TableCell key={col.field} sx={{ fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {grouped ? (
              // Grouped view
              [...grouped.entries()].map(([key, rows]) => {
                const isOpen = expandedGroups.has(key);
                const selectedInGroup = rows.filter((r) => selectedIds.includes(r.id)).length;
                return (
                  <Fragment key={key}>
                    <TableRow
                      sx={{ bgcolor: 'action.hover', cursor: 'pointer' }}
                      onClick={() => toggleGroup(key)}
                    >
                      <TableCell colSpan={5} sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleGroup(key); }}>
                            {isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                          </IconButton>
                          <Typography variant="body2" fontWeight={600}>
                            {GROUP_COLUMNS.find((c) => c.field === groupByField)?.headerName ?? groupByField}: {key}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({rows.length} record{rows.length !== 1 ? 's' : ''}
                            {selectedInGroup > 0 ? `, ${selectedInGroup} selected` : ''})
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} sx={{ p: 0, borderBottom: 'none' }}>
                        <Collapse in={isOpen} timeout="auto">
                          <Table size="small">
                            <TableBody>{rows.map(renderRow)}</TableBody>
                          </Table>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })
            ) : (
              // Flat paginated view
              (paginated ?? []).map(renderRow)
            )}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">No records match the current filters.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!grouped && (
        <CustomPagination
          page={page}
          totalCount={filtered.length}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={setPageSize}
        />
      )}
    </Box>
  );
}
