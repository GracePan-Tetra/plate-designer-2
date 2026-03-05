import Box from '@mui/material/Box';
import { PlateFormat, WellMap } from '../../types';
import { PLATE_GEOMETRIES } from '../../utils/serpentine';
import PlateToolbar from './PlateToolbar';
import PlateCanvas from './PlateCanvas';

interface Props {
  plateFormat: PlateFormat;
  wellMap: WellMap;
  manualMode: boolean;
  hoveredConditionId: string | null;
  hasSelectedConditions: boolean;
  getDisplayColor?: (conditionId: string) => string;
  onAutoFill: () => void;
  onToggleManualMode: () => void;
  onClear: () => void;
  onPaintWell: (wellKey: string) => void;
}

export default function CenterPane({
  plateFormat,
  wellMap,
  manualMode,
  hoveredConditionId,
  hasSelectedConditions,
  getDisplayColor,
  onAutoFill,
  onToggleManualMode,
  onClear,
  onPaintWell,
}: Props) {
  const geometry = PLATE_GEOMETRIES[plateFormat];
  const assignedCount = Object.keys(wellMap).length;

  return (
    <Box
      sx={{
        flex: '0 0 40%',
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: '#F9FAFB',
      }}
    >
      <PlateToolbar
        manualMode={manualMode}
        assignedCount={assignedCount}
        totalWells={geometry.totalWells}
        hasSelectedConditions={hasSelectedConditions}
        onAutoFill={onAutoFill}
        onToggleManualMode={onToggleManualMode}
        onClear={onClear}
      />

      <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PlateCanvas
          format={plateFormat}
          wellMap={wellMap}
          hoveredConditionId={hoveredConditionId}
          manualMode={manualMode}
          hasSelectedConditions={hasSelectedConditions}
          getDisplayColor={getDisplayColor}
          onPaintWell={onPaintWell}
        />
      </Box>
    </Box>
  );
}
