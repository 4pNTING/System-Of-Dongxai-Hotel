// src/views/apps/booking/BookingDateRangePicker.tsx
import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

interface BookingDateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClearFilter: () => void;
  hasFilter: boolean;
}

export const BookingDateRangePicker: React.FC<BookingDateRangePickerProps> = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  onClearFilter,
  hasFilter
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  const getDateLabel = () => {
    if (!hasFilter) return 'ທັງໝົດ';
    
    if (startDate === endDate) {
      if (startDate === today) return 'ວັນນີ້';
      return new Date(startDate).toLocaleDateString('th-TH');
    }
    
    return `${new Date(startDate).toLocaleDateString('th-TH')} - ${new Date(endDate).toLocaleDateString('th-TH')}`;
  };

  const setToday = () => {
    onStartDateChange(today);
    onEndDateChange(today);
  };

  const setThisWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    onStartDateChange(startOfWeek.toISOString().split('T')[0]);
    onEndDateChange(endOfWeek.toISOString().split('T')[0]);
  };

  const setThisMonth = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    onStartDateChange(startOfMonth.toISOString().split('T')[0]);
    onEndDateChange(endOfMonth.toISOString().split('T')[0]);
  };

  const setPreviousMonth = () => {
    const now = new Date();
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    onStartDateChange(startOfPrevMonth.toISOString().split('T')[0]);
    onEndDateChange(endOfPrevMonth.toISOString().split('T')[0]);
  };

  const setNextMonth = () => {
    const now = new Date();
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    
    onStartDateChange(startOfNextMonth.toISOString().split('T')[0]);
    onEndDateChange(endOfNextMonth.toISOString().split('T')[0]);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        type="date"
        label="ຈາກວັນທີ"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        size="small"
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 150 }}
      />
      
      <TextField
        type="date"
        label="ຫາວັນທີ"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        size="small"
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 150 }}
        inputProps={{ min: startDate }}
      />

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={setToday}
          sx={{ whiteSpace: 'nowrap' }}
        >
          ວັນນີ້
        </Button>
        
        <Button 
          variant="outlined" 
          size="small" 
          onClick={setThisWeek}
          sx={{ whiteSpace: 'nowrap' }}
        >
          ອາທິດນີ້
        </Button>
        
        <Button 
          variant="outlined" 
          size="small" 
          onClick={setThisMonth}
          sx={{ whiteSpace: 'nowrap' }}
        >
          ເດືອນນີ້
        </Button>
        
        {hasFilter && (
          <Button 
            variant="outlined" 
            color="secondary"
            size="small" 
            onClick={onClearFilter}
            sx={{ whiteSpace: 'nowrap' }}
          >
            ລົບຕົວກອງ
          </Button>
        )}
      </Box>

      <Chip 
        label={getDateLabel()} 
        color={hasFilter ? "primary" : "default"}
        variant={hasFilter ? "filled" : "outlined"}
        size="small"
      />
    </Box>
  );
};