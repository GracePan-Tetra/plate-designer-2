import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  manualMode: boolean;
  assignedCount: number;
  totalWells: number;
  hasSelectedConditions: boolean;
  onAutoFill: () => void;
  onToggleManualMode: () => void;
  onClear: () => void;
}

export default function PlateToolbar({
  manualMode,
  assignedCount,
  totalWells,
  hasSelectedConditions,
  onAutoFill,
  onToggleManualMode,
  onClear,
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderBottom: '1px solid #E5E7EB',
        bgcolor: 'background.paper',
        flexWrap: 'wrap',
      }}
    >
      <Button
        variant="contained"
        size="small"
        onClick={onAutoFill}
        disabled={!hasSelectedConditions}
      >
        Auto-Fill
      </Button>

      <Chip
        icon={<EditIcon sx={{ fontSize: '0.85rem !important' }} />}
        label="Manual Mode"
        size="small"
        color={manualMode ? 'primary' : 'default'}
        variant={manualMode ? 'filled' : 'outlined'}
        onClick={onToggleManualMode}
        sx={{ cursor: 'pointer' }}
      />

      <Button variant="outlined" size="small" color="inherit" onClick={onClear} sx={{ color: 'text.secondary' }}>
        Clear
      </Button>

      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
        {assignedCount} / {totalWells} wells assigned
      </Typography>

      <Box sx={{ flex: 1 }} />

      <Tooltip title="Zoom in">
        <IconButton size="small">
          <ZoomInIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom out">
        <IconButton size="small">
          <ZoomOutIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Download">
        <IconButton size="small">
          <DownloadIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
