import React from 'react';
import Chip from '@mui/material/Chip';

interface CheckOutStatusChipProps {
  status: 'completed' | 'today' | 'recent';
  checkoutDate: Date | string;
}

const CheckOutStatusChip: React.FC<CheckOutStatusChipProps> = ({ status, checkoutDate }) => {
  let chipColor: 'success' | 'info' | 'default' = 'default';
  let statusText = 'ເຊັກເອົາແລ້ວ';

  const today = new Date();
  const checkout = new Date(checkoutDate);
  const diffTime = today.getTime() - checkout.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    chipColor = 'success';
    statusText = 'ເຊັກເອົາວັນນີ້';
  } else if (diffDays <= 7) {
    chipColor = 'info';
    statusText = `${diffDays} ວັນທີ່ຜ່ານມາ`;
  } else {
    chipColor = 'default';
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
        borderRadius: 1
      }} 
    />
  );
};

export default CheckOutStatusChip;