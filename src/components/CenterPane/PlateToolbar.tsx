import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import GridOnIcon from '@mui/icons-material/GridOn';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import DownloadIcon from '@mui/icons-material/Download';

interface Props {
  assignedCount: number;
  totalWells: number;
  onClear: () => void;
}

export default function PlateToolbar({ assignedCount, totalWells, onClear }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1.25,
        borderBottom: '1px solid #E5E7EB',
        bgcolor: 'background.paper',
      }}
    >
      {/* Well count */}
      <GridOnIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
      <Typography variant="caption" color="text.secondary">
        {assignedCount}/{totalWells} wells assigned
      </Typography>

      <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
        <Tooltip title="Zoom in">
          <IconButton size="small"><ZoomInIcon fontSize="small" /></IconButton>
        </Tooltip>
        <Tooltip title="Zoom out">
          <IconButton size="small"><ZoomOutIcon fontSize="small" /></IconButton>
        </Tooltip>
        <Tooltip title="Download">
          <IconButton size="small"><DownloadIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ flex: 1 }} />

      <Button variant="outlined" size="small" color="inherit" onClick={onClear} sx={{ color: 'text.secondary' }}>
        Clear
      </Button>
    </Box>
  );
}
