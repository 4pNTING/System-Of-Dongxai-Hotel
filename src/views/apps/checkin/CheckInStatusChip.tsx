import React from 'react';
import Chip from '@mui/material/Chip';

interface CheckInStatusChipProps {
  type: 'booking' | 'checkin';
  status: string;
  statusId?: number;
}

const CheckInStatusChip: React.FC<CheckInStatusChipProps> = ({ type, status, statusId }) => {
  let chipColor: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
  let statusText = status;

  if (type === 'booking') {
    // สำหรับ booking ที่พร้อมเช็คอิน
    if (statusId === 2 || status === 'confirmed') {
      chipColor = 'success';
      statusText = 'ພ້ອມເຊັກອິນ';
    } else if (statusId === 3) {
      chipColor = 'info';
      statusText = 'ເຊັກອິນແລ້ວ';
    }
  } else if (type === 'checkin') {
    // สำหรับ check-in ที่มีอยู่แล้ว - แสดงเฉพาะสถานะ checked_in
    if (status === 'checked_in') {
      chipColor = 'success';
      statusText = 'ກຳລັງພັກ';
    }
  }

  return (
    <Chip 
      label={statusText} 
      color={chipColor} 
      size="small"
      sx={{ 
        fontWeight: 500,
        fontSize: '0.75rem',
        height: 24,
        minWidth: 80,
        borderRadius: 1
      }} 
    />
  );
};

export default CheckInStatusChip;