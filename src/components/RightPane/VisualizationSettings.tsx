import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import LayersIcon from '@mui/icons-material/Layers';
import { ViewMode } from '../../types';
import { GROUPABLE_COLUMNS } from '../../data/conditionColumns';

interface Props {
  viewMode: ViewMode;
  groupByColumn: string;
  onViewModeChange: (mode: ViewMode) => void;
  onGroupByColumnChange: (col: string) => void;
}

export default function VisualizationSettings({
  viewMode,
  groupByColumn,
  onViewModeChange,
  onGroupByColumnChange,
}: Props) {
  return (
    <Box sx={{ mb: 2 }}>
      {/* Section header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <LayersIcon sx={{ fontSize: '0.95rem', color: 'text.secondary' }} />
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.08em', color: 'text.secondary', textTransform: 'uppercase' }}>
          Visualization
        </Typography>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
        Visualization View Mode
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
        <Select
          value={viewMode}
          onChange={(e: SelectChangeEvent) => onViewModeChange(e.target.value as ViewMode)}
        >
          <MenuItem value="unique">Group by Unique Conditions</MenuItem>
          <MenuItem value="column">Group by Data Column</MenuItem>
        </Select>
      </FormControl>

      {viewMode === 'column' && (
        <Box sx={{ pl: 1.5, borderLeft: '2px solid #E5E7EB' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
            Column
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={groupByColumn}
              displayEmpty
              onChange={(e: SelectChangeEvent) => onGroupByColumnChange(e.target.value)}
            >
              <MenuItem value="" disabled><em>Select column</em></MenuItem>
              {GROUPABLE_COLUMNS.map((col) => (
                <MenuItem key={col.field} value={col.field}>
                  {col.headerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}
