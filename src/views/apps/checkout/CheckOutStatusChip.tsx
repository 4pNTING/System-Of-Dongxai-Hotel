import React from 'react';
import Chip from '@mui/material/Chip';

interface CheckOutStatusChipProps {
  type: 'checkin' | 'checkout';
  status: string;
  statusId?: number;
}

const CheckOutStatusChip: React.FC<CheckOutStatusChipProps> = ({ type, status, statusId }) => {
  let chipColor: 'success' | 'info' | 'warning' | 'default' = 'default';
  let statusText = status;

  if (type === 'checkin') {
    // สำหรับ checkin ที่กำลังพักอยู่ - พร้อมเช็คเอาต์
    if (status === 'checked_in') {
      chipColor = 'warning';
      statusText = 'ພ້ອມເຊັກເອົາ';
    }
  } else if (type === 'checkout') {
    // สำหรับ checkout ที่เสร็จสิ้นแล้ว
    chipColor = 'success';
    statusText = 'ເຊັກເອົາແລ້ວ';
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
        borderRadius: 1,
        animation: type === 'checkin' ? 'pulse 2s infinite' : 'none',
        '@keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.7 },
          '100%': { opacity: 1 }
        }
      }} 
    />
  );
};

export default CheckOutStatusChip;