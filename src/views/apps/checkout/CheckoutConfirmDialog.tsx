// src/views/apps/checkout/components/CheckoutConfirmDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
  Typography,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { CheckIn } from '@core/domain/models/check-in/list.model';

interface CheckoutConfirmDialogProps {
  open: boolean;
  checkIn: CheckIn | null;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('th-TH');
};

const calculateStayDuration = (checkInDate: string | Date, checkOutDate: string | Date): string => {
  if (!checkInDate || !checkOutDate) return 'N/A';
  
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return `${diffDays} ຄືນ`;
};

const calculateTotalAmount = (checkIn: CheckIn): number => {
  if (!checkIn.room?.RoomPrice || !checkIn.CheckInDate || !checkIn.CheckoutDate) return 0;
  
  const checkInDate = new Date(checkIn.CheckInDate);
  const checkOutDate = new Date(checkIn.CheckoutDate);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return checkIn.room.RoomPrice * numberOfNights;
};

const CheckoutConfirmDialog: React.FC<CheckoutConfirmDialogProps> = ({
  open,
  checkIn,
  isProcessing,
  onConfirm,
  onCancel
}) => {
  if (!checkIn) return null;

  const stayDuration = calculateStayDuration(checkIn.CheckInDate, checkIn.CheckoutDate);
  const totalAmount = calculateTotalAmount(checkIn);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <ExitToAppIcon color="primary" fontSize="large" />
          <Box>
            <Typography variant="h6" color="primary" fontWeight="bold">
              ຢືນຢັນການເຊັກເອົາ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check-in ID: #{checkIn.CheckInId}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການເຊັກເອົາສຳລັບການພັກນີ້?
        </DialogContentText>
        
        {/* ข้อมูล Check-in */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" mb={2}>
            ລາຍລະອຽດການພັກ
          </Typography>
          
          <Box display="flex" alignItems="center" mb={1}>
            <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              <strong>ລູກຄ້າ:</strong> {checkIn.customer?.CustomerName || 'N/A'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <RoomIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              <strong>ຫ້ອງ:</strong> {checkIn.RoomId}
              {checkIn.room?.roomType?.TypeName && ` - ${checkIn.room.roomType.TypeName}`}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              <strong>ເຂົ້າພັກ:</strong> {formatDate(checkIn.CheckInDate)}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              <strong>ກຳນົດອອກ:</strong> {formatDate(checkIn.CheckoutDate)}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Chip
              label={`ພັກ ${stayDuration}`}
              color="info"
              size="small"
            />
            <Chip
              label="ກຳລັງພັກ"
              color="success"
              size="small"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* สรุปค่าใช้จ่าย */}
        <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" mb={1}>
            ສະຫຼຸບຄ່າໃຊ້ຈ່າຍ
          </Typography>
          
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">ລາຄາຫ້ອງຕໍ່ຄືນ:</Typography>
            <Typography variant="body2">
              {checkIn.room?.RoomPrice?.toLocaleString() || 0} ກີບ
            </Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">ຈຳນວນຄືນ:</Typography>
            <Typography variant="body2">{stayDuration}</Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1" fontWeight="bold">ລວມທັງໝົດ:</Typography>
            <Typography variant="body1" fontWeight="bold" color="primary">
              {totalAmount.toLocaleString()} ກີບ
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2, p: 1, bgcolor: 'warning.50', borderRadius: 1 }}>
          <Typography variant="body2" color="warning.main">
            <strong>ໝາຍເຫດ:</strong> ການເຊັກເອົານີ້ຈະບໍ່ສາມາດຍົກເລີກໄດ້
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onCancel} 
          disabled={isProcessing}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          ຍົກເລີກ
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="primary"
          disabled={isProcessing}
          startIcon={isProcessing ? <CircularProgress size={20} /> : <ExitToAppIcon />}
          sx={{ minWidth: 120 }}
        >
          {isProcessing ? 'ກຳລັງດຳເນີນການ...' : 'ຢືນຢັນເຊັກເອົາ'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutConfirmDialog;