// src/views/apps/checkin/CheckInStatusFilter.tsx
import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface CheckInStatus {
  StatusId: number;
  StatusName: string;
}

interface CheckInStatusFilterProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  checkInStatuses: CheckInStatus[];
}

export const CheckInStatusFilter: React.FC<CheckInStatusFilterProps> = ({ 
  statusFilter, 
  onStatusFilterChange,
  checkInStatuses = []
}) => {
  // Log incoming props for debugging
  console.log('CheckInStatusFilter props:', { statusFilter, checkInStatuses });

  const loading = checkInStatuses.length === 0;
  
  return (
    <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
      <FormControl size="small" sx={{ minWidth: '200px' }}>
        <InputLabel id="checkin-status-filter-label">ສະຖານະເຊັກອິນ</InputLabel>
        <Select
          labelId="checkin-status-filter-label"
          id="checkin-status-filter"
          value={statusFilter}
          label="ສະຖານະເຊັກອິນ"
          onChange={e => onStatusFilterChange(e.target.value)}
          startAdornment={loading ? (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          ) : null}
        >
          <MenuItem value="">ທັງໝົດ</MenuItem>
          {checkInStatuses.map(status => (
            <MenuItem key={status.StatusId} value={status.StatusName}>
              {status.StatusName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};