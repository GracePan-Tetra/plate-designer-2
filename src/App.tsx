import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { usePlateState } from './hooks/usePlateState';
import { mockConditions, CATEGORICAL_COLORS } from './data/mockConditions';
import { closestCenter } from '@dnd-kit/core';
import { GROUPABLE_COLUMNS } from './data/conditionColumns';
import { getGradientColor } from './utils/colorUtils';
import LeftPane from './components/LeftPane/LeftPane';
import CenterPane from './components/CenterPane/CenterPane';
import RightPane from './components/RightPane/RightPane';
import { ViewMode } from './types';

function DragConditionChip({ conditionId }: { conditionId: string }) {
  const condition = mockConditions.find((c) => c.id === conditionId);
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 1,
      px: 1.5, py: 0.75, bgcolor: 'background.paper',
      border: '1px solid #E5E7EB', borderRadius: 1,
      boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
      userSelect: 'none', pointerEvents: 'none',
    }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: condition?.color ?? '#E5E7EB', flexShrink: 0 }} />
      <Typography variant="caption" fontWeight={600}>{conditionId}</Typography>
    </Box>
  );
}

export default function App() {
  const { state, dispatch } = usePlateState();
  const [leftPaneExpanded, setLeftPaneExpanded] = useState(false);
  const [leftPaneCollapsed, setLeftPaneCollapsed] = useState(false);
  const [activeDragConditionId, setActiveDragConditionId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragConditionId(event.active.data.current?.conditionId ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.data.current?.conditionId) {
      dispatch({ type: 'ASSIGN_CONDITION_TO_WELL', payload: { wellKey: over.id as string, conditionId: active.data.current.conditionId } });
    }
    setActiveDragConditionId(null);
  };

  const selectedConditions = state.selectedConditionIds
    .map((id) => mockConditions.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  // Dynamic well colors based on visualization mode
  const getDisplayColor = useMemo(() => {
    if (state.viewMode !== 'column' || !state.groupByColumn) return undefined;
    const colDef = GROUPABLE_COLUMNS.find((c) => c.field === state.groupByColumn);
    if (!colDef) return undefined;
    const field = state.groupByColumn;

    if (colDef.type === 'number') {
      const allValues = mockConditions.map((c) => (c as unknown as Record<string, number>)[field]);
      const nonZero = allValues.filter((v) => v > 0);
      const min = nonZero.length ? Math.min(...nonZero) : 0;
      const max = nonZero.length ? Math.max(...nonZero) : 0;
      return (conditionId: string) => {
        const condition = mockConditions.find((c) => c.id === conditionId);
        if (!condition) return '#E5E7EB';
        return getGradientColor((condition as unknown as Record<string, number>)[field], min, max);
      };
    } else {
      const distinctValues = [...new Set(mockConditions.map((c) => String((c as unknown as Record<string, unknown>)[field])))].sort();
      return (conditionId: string) => {
        const condition = mockConditions.find((c) => c.id === conditionId);
        if (!condition) return '#E5E7EB';
        const val = String((condition as unknown as Record<string, unknown>)[field]);
        return CATEGORICAL_COLORS[distinctValues.indexOf(val) % CATEGORICAL_COLORS.length];
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <LeftPane
          plateFormat={state.plateFormat}
          conditions={mockConditions}
          selectedIds={state.selectedConditionIds}
          page={state.page}
          isExpanded={leftPaneExpanded}
          isCollapsed={leftPaneCollapsed}
          fillStrategy={state.fillStrategy}
          startWell={state.startWell}
          replicates={state.replicates}
          onFormatChange={(format) => dispatch({ type: 'SET_PLATE_FORMAT', payload: format })}
          onToggleSelect={(id) => dispatch({ type: 'TOGGLE_CONDITION_SELECTION', payload: id })}
          onSelectAll={() => dispatch({ type: 'SELECT_ALL_CONDITIONS' })}
          onDeselectAll={() => dispatch({ type: 'DESELECT_ALL_CONDITIONS' })}
          onPageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
          onToggleExpand={() => setLeftPaneExpanded((v) => !v)}
          onToggleCollapse={() => { setLeftPaneCollapsed((v) => !v); setLeftPaneExpanded(false); }}
          onFillStrategyChange={(val) => dispatch({ type: 'SET_FILL_STRATEGY', payload: val })}
          onStartWellChange={(val) => dispatch({ type: 'SET_START_WELL', payload: val })}
          onReplicatesChange={(val) => dispatch({ type: 'SET_REPLICATES', payload: val })}
          onApplyMapping={() => dispatch({ type: 'APPLY_MAPPING' })}
        />

        <CenterPane
          plateFormat={state.plateFormat}
          wellMap={state.wellMap}
          hoveredConditionId={state.hoveredConditionId}
          hasSelectedConditions={state.selectedConditionIds.length > 0}
          isLeftCollapsed={leftPaneCollapsed}
          getDisplayColor={getDisplayColor}
          onClear={() => dispatch({ type: 'CLEAR_WELLS' })}
          onPaintWell={(wellKey) => dispatch({ type: 'PAINT_WELL', payload: wellKey })}
        />

        <RightPane
          selectedConditions={selectedConditions}
          viewMode={state.viewMode}
          groupByColumn={state.groupByColumn}
          isLeftCollapsed={leftPaneCollapsed}
          onViewModeChange={(mode: ViewMode) => dispatch({ type: 'SET_VIEW_MODE', payload: mode })}
          onGroupByColumnChange={(col) => dispatch({ type: 'SET_GROUP_BY_COLUMN', payload: col })}
          onRemoveCondition={(id) => dispatch({ type: 'REMOVE_CONDITION', payload: id })}
          onHoverCondition={(id) => dispatch({ type: 'SET_HOVERED_CONDITION', payload: id })}
        />
      </Box>
      <DragOverlay dropAnimation={null}>
        {activeDragConditionId && <DragConditionChip conditionId={activeDragConditionId} />}
      </DragOverlay>
      </DndContext>
    </Box>
  );
}
