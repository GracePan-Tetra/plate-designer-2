import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { usePlateState } from './hooks/usePlateState';
import { mockConditions, CATEGORICAL_COLORS } from './data/mockConditions';
import { GROUPABLE_COLUMNS } from './data/conditionColumns';
import { getGradientColor } from './utils/colorUtils';
import LeftPane from './components/LeftPane/LeftPane';
import CenterPane from './components/CenterPane/CenterPane';
import RightPane from './components/RightPane/RightPane';
import { ViewMode } from './types';

export default function App() {
  const { state, dispatch } = usePlateState();
  const [leftPaneExpanded, setLeftPaneExpanded] = useState(false);

  const selectedConditions = state.selectedConditionIds
    .map((id) => mockConditions.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  // Compute dynamic well display colors based on visualization mode
  const getDisplayColor = useMemo(() => {
    if (state.viewMode !== 'column' || !state.groupByColumn) return undefined;

    const colDef = GROUPABLE_COLUMNS.find((c) => c.field === state.groupByColumn);
    if (!colDef) return undefined;

    const field = state.groupByColumn;

    if (colDef.type === 'number') {
      const allValues = mockConditions.map(
        (c) => (c as unknown as Record<string, number>)[field]
      );
      const nonZero = allValues.filter((v) => v > 0);
      const min = nonZero.length ? Math.min(...nonZero) : 0;
      const max = nonZero.length ? Math.max(...nonZero) : 0;

      return (conditionId: string) => {
        const condition = mockConditions.find((c) => c.id === conditionId);
        if (!condition) return '#E5E7EB';
        const value = (condition as unknown as Record<string, number>)[field];
        return getGradientColor(value, min, max);
      };
    } else {
      // Categorical
      const distinctValues = [
        ...new Set(
          mockConditions.map((c) => String((c as unknown as Record<string, unknown>)[field]))
        ),
      ].sort();

      return (conditionId: string) => {
        const condition = mockConditions.find((c) => c.id === conditionId);
        if (!condition) return '#E5E7EB';
        const value = String((condition as unknown as Record<string, unknown>)[field]);
        const idx = distinctValues.indexOf(value);
        return CATEGORICAL_COLORS[idx % CATEGORICAL_COLORS.length];
      };
    }
  }, [state.viewMode, state.groupByColumn]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ px: 3, py: 1.5, borderBottom: '1px solid #E5E7EB', bgcolor: 'background.paper', flexShrink: 0 }}>
        <Breadcrumbs separator="/" sx={{ mb: 0.5 }}>
          <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.8rem' }}>Project X</Link>
          <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.8rem' }}>All Experiments</Link>
        </Breadcrumbs>
        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>Experiment Name</Typography>
      </Box>

      {/* 3-panel layout */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <LeftPane
          plateFormat={state.plateFormat}
          conditions={mockConditions}
          selectedIds={state.selectedConditionIds}
          page={state.page}
          isExpanded={leftPaneExpanded}
          onFormatChange={(format) => dispatch({ type: 'SET_PLATE_FORMAT', payload: format })}
          onToggleSelect={(id) => dispatch({ type: 'TOGGLE_CONDITION_SELECTION', payload: id })}
          onSelectAll={() => dispatch({ type: 'SELECT_ALL_CONDITIONS' })}
          onDeselectAll={() => dispatch({ type: 'DESELECT_ALL_CONDITIONS' })}
          onPageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
          onToggleExpand={() => setLeftPaneExpanded((v) => !v)}
        />

        <CenterPane
          plateFormat={state.plateFormat}
          wellMap={state.wellMap}
          manualMode={state.manualMode}
          hoveredConditionId={state.hoveredConditionId}
          hasSelectedConditions={state.selectedConditionIds.length > 0}
          getDisplayColor={getDisplayColor}
          onAutoFill={() => dispatch({ type: 'AUTO_FILL' })}
          onToggleManualMode={() => dispatch({ type: 'TOGGLE_MANUAL_MODE' })}
          onClear={() => dispatch({ type: 'CLEAR_WELLS' })}
          onPaintWell={(wellKey) => dispatch({ type: 'PAINT_WELL', payload: wellKey })}
        />

        <RightPane
          selectedConditions={selectedConditions}
          viewMode={state.viewMode}
          groupByColumn={state.groupByColumn}
          onViewModeChange={(mode: ViewMode) => dispatch({ type: 'SET_VIEW_MODE', payload: mode })}
          onGroupByColumnChange={(col) => dispatch({ type: 'SET_GROUP_BY_COLUMN', payload: col })}
          onRemoveCondition={(id) => dispatch({ type: 'REMOVE_CONDITION', payload: id })}
          onHoverCondition={(id) => dispatch({ type: 'SET_HOVERED_CONDITION', payload: id })}
        />
      </Box>
    </Box>
  );
}
