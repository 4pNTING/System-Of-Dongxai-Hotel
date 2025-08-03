// src/app/(dashboard)/bookings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
// Removed problematic MUI icon import to fix vendor-chunks error

// Component Imports
import { BookingSeach } from '@/views/apps/booking/BookingSeach';
import BookingTable from '@views/apps/booking/BookingTable';
import BookingCards from '@views/apps/booking/BookingCards';
import { BookingDateRangePicker } from '@views/apps/booking/BookingDateRangePicker';
import BookingFormInput from '@views/apps/booking/components/BookingFormInput';

// Store Imports
import { useBookingStore } from '@core/infrastructure/store/booking/booking.store';
import { Booking } from '@core/domain/models/booking/list.model';

export default function BookingPage() {
  const {
    items: allBookings,
    fetchItems,
    confirmBooking,
    checkin: checkinBooking,
    cancel: cancelBooking,
    delete: deleteBooking,
    isLoading
  } = useBookingStore();

  const [searchValue, setSearchValue] = useState('');
  const [startDate, setStartDate] = useState(''); // เริ่มต้นแสดงข้อมูลทั้งหมด
  const [endDate, setEndDate] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data: session, status } = useSession();
  const isLoadingAuth = status === 'loading';

  const userRoleId = session?.user?.roleId ?
    (typeof session.user.roleId === 'string' ? parseInt(session.user.roleId, 10) : session.user.roleId) : 0;

  // กรองข้อมูลตาม date range และ search
  const filteredBookings = allBookings.filter(booking => {
    // กรองตาม search
    const roomId = booking.RoomId ? String(booking.RoomId) : '';
    const roomName = booking.room?.roomType?.TypeName || '';
    const customerName = booking.customer?.CustomerName || '';

    const matchesSearch = !searchValue ||
      String(booking.BookingId).includes(searchValue) ||
      roomId.includes(searchValue) ||
      roomName.toLowerCase().includes(searchValue.toLowerCase()) ||
      customerName.toLowerCase().includes(searchValue.toLowerCase());

    // กรองตามวันที่
    let matchesDate = true;
    if (startDate && endDate) {
      const bookingDate = new Date(booking.BookingDate);
      const filterStartDate = new Date(startDate);
      const filterEndDate = new Date(endDate);

      bookingDate.setHours(0, 0, 0, 0);
      filterStartDate.setHours(0, 0, 0, 0);
      filterEndDate.setHours(23, 59, 59, 999);

      matchesDate = bookingDate >= filterStartDate && bookingDate <= filterEndDate;
    }

    return matchesSearch && matchesDate;
  });

  // นับจำนวนตามสถานะ (เฉพาะที่ต้องการ)
  const pendingCount = filteredBookings.filter(b => b.StatusId === 1).length; // รอการยืนยัน
  const confirmedCount = filteredBookings.filter(b => b.StatusId === 2).length; // ยืนยันแล้ว
  const cancelledCount = filteredBookings.filter(b => b.StatusId === 5).length; // ยกเลิก

  // Handlers
  const handleConfirmBooking = async (booking: Booking) => {
    try {
      await confirmBooking(booking.BookingId);
      toast.success('ຢືນຢັນການຈອງສໍາເລັດແລ້ວ');
      fetchItems();
    } catch (error: any) {
      console.error('Error confirming booking:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການຢືນຢັນ: ' + (error.message || 'Unknown error'));
    }
  };

  const handleCheckinBooking = async (booking: Booking) => {
    try {
    
      await checkinBooking(booking.BookingId);
      toast.success('ເຊັກອິນສໍາເລັດແລ້ວ');
      fetchItems();
    } catch (error: any) {
      console.error('Error checking in booking:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການເຊັກອິນ 1: ' + (error.message || 'Unknown error'));
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    try {
  
      await cancelBooking(booking.BookingId);
      toast.success('ຍົກເລີກການຈອງສໍາເລັດແລ້ວ');
      fetchItems();
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກ: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteBooking = async (booking: Booking) => {
    try {
      if (window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບການຈອງນີ້?')) {
        toast.info('ກຳລັງດຳເນີນການລົບ...');
        await deleteBooking(booking.BookingId);
        toast.success('ລົບການຈອງສໍາເລັດແລ້ວ');
        fetchItems();
      }
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການລົບ: ' + (error.message || 'Unknown error'));
    }
  };

  const getRoleText = (roleId: number) => {
    switch (roleId) {
      case 1: return 'ຜູ້ດູແລລະບົບ';
      case 2: return 'ພະນັກງານຕ້ອນຮັບ';
      case 3: return 'ພະນັກງານທົ່ວໄປ';
      case 4: return 'ຜູ້ຈັດການ';
      default: return 'ບໍ່ຮູ້';
    }
  };

  const handleFilterChange = (value: string) => setSearchValue(value);

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: string) => setEndDate(date);

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  // Handlers for booking form
  const handleAddBooking = () => {
    setSelectedBooking(null);
    setIsFormOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedBooking(null);
  };

  const handleFormSaved = () => {
    setIsFormOpen(false);
    setSelectedBooking(null);
    fetchItems(); // Refresh the booking list
    toast.success('ບັນທຶກການຈອງສໍາເລັດແລ້ວ');
  };

  const hasDateFilter = Boolean(startDate && endDate);

  useEffect(() => {
    console.log("Loading booking data...");
    fetchItems();
  }, [fetchItems]);

  if (isLoadingAuth) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>ກຳລັງກວດສອບສິດການໃຊ້ງານ...</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={6}>
      {/* Header Section */}
      <Grid item xs={12}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="h4" fontWeight={600}>
            ການຈອງ
          </Typography>
        </Box>
      </Grid>

      {/* Statistics Cards */}
      <Grid item xs={12}>
        <BookingCards
          totalCount={filteredBookings.length}
          pendingCount={pendingCount}
          confirmedCount={confirmedCount}
          cancelledCount={cancelledCount}
        />
      </Grid>

      {/* Search and Table Section */}
      <Grid item xs={12}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <BookingSeach
                value={searchValue}
                onFilterChange={handleFilterChange}
              />
              <BookingDateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                onClearFilter={handleClearFilter}
                hasFilter={hasDateFilter}
              />
            </Box>
            
            <Button
              variant="contained"
              onClick={handleAddBooking}
              sx={{
                '&::before': {
                  content: '"+"',
                  marginRight: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }
              }}
            >
              ເພີ່ມການຈອງໃໝ່
            </Button>
          </Box>
        </Box>

        <BookingTable
          data={filteredBookings}
          loading={isLoading}
          onConfirm={handleConfirmBooking}
          onCheckin={handleCheckinBooking} 
          onCancel={handleCancelBooking}
          onDelete={handleDeleteBooking}
          onEdit={handleEditBooking}
          userRoleId={userRoleId}
        />
      </Grid>
      
      {/* Booking Form Dialog */}
      <BookingFormInput
        open={isFormOpen}
        onClose={handleCloseForm}
        selectedItem={selectedBooking}
        onSaved={handleFormSaved}
      />
    </Grid>
  );
}