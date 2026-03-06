import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PlateFormat, WellMap } from '../../types';
import { PLATE_GEOMETRIES } from '../../utils/serpentine';
import WellCircle from './WellCircle';

interface Props {
  format: PlateFormat;
  wellMap: WellMap;
  hoveredConditionId: string | null;
  manualMode: boolean;
  hasSelectedConditions: boolean;
  zoom: number;
  getDisplayColor?: (conditionId: string) => string;
  onPaintWell: (wellKey: string) => void;
}

const WELL_GAPS: Record<PlateFormat, number> = {
  '96': 4,
  '384': 2,
  '48': 6,
};

export default function PlateCanvas({
  format,
  wellMap,
  hoveredConditionId,
  manualMode,
  hasSelectedConditions,
  zoom,
  getDisplayColor,
  onPaintWell,
}: Props) {
  const { rows, cols, rowLabels } = PLATE_GEOMETRIES[format];
  const gap = WELL_GAPS[format];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        p: 3,
      }}
    >
      {!hasSelectedConditions && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
          Select conditions from the left panel to begin painting wells
        </Typography>
      )}

      <Box
        sx={{
          display: 'inline-block',
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid #E5E7EB',
          p: 2,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.15s ease',
        }}
      >
        {/* Column header row */}
        <Box sx={{ display: 'flex', mb: 0.5 }}>
          {/* Corner spacer for row label column */}
          <Box sx={{ width: 24, flexShrink: 0 }} />
          {Array.from({ length: cols }, (_, i) => (
            <Box
              key={i}
              sx={{
                width: WELL_GAPS[format] === 6 ? 40 : WELL_GAPS[format] === 4 ? 32 : 14,
                mx: `${gap / 2}px`,
                textAlign: 'center',
                fontSize: format === '384' ? '0.5rem' : '0.65rem',
                color: 'text.secondary',
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </Box>
          ))}
        </Box>

        {/* Well rows */}
        {Array.from({ length: rows }, (_, rowIdx) => {
          const rowLabel = rowLabels[rowIdx];
          return (
            <Box key={rowLabel} sx={{ display: 'flex', alignItems: 'center', mb: `${gap}px` }}>
              {/* Row label */}
              <Box
                sx={{
                  width: 24,
                  flexShrink: 0,
                  fontSize: format === '384' ? '0.5rem' : '0.65rem',
                  color: 'text.secondary',
                  textAlign: 'right',
                  pr: 0.5,
                }}
              >
                {rowLabel}
              </Box>

              {/* Wells */}
              {Array.from({ length: cols }, (_, colIdx) => {
                const wellKey = `${rowLabel}-${colIdx + 1}`;
                const assignment = wellMap[wellKey];
                const isHighlighted =
                  hoveredConditionId !== null &&
                  assignment?.conditionId === hoveredConditionId;

                const displayColor = assignment && getDisplayColor
                  ? getDisplayColor(assignment.conditionId)
                  : undefined;

                return (
                  <Box key={wellKey} sx={{ mx: `${gap / 2}px`, flexShrink: 0 }}>
                    <WellCircle
                      wellKey={wellKey}
                      assignment={assignment}
                      format={format}
                      isHighlighted={isHighlighted}
                      manualMode={manualMode}
                      displayColor={displayColor}
                      onClick={() => onPaintWell(wellKey)}
                    />
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
