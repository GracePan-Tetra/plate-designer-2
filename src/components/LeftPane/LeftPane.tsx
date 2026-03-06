import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ScienceIcon from '@mui/icons-material/Science';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { PlateFormat, Condition } from '../../types';
import ExperimentScaleSelect from './ExperimentScaleSelect';
import ConditionsTable from './ConditionsTable';
import MappingSettings from './MappingSettings';

interface SectionHeaderProps {
  label: string;
  open: boolean;
  onToggle: () => void;
  badge?: string;
}

function SectionHeader({ label, open, onToggle, badge }: SectionHeaderProps) {
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 1.25,
        cursor: 'pointer',
        userSelect: 'none',
        '&:hover': { bgcolor: '#F9FAFB' },
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, letterSpacing: '0.08em', color: 'text.secondary', textTransform: 'uppercase', flex: 1 }}
      >
        {label}
      </Typography>
      {badge && (
        <Chip
          label={badge}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.7rem',
            fontWeight: 600,
            bgcolor: '#EDE9FE',
            color: '#5B21B6',
            mr: 1,
            '& .MuiChip-label': { px: 1 },
          }}
        />
      )}
      <ChevronRightIcon
        sx={{
          fontSize: '1rem',
          color: 'text.secondary',
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
      />
    </Box>
  );
}

interface Props {
  plateFormat: PlateFormat;
  conditions: Condition[];
  selectedIds: string[];
  page: number;
  isExpanded: boolean;
  isCollapsed: boolean;
  fillStrategy: 'snake';
  startWell: string;
  replicates: number;
  onFormatChange: (format: PlateFormat) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onPageChange: (page: number) => void;
  onToggleExpand: () => void;
  onToggleCollapse: () => void;
  onFillStrategyChange: (val: 'snake') => void;
  onStartWellChange: (val: string) => void;
  onReplicatesChange: (val: number) => void;
  onApplyMapping: () => void;
}

export default function LeftPane({
  plateFormat,
  conditions,
  selectedIds,
  page,
  isExpanded,
  isCollapsed,
  fillStrategy,
  startWell,
  replicates,
  onFormatChange,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onPageChange,
  onToggleExpand,
  onToggleCollapse,
  onFillStrategyChange,
  onStartWellChange,
  onReplicatesChange,
  onApplyMapping,
}: Props) {
  const [scaleOpen, setScaleOpen] = useState(true);
  const [conditionsOpen, setConditionsOpen] = useState(true);
  const [mappingOpen, setMappingOpen] = useState(true);

  const width = isCollapsed ? 48 : isExpanded ? '50vw' : '40%';

  // Collapsed panel — slim sidebar
  if (isCollapsed) {
    return (
      <Box
        sx={{
          width: 48,
          flexShrink: 0,
          borderRight: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 1.5,
          bgcolor: 'background.paper',
          height: '100%',
          transition: 'width 0.25s ease',
        }}
      >
        <Tooltip title="Expand Configuration" placement="right">
          <IconButton size="small" onClick={onToggleCollapse}>
            <MenuIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <ScienceIcon sx={{ fontSize: '1.1rem', color: 'text.secondary', mt: 1 }} />
      </Box>
    );
  }

  const conditionsBadge = `${selectedIds.length}/${conditions.length}`;

  return (
    <Box
      sx={{
        width,
        flexShrink: 0,
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        transition: 'width 0.25s ease',
      }}
    >
      {/* Configuration header */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
        <ScienceIcon sx={{ fontSize: '1.1rem', color: 'primary.main', mr: 1 }} />
        <Typography variant="subtitle1" fontWeight={700}>Configuration</Typography>
        <Tooltip title="Collapse panel" placement="left">
          <IconButton size="small" onClick={onToggleCollapse} sx={{ ml: 'auto' }}>
            <MenuOpenIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Scrollable sections */}
      <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* ── EXPERIMENT SCALE ── */}
        <Divider />
        <SectionHeader label="Experiment Scale" open={scaleOpen} onToggle={() => setScaleOpen((v) => !v)} />
        <Collapse in={scaleOpen} timeout="auto">
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
              Modality
            </Typography>
            <ExperimentScaleSelect value={plateFormat} onChange={onFormatChange} />
          </Box>
        </Collapse>

        {/* ── SELECT CONDITIONS ── */}
        <Divider />
        <SectionHeader
          label="Select Conditions"
          open={conditionsOpen}
          onToggle={() => setConditionsOpen((v) => !v)}
          badge={conditionsBadge}
        />
        <Collapse in={conditionsOpen} timeout="auto" sx={{ flex: conditionsOpen ? 1 : 'none', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, overflow: 'hidden', px: 2, pb: 1, display: 'flex', flexDirection: 'column', minHeight: 320 }}>
            <ConditionsTable
              conditions={conditions}
              selectedIds={selectedIds}
              page={page}
              isExpanded={isExpanded}
              onToggleSelect={onToggleSelect}
              onSelectAll={onSelectAll}
              onDeselectAll={onDeselectAll}
              onPageChange={onPageChange}
              onToggleExpand={onToggleExpand}
            />
          </Box>
        </Collapse>

        {/* ── MAPPING SETTING ── */}
        <Divider />
        <SectionHeader label="Mapping Setting" open={mappingOpen} onToggle={() => setMappingOpen((v) => !v)} />
        <Collapse in={mappingOpen} timeout="auto">
          <Box sx={{ px: 2, pb: 2 }}>
            <MappingSettings
              plateFormat={plateFormat}
              fillStrategy={fillStrategy}
              startWell={startWell}
              replicates={replicates}
              onFillStrategyChange={onFillStrategyChange}
              onStartWellChange={onStartWellChange}
              onReplicatesChange={onReplicatesChange}
            />
          </Box>
        </Collapse>

        <Divider />
      </Box>

      {/* APPLY MAPPING — sticky bottom */}
      <Box sx={{ p: 2, borderTop: '1px solid #E5E7EB', flexShrink: 0 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={selectedIds.length === 0}
          onClick={onApplyMapping}
          sx={{ fontWeight: 700, letterSpacing: '0.06em', py: 1.25 }}
        >
          Apply Mapping
        </Button>
      </Box>
    </Box>
  );
}
