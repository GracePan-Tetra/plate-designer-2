import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { PlateFormat } from '../../types';

interface Props {
  value: PlateFormat;
  onChange: (format: PlateFormat) => void;
}

export default function ExperimentScaleSelect({ value, onChange }: Props) {
  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value as PlateFormat);
  };

  return (
    <FormControl size="small" sx={{ width: 300 }}>
      <InputLabel>Experiment Scale</InputLabel>
      <Select value={value} label="Experiment Scale" onChange={handleChange}>
        <MenuItem value="48">48-well plate</MenuItem>
        <MenuItem value="96">96-well plate</MenuItem>
        <MenuItem value="384">384-well plate</MenuItem>
      </Select>
    </FormControl>
  );
}
