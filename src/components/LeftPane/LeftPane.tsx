import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { PlateFormat, Condition } from '../../types';
import ExperimentScaleSelect from './ExperimentScaleSelect';
import ConditionsTable from './ConditionsTable';

interface Props {
  plateFormat: PlateFormat;
  conditions: Condition[];
  selectedIds: string[];
  page: number;
  isExpanded: boolean;
  onFormatChange: (format: PlateFormat) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onPageChange: (page: number) => void;
  onToggleExpand: () => void;
}

export default function LeftPane({
  plateFormat,
  conditions,
  selectedIds,
  page,
  isExpanded,
  onFormatChange,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onPageChange,
  onToggleExpand,
}: Props) {
  const width = isExpanded ? '50vw' : '40%';

  return (
    <Box
      sx={{
        width,
        flexShrink: 0,
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        transition: 'width 0.25s ease',
      }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Experiment Scale
        </Typography>
        <ExperimentScaleSelect value={plateFormat} onChange={onFormatChange} />
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ flex: 1, overflow: 'hidden', px: 2, pb: 1, display: 'flex', flexDirection: 'column' }}>
        <ConditionsTable
          conditions={conditions}
          selectedIds={selectedIds}
          page={page}
          isExpanded={isExpanded}
          onToggleSelect={onToggleSelect}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
          onPageChange={onPageChange}
          onToggleExpand={onToggleExpand}
        />
      </Box>
    </Box>
  );
}
