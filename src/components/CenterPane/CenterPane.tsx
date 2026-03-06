import { useState } from 'react';
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
  const [zoom, setZoom] = useState(1);
  const handleZoomIn = () => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)));

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
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onClear={onClear}
      />

      <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PlateCanvas
          format={plateFormat}
          wellMap={wellMap}
          hoveredConditionId={hoveredConditionId}
          manualMode={hasSelectedConditions}
          hasSelectedConditions={hasSelectedConditions}
          zoom={zoom}
          getDisplayColor={getDisplayColor}
          onPaintWell={onPaintWell}
        />
      </Box>
    </Box>
  );
}
