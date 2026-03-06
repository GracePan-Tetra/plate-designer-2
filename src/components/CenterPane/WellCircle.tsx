import Box from '@mui/material/Box';
import { useDroppable } from '@dnd-kit/core';
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
  displayColor?: string;
  onClick: () => void;
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

  return (
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
}
