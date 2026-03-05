import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Condition } from '../../types';

interface Props {
  condition: Condition;
  onRemove: (id: string) => void;
  onHoverEnter: (id: string) => void;
  onHoverLeave: () => void;
}

export default function LegendCard({ condition, onRemove, onHoverEnter, onHoverLeave }: Props) {
  return (
    <Box
      onMouseEnter={() => onHoverEnter(condition.id)}
      onMouseLeave={onHoverLeave}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        p: 1,
        borderRadius: 1,
        border: '1px solid #E5E7EB',
        mb: 1,
        bgcolor: 'background.paper',
        '&:hover': { bgcolor: '#F9FAFB' },
        cursor: 'default',
      }}
    >
      <Box sx={{ width: 16, height: 16, borderRadius: '4px', bgcolor: condition.color, flexShrink: 0, mt: 0.25 }} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', lineHeight: 1.3 }} noWrap>
          {condition.id}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', lineHeight: 1.3 }} noWrap>
          {condition.load_challenge} | {condition.resin_name} | {condition.starting_material}
        </Typography>
      </Box>

      <IconButton size="small" onClick={() => onRemove(condition.id)} sx={{ p: 0.25, flexShrink: 0 }}>
        <CloseIcon sx={{ fontSize: '0.9rem' }} />
      </IconButton>
    </Box>
  );
}
