import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useDroppable } from '@dnd-kit/core';
import { PlateFormat, WellAssignment } from '../../types';
import { mockConditions } from '../../data/mockConditions';

const WELL_SIZES: Record<PlateFormat, number> = {
  '96': 32,
  '384': 14,
  '48': 40,
};

interface Props {
  wellKey: string;
  assignment: WellAssignment | undefined;
  format: PlateFormat;
  isHighlighted: boolean;
  manualMode: boolean;
  displayColor?: string;
  onClick: () => void;
}

function WellTooltipContent({ conditionId, color }: { conditionId: string; color: string }) {
  const condition = mockConditions.find((c) => c.id === conditionId);
  if (!condition) return null;
  return (
    <Box sx={{ p: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
        <Typography variant="caption" fontWeight={700}>{condition.id}</Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        Load Challenge: {condition.load_challenge}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        Resin: {condition.resin_name}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        Material: {condition.starting_material}
      </Typography>
    </Box>
  );
}

export default function WellCircle({
  wellKey,
  assignment,
  format,
  isHighlighted,
  manualMode,
  displayColor,
  onClick,
}: Props) {
  const { isOver, setNodeRef, active } = useDroppable({ id: wellKey });
  const isDragActive = active !== null;

  const size = WELL_SIZES[format];
  const color = displayColor ?? assignment?.color;

  const boxShadow = isOver
    ? '0 0 0 3px white, 0 0 0 5px #3B82F6'
    : isHighlighted && color
    ? `0 0 0 3px white, 0 0 0 5px ${color}`
    : undefined;

  const well = (
    <Box
      ref={setNodeRef}
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: isOver ? '#DBEAFE' : (color ?? 'transparent'),
        border: isOver ? '2px solid #3B82F6' : color ? 'none' : '2px solid #E5E7EB',
        boxShadow,
        cursor: isDragActive ? 'copy' : manualMode ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s ease, background-color 0.15s ease',
        flexShrink: 0,
      }}
    />
  );

  if (!assignment) return well;

  return (
    <Tooltip
      title={<WellTooltipContent conditionId={assignment.conditionId} color={assignment.color} />}
      placement="top"
      arrow
      slotProps={{ tooltip: { sx: { bgcolor: 'background.paper', color: 'text.primary', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '1px solid #E5E7EB', p: 1 } }, arrow: { sx: { color: 'background.paper' } } }}
    >
      {well}
    </Tooltip>
  );
}
