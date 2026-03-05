import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Condition, ViewMode } from '../../types';
import VisualizationSettings from './VisualizationSettings';
import LegendCard from './LegendCard';

interface Props {
  selectedConditions: Condition[];
  viewMode: ViewMode;
  groupByColumn: string;
  onViewModeChange: (mode: ViewMode) => void;
  onGroupByColumnChange: (col: string) => void;
  onRemoveCondition: (id: string) => void;
  onHoverCondition: (id: string | null) => void;
}

export default function RightPane({
  selectedConditions,
  viewMode,
  groupByColumn,
  onViewModeChange,
  onGroupByColumnChange,
  onRemoveCondition,
  onHoverCondition,
}: Props) {
  return (
    <Box
      sx={{
        width: '20%',
        flexShrink: 0,
        borderLeft: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
        <VisualizationSettings
          viewMode={viewMode}
          groupByColumn={groupByColumn}
          onViewModeChange={onViewModeChange}
          onGroupByColumnChange={onGroupByColumnChange}
        />

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Legend ({selectedConditions.length} conditions)
        </Typography>

        {selectedConditions.length === 0 ? (
          <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
            No conditions selected
          </Typography>
        ) : (
          selectedConditions.map((condition) => (
            <LegendCard
              key={condition.id}
              condition={condition}
              onRemove={onRemoveCondition}
              onHoverEnter={(id) => onHoverCondition(id)}
              onHoverLeave={() => onHoverCondition(null)}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
