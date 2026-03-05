import Box from '@mui/material/Box';
import { PlateFormat, WellAssignment } from '../../types';

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
  onClick: () => void;
}

export default function WellCircle({
  assignment,
  format,
  isHighlighted,
  manualMode,
  onClick,
}: Props) {
  const size = WELL_SIZES[format];

  const boxShadow = isHighlighted && assignment
    ? `0 0 0 3px white, 0 0 0 5px ${assignment.color}`
    : undefined;

  return (
    <Box
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: assignment ? assignment.color : 'transparent',
        border: assignment ? 'none' : '2px solid #E5E7EB',
        boxShadow,
        cursor: manualMode ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s ease',
        flexShrink: 0,
      }}
    />
  );
}
