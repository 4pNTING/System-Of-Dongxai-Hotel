import React from 'react';
import Chip from '@mui/material/Chip';

interface PaymentStatusChipProps {
  status: string;
  statusId?: number;
}

const PaymentStatusChip: React.FC<PaymentStatusChipProps> = ({ status, statusId }) => {
  let chipColor: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
  let statusText = status;

  // สถานะการชำระเงิน
  switch (status) {
    case 'paid':
    case 'completed':
      chipColor = 'success';
      statusText = 'ຊຳລະແລ້ວ';
      break;
    case 'pending':
      chipColor = 'warning';
      statusText = 'ລໍຖ້າຊຳລະ';
      break;
    case 'failed':
    case 'cancelled':
      chipColor = 'error';
      statusText = 'ລົ້ມເຫຼວ';
      break;
    case 'refunded':
      chipColor = 'info';
      statusText = 'ຄືນເງິນແລ້ວ';
      break;
    case 'partial':
      chipColor = 'warning';
      statusText = 'ບາງສ່ວນ';
      break;
    default:
      statusText = status || 'ບໍ່ຮູ້ສະຖານະ';
      break;
  }

  // ใช้ statusId ถ้ามี
  if (statusId) {
    switch (statusId) {
      case 1:
        chipColor = 'success';
        statusText = 'ຊຳລະແລ້ວ';
        break;
      case 2:
        chipColor = 'warning';
        statusText = 'ລໍຖ້າຊຳລະ';
        break;
      case 3:
        chipColor = 'error';
        statusText = 'ລົ້ມເຫຼວ';
        break;
      case 4:
        chipColor = 'info';
        statusText = 'ຄືນເງິນແລ້ວ';
        break;
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

export default PaymentStatusChip;
