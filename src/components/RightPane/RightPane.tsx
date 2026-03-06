import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TuneIcon from '@mui/icons-material/Tune';
import BarChartIcon from '@mui/icons-material/BarChart';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Condition, ViewMode } from '../../types';
import { GROUPABLE_COLUMNS } from '../../data/conditionColumns';
import { GRADIENT_LOW, GRADIENT_HIGH, getGradientColor } from '../../utils/colorUtils';
import { CATEGORICAL_COLORS, mockConditions } from '../../data/mockConditions';
import VisualizationSettings from './VisualizationSettings';
import LegendCard from './LegendCard';

interface Props {
  selectedConditions: Condition[];
  viewMode: ViewMode;
  groupByColumn: string;
  isLeftCollapsed: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onGroupByColumnChange: (col: string) => void;
  onRemoveCondition: (id: string) => void;
  onHoverCondition: (id: string | null) => void;
}

// ─── Numerical legend ────────────────────────────────────────────────────────

function NumericalLegend({ field }: { field: string }) {
  const allValues = mockConditions.map((c) => (c as unknown as Record<string, unknown>)[field] as number);
  const nonZeroValues = allValues.filter((v) => v > 0);
  const min = nonZeroValues.length ? Math.min(...nonZeroValues) : 0;
  const max = nonZeroValues.length ? Math.max(...nonZeroValues) : 0;

  const distinctValues = [...new Set(allValues)].sort((a, b) => a - b);
  const colDef = GROUPABLE_COLUMNS.find((c) => c.field === field);
  const label = colDef?.headerName ?? field;

  return (
    <Box sx={{ border: '1px solid #E5E7EB', borderRadius: 2, p: 1.5 }}>
      {/* Legend header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="body2" fontWeight={700}>{label}</Typography>
        <FilterAltOutlinedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
      </Box>

      {/* Value rows */}
      {distinctValues.map((value) => {
        const color = getGradientColor(value, min, max);
        const isControl = value === 0;
        return (
          <Box key={value} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '4px',
                bgcolor: color,
                border: isControl ? '1.5px solid #E5E7EB' : 'none',
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" sx={{ flex: 1 }}>{value}</Typography>
            {isControl && (
              <Typography variant="caption" color="text.secondary">(Control)</Typography>
            )}
          </Box>
        );
      })}

      <Divider sx={{ my: 1.5 }} />

      {/* Gradient bar */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
        Gradient Scale Map
      </Typography>
      <Box
        sx={{
          height: 10,
          borderRadius: 1,
          background: `linear-gradient(to right, ${GRADIENT_LOW}, ${GRADIENT_HIGH})`,
          mb: 0.5,
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">Low ({min})</Typography>
        <Typography variant="caption" color="text.secondary">High ({max})</Typography>
      </Box>
    </Box>
  );
}

// ─── Categorical legend ───────────────────────────────────────────────────────

function CategoricalLegend({ field }: { field: string }) {
  const allValues = [...new Set(mockConditions.map((c) => String((c as unknown as Record<string, unknown>)[field])))].sort();
  const colDef = GROUPABLE_COLUMNS.find((c) => c.field === field);
  const label = colDef?.headerName ?? field;

  return (
    <Box sx={{ border: '1px solid #E5E7EB', borderRadius: 2, p: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="body2" fontWeight={700}>{label}</Typography>
        <FilterAltOutlinedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
      </Box>

      {allValues.map((value, idx) => {
        const color = CATEGORICAL_COLORS[idx % CATEGORICAL_COLORS.length];
        return (
          <Box key={value} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: color, flexShrink: 0 }} />
            <Typography variant="body2" noWrap>{value}</Typography>
          </Box>
        );
      })}
    </Box>
  );
}

// ─── RightPane ────────────────────────────────────────────────────────────────

export default function RightPane({
  selectedConditions,
  viewMode,
  groupByColumn,
  isLeftCollapsed,
  onViewModeChange,
  onGroupByColumnChange,
  onRemoveCondition,
  onHoverCondition,
}: Props) {
  const activeColumn = GROUPABLE_COLUMNS.find((c) => c.field === groupByColumn);
  const isColumnMode = viewMode === 'column' && !!activeColumn;
  const isNumerical = activeColumn?.type === 'number';
  return (
    <Box
      sx={{
        ...(isLeftCollapsed ? { flex: 1 } : { width: '20%' }),
        flexShrink: 0,
        borderLeft: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, minHeight: 56, borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
        <TuneIcon sx={{ fontSize: '1.1rem', color: 'text.primary' }} />
        <Typography variant="subtitle1" fontWeight={700}>Display Settings</Typography>
      </Box>

      <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>

        {/* VISUALIZATION section */}
        <VisualizationSettings
          viewMode={viewMode}
          groupByColumn={groupByColumn}
          onViewModeChange={onViewModeChange}
          onGroupByColumnChange={onGroupByColumnChange}
        />

        <Divider sx={{ mb: 2 }} />

        {/* LEGEND section header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
          <BarChartIcon sx={{ fontSize: '0.95rem', color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.08em', color: 'text.secondary', textTransform: 'uppercase' }}>
            Legend
          </Typography>
        </Box>

        {/* Column-based legend */}
        {isColumnMode && groupByColumn ? (
          isNumerical ? (
            <NumericalLegend field={groupByColumn} />
          ) : (
            <CategoricalLegend field={groupByColumn} />
          )
        ) : (
          /* Unique conditions legend */
          selectedConditions.length === 0 ? (
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
          )
        )}
      </Box>
    </Box>
  );
}
