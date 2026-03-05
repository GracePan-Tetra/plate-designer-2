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
  displayColor?: string; // overrides assignment.color when provided
  onClick: () => void;
}

export default function WellCircle({
  assignment,
  format,
  isHighlighted,
  manualMode,
  displayColor,
  onClick,
}: Props) {
  const size = WELL_SIZES[format];
  const color = displayColor ?? assignment?.color;

  const boxShadow = isHighlighted && color
    ? `0 0 0 3px white, 0 0 0 5px ${color}`
    : undefined;

  return (
    <Box
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color ?? 'transparent',
        border: color ? 'none' : '2px solid #E5E7EB',
        boxShadow,
        cursor: manualMode ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s ease, background-color 0.2s ease',
        flexShrink: 0,
      }}
    />
  );
}
