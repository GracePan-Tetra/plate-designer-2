import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { PlateFormat, Condition } from '../../types';
import ExperimentScaleSelect from './ExperimentScaleSelect';
import ConditionsTable from './ConditionsTable';

interface Props {
  plateFormat: PlateFormat;
  conditions: Condition[];
  selectedIds: string[];
  filter: string;
  page: number;
  onFormatChange: (format: PlateFormat) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onFilterChange: (val: string) => void;
  onPageChange: (page: number) => void;
}

export default function LeftPane({
  plateFormat,
  conditions,
  selectedIds,
  filter,
  page,
  onFormatChange,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onFilterChange,
  onPageChange,
}: Props) {
  return (
    <Box
      sx={{
        width: 360,
        flexShrink: 0,
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Experiment Scale
        </Typography>
        <ExperimentScaleSelect value={plateFormat} onChange={onFormatChange} />
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ p: 2, pb: 0 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Conditions ({conditions.length})
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden', px: 2, pb: 1 }}>
        <ConditionsTable
          conditions={conditions}
          selectedIds={selectedIds}
          filter={filter}
          page={page}
          onToggleSelect={onToggleSelect}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
          onFilterChange={onFilterChange}
          onPageChange={onPageChange}
        />
      </Box>
    </Box>
  );
}
