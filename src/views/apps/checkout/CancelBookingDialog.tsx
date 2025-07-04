// src/views/apps/checkin/CancelBookingDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField, Alert, CircularProgress, Divider, FormControl, InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Booking } from '@core/domain/models/booking/list.model';

interface CancelBookingDialogProps {
  open: boolean;
  booking: Booking | null;
  isProcessing?: boolean;
  onConfirm: (reason: string, refundAmount?: number) => void;
  onCancel: () => void;
}

export const CancelBookingDialog: React.FC<CancelBookingDialogProps> = ({
  open,
  booking,
  isProcessing = false,
  onConfirm,
  onCancel,
}) => {
  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [cancelType, setCancelType] = useState('customer_request');

  const formatDate = (date: string | Date): string => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('th-TH');
  };

  const handleConfirm = () => {
    if (!cancelReason.trim()) {
      alert('ກະລຸນາລະບຸເຫດຜົນການຍົກເລີກ');
      return;
    }
    onConfirm(cancelReason, refundAmount);
    // Reset form
    setCancelReason('');
    setRefundAmount(0);
    setCancelType('customer_request');
  };

  const handleCancel = () => {
    // Reset form
    setCancelReason('');
    setRefundAmount(0);
    setCancelType('customer_request');
    onCancel();
  };

  const getCancelReasonOptions = () => [
    { value: 'customer_request', label: 'ລູກຄ້າຂໍຍົກເລີກ' },
    { value: 'no_show', label: 'ລູກຄ້າບໍ່ມາ (No Show)' },
    { value: 'room_issue', label: 'ບັນຫາຫ້ອງພັກ' },
    { value: 'payment_failed', label: 'ບັນຫາການຊຳລະເງິນ' },
    { value: 'emergency', label: 'ເຫດສຸກເສີນ' },
    { value: 'other', label: 'ອື່ນໆ' }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <WarningIcon color="error" fontSize="large" />
          <Box>
            <Typography variant="h6" color="error" fontWeight="bold">
              ຢືນຢັນການຍົກເລີກການຈອງ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              #{booking?.BookingId}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {booking && (
          <Box>
            {/* Warning Alert */}
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>ຄຳເຕືອນ:</strong> ການຍົກເລີກການຈອງນີ້ຈະບໍ່ສາມາດກູ້ຄືນໄດ້
              </Typography>
            </Alert>

            {/* Booking Details */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" mb={2}>
                ລາຍລະອຽດການຈອງ
              </Typography>
              
              <Box display="flex" alignItems="center" mb={1}>
                <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>ລູກຄ້າ:</strong> {booking.customer?.CustomerName || 'N/A'}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <RoomIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>ຫ້ອງ:</strong> {booking.RoomId}
                  {booking.room?.roomType?.TypeName && ` - ${booking.room.roomType.TypeName}`}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>ເຂົ້າພັກ:</strong> {formatDate(booking.CheckinDate)}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>ອອກຈາກຫ້ອງ:</strong> {formatDate(booking.CheckoutDate)}
                </Typography>
              </Box>

              <Box mt={2}>
                <Chip
                  label="ຢືນຢັນແລ້ວ - ພ້ອມເຊັກອິນ"
                  color="info"
                  size="small"
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Cancel Type Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>ປະເພດການຍົກເລີກ</InputLabel>
              <Select
                value={cancelType}
                label="ປະເພດການຍົກເລີກ"
                onChange={(e) => setCancelType(e.target.value)}
              >
                {getCancelReasonOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Cancel Reason */}
            <TextField
              fullWidth
              label="ເຫດຜົນການຍົກເລີກ"
              multiline
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="ກະລຸນາລະບຸເຫດຜົນການຍົກເລີກຢ່າງລະອຽດ..."
              required
              sx={{ mb: 2 }}
              helperText="ຈຳເປັນຕ້ອງລະບຸເຫດຜົນ"
            />

            {/* Refund Amount */}
            <TextField
              fullWidth
              label="ຈຳນວນເງິນຄືນ (ລາວກີບ)"
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(Number(e.target.value))}
              InputProps={{
                inputProps: { min: 0 }
              }}
              sx={{ mb: 2 }}
              helperText="ລະບຸຈຳນວນເງິນທີ່ຈະຄືນໃຫ້ລູກຄ້າ (ຖ້າມີ)"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleCancel} 
          disabled={isProcessing}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          ຍົກເລີກ
        </Button>
        <Button 
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={isProcessing || !cancelReason.trim()}
          startIcon={isProcessing ? <CircularProgress size={20} /> : <CancelIcon />}
          sx={{ minWidth: 120 }}
        >
          {isProcessing ? 'ກຳລັງດຳເນີນການ...' : 'ຢືນຢັນຍົກເລີກ'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};