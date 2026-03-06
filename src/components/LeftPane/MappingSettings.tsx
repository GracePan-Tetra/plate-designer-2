import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PlateFormat } from '../../types';
import { getWellOptions } from '../../utils/serpentine';

interface Props {
  plateFormat: PlateFormat;
  fillStrategy: 'snake';
  startWell: string;
  replicates: number;
  onFillStrategyChange: (val: 'snake') => void;
  onStartWellChange: (val: string) => void;
  onReplicatesChange: (val: number) => void;
}

export default function MappingSettings({
  plateFormat,
  fillStrategy,
  startWell,
  replicates,
  onFillStrategyChange,
  onStartWellChange,
  onReplicatesChange,
}: Props) {
  const wellOptions = getWellOptions(plateFormat);

  return (
    <Box>
      {/* Fill Strategy */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Fill Strategy
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <Select
          value={fillStrategy}
          onChange={(e) => onFillStrategyChange(e.target.value as 'snake')}
        >
          <MenuItem value="snake">Snake</MenuItem>
        </Select>
      </FormControl>

      {/* Start Well + Replicates */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Start Well (eg.A1)
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={startWell}
              onChange={(e) => onStartWellChange(e.target.value)}
              MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
            >
              {wellOptions.map((w) => (
                <MenuItem key={w} value={w}>{w}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Replicates
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={replicates}
            inputProps={{ min: 1, max: 48 }}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val >= 1) onReplicatesChange(val);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
