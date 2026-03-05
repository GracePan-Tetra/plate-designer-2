import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { ViewMode } from '../../types';

interface Props {
  viewMode: ViewMode;
  groupByColumn: string;
  onViewModeChange: (mode: ViewMode) => void;
  onGroupByColumnChange: (col: string) => void;
}

const FACTOR_COLUMNS = [
  { value: 'factor1', label: 'Factor 1' },
  { value: 'factor2', label: 'Factor 2' },
  { value: 'factor3', label: 'Factor 3' },
  { value: 'factor4', label: 'Factor 4' },
];

export default function VisualizationSettings({
  viewMode,
  groupByColumn,
  onViewModeChange,
  onGroupByColumnChange,
}: Props) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Visualization Mode
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
        <InputLabel>Group By</InputLabel>
        <Select
          value={viewMode}
          label="Group By"
          onChange={(e: SelectChangeEvent) => onViewModeChange(e.target.value as ViewMode)}
        >
          <MenuItem value="unique">Group by Unique Conditions</MenuItem>
          <MenuItem value="column">Group by Data Column</MenuItem>
        </Select>
      </FormControl>

      {viewMode === 'column' && (
        <>
          <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
            <InputLabel>Factor Column</InputLabel>
            <Select
              value={groupByColumn}
              label="Factor Column"
              onChange={(e: SelectChangeEvent) => onGroupByColumnChange(e.target.value)}
            >
              {FACTOR_COLUMNS.map((col) => (
                <MenuItem key={col.value} value={col.value}>
                  {col.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Gradient bar */}
          <Box>
            <Box
              sx={{
                height: 12,
                borderRadius: 1,
                background: 'linear-gradient(to right, #DBEAFE, #1D4ED8)',
                mb: 0.5,
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Low
              </Typography>
              <Typography variant="caption" color="text.secondary">
                High
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
