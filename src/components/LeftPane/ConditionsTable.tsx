import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { Condition } from '../../types';

const ROWS_PER_PAGE = 10;

interface Props {
  conditions: Condition[];
  selectedIds: string[];
  filter: string;
  page: number;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onFilterChange: (val: string) => void;
  onPageChange: (page: number) => void;
}

export default function ConditionsTable({
  conditions,
  selectedIds,
  filter,
  page,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onFilterChange,
  onPageChange,
}: Props) {
  const filtered = conditions.filter(
    (c) =>
      c.id.toLowerCase().includes(filter.toLowerCase()) ||
      c.factor1.toLowerCase().includes(filter.toLowerCase()),
  );

  const paginated = filtered.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((c) => selectedIds.includes(c.id));
  const someSelected = filtered.some((c) => selectedIds.includes(c.id));

  const handleSelectAllClick = () => {
    if (allFilteredSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  const activeConditionId = selectedIds[0];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <TextField
          size="small"
          placeholder="Filter conditions..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title="Expand / Group">
          <IconButton size="small">
            <UnfoldMoreIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

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
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Condition ID</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Factor 1</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Factor 2</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Factor 3</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((condition) => {
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
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: isActive ? 700 : 400 }}>
                    {condition.id}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{condition.factor1}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{condition.factor2}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{condition.factor3}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        rowsPerPage={ROWS_PER_PAGE}
        rowsPerPageOptions={[ROWS_PER_PAGE]}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        sx={{ borderTop: '1px solid #E5E7EB', flexShrink: 0 }}
      />
    </Box>
  );
}
