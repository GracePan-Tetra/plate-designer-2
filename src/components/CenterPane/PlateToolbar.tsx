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
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClear: () => void;
}

export default function PlateToolbar({ assignedCount, totalWells, zoom, onZoomIn, onZoomOut, onClear }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        minHeight: 56,
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
          <span>
            <IconButton size="small" onClick={onZoomIn} disabled={zoom >= 2}><ZoomInIcon fontSize="small" /></IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Zoom out">
          <span>
            <IconButton size="small" onClick={onZoomOut} disabled={zoom <= 0.5}><ZoomOutIcon fontSize="small" /></IconButton>
          </span>
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
