// src/views/apps/booking/BookingFilter.tsx
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// Removed SearchIcon import to fix vendor-chunks error
import Box from '@mui/material/Box';

interface BookingSeachrProps {
  value: string;
  onFilterChange: (value: string) => void;
}

export const BookingSeach = ({ value, onFilterChange }: BookingSeachrProps) => {
  return (
    <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
      <TextField
        size="small"
        value={value}
        onChange={e => onFilterChange(e.target.value)}
        placeholder="ຄົ້ນຫາດ້ວຍລະຫັດການຈອງ, ຫ້ອງພັກ ຫຼື ລູກຄ້າ"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <span style={{ fontSize: '18px', color: '#666' }}>🔍</span>
            </InputAdornment>
          )
        }}
        sx={{ minWidth: '250px' }}
      />
    </Box>
  );
};