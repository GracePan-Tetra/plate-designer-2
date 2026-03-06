import Box from '@mui/material/Box';
import { PlateFormat, WellMap } from '../../types';
import { PLATE_GEOMETRIES } from '../../utils/serpentine';
import PlateToolbar from './PlateToolbar';
import PlateCanvas from './PlateCanvas';

interface Props {
  plateFormat: PlateFormat;
  wellMap: WellMap;
  hoveredConditionId: string | null;
  hasSelectedConditions: boolean;
  isLeftCollapsed: boolean;
  getDisplayColor?: (conditionId: string) => string;
  onClear: () => void;
  onPaintWell: (wellKey: string) => void;
}

export default function CenterPane({
  plateFormat,
  wellMap,
  hoveredConditionId,
  hasSelectedConditions,
  isLeftCollapsed,
  getDisplayColor,
  onClear,
  onPaintWell,
}: Props) {
  const geometry = PLATE_GEOMETRIES[plateFormat];
  const assignedCount = Object.keys(wellMap).length;
  return (
    <Box
      sx={{
        ...(isLeftCollapsed ? { flex: 1 } : { flex: '0 0 40%', width: '40%' }),
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: '#F9FAFB',
      }}
    >
      <PlateToolbar
        assignedCount={assignedCount}
        totalWells={geometry.totalWells}
        onClear={onClear}
      />

      <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PlateCanvas
          format={plateFormat}
          wellMap={wellMap}
          hoveredConditionId={hoveredConditionId}
          manualMode={hasSelectedConditions}
          hasSelectedConditions={hasSelectedConditions}
          getDisplayColor={getDisplayColor}
          onPaintWell={onPaintWell}
        />
      </Box>
    </Box>
  );
}
