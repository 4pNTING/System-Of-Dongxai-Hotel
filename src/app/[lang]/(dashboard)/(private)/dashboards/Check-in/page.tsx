// src/app/(dashboard)/checkins/page.tsx (Updated - Remove Checkout Functions)
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Component Imports
import { CheckInSearch } from '@/views/apps/checkin/CheckinSearch';
import CheckInTable from '@views/apps/checkin/CheckInTable';
import CheckInCards from '@views/apps/checkin/CheckinCard';
import { DateRangePicker } from '@views/apps/checkin/DateRangePicker';

// Store Imports
import { useCheckInStore } from '@core/infrastructure/store/checkin/checkin.store';
import { useBookingStore } from '@core/infrastructure/store/booking/booking.store';

export default function CheckInPage() {
  const { 
    items: checkIns,
    stats,
    fetchItems: fetchCheckIns,
    fetchStats,
    checkinBooking,
    delete: deleteCheckIn,
    isLoading: checkInLoading
  } = useCheckInStore();
  
  const {
    items: bookings,
    fetchItems: fetchBookings,
    cancel: cancelBooking,
    isLoading: bookingLoading
  } = useBookingStore();
  
  const [searchValue, setSearchValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { data: session, status } = useSession();
  const isLoadingAuth = status === 'loading';
  
  const userRoleId = session?.user?.roleId ?  
    (typeof session.user.roleId === 'string' ? parseInt(session.user.roleId, 10) : session.user.roleId) : 0;

  // กรองข้อมูล Check-ins และ Bookings ที่เกี่ยวข้อง
  const relevantBookings = bookings.filter(booking => {
    // แสดงเฉพาะ booking ที่ยืนยันแล้ว (StatusId: 2)
    return booking.StatusId === 2;
  });

  // รวมข้อมูล check-ins และ relevant bookings
  const allItems = [
    // แสดงเฉพาะ check-ins ที่กำลังพัก (ยังไม่ checkout)
    ...checkIns
      .filter(checkIn => !checkIn.checkOuts || checkIn.checkOuts.length === 0)
      .map(checkIn => ({
        ...checkIn,
        type: 'checkin' as const,
        status: 'checked_in'
      })),
    // แสดงเฉพาะ bookings ที่ยังไม่ได้ check-in
    ...relevantBookings
      .filter(booking => !checkIns.some(checkIn => checkIn.BookingId === booking.BookingId))
      .map(booking => ({
        ...booking,
        type: 'booking' as const,
        status: 'confirmed'
      }))
  ];

  // กรองตามค้นหาและวันที่
  const filteredItems = allItems.filter(item => {
    // กรองตาม search
    const roomId = item.RoomId ? String(item.RoomId) : '';
    const roomName = item.room?.roomType?.TypeName || '';
    const customerName = item.customer?.CustomerName || '';
    const itemId = item.type === 'checkin' ? String(item.CheckInId) : String(item.BookingId);

    const matchesSearch = !searchValue ||
      itemId.includes(searchValue) ||
      roomId.includes(searchValue) ||
      roomName.toLowerCase().includes(searchValue.toLowerCase()) ||
      customerName.toLowerCase().includes(searchValue.toLowerCase());

    // กรองตามวันที่
    let matchesDate = true;
    if (startDate && endDate) {
      const itemDate = item.type === 'checkin' 
        ? new Date(item.CheckInDate)
        : new Date(item.CheckinDate);
      const filterStartDate = new Date(startDate);
      const filterEndDate = new Date(endDate);

      itemDate.setHours(0, 0, 0, 0);
      filterStartDate.setHours(0, 0, 0, 0);
      filterEndDate.setHours(23, 59, 59, 999);

      matchesDate = itemDate >= filterStartDate && itemDate <= filterEndDate;
    }

    return matchesSearch && matchesDate;
  });

  // นับจำนวนตามสถานะ
  const readyToCheckinCount = filteredItems.filter(item => 
    item.type === 'booking' && item.status === 'confirmed'
  ).length;
  
  const checkedInCount = filteredItems.filter(item => 
    item.type === 'checkin' && item.status === 'checked_in'
  ).length;

  // Handlers
  const handleCheckinBooking = async (item: any) => {
    try {
      toast.info('ກຳລັງດຳເນີນການເຊັກອິນ...');
      
      const bookingId = item.type === 'booking' ? item.BookingId : item.BookingId;
      await checkinBooking(bookingId);
      
      toast.success('ເຊັກອິນສໍາເລັດແລ້ວ');
      
      // Refresh ข้อมูล
      await Promise.all([fetchCheckIns(), fetchBookings(), fetchStats()]);
      
    } catch (error: any) {
      console.error('Error checking in:', error);
      
      if (error.message?.includes('already been checked in')) {
        toast.warning('Booking ນີ້ໄດ້ຖືກເຊັກອິນໄປແລ້ວ');
        await Promise.all([fetchCheckIns(), fetchBookings()]);
      } else {
        toast.error('ເກີດຂໍ້ຜິດພາດໃນການເຊັກອິນ: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleCancel = async (item: any) => {
    try {
      toast.info('ກຳລັງດຳເນີນການຍົກເລີກ...');
      
      if (item.type === 'booking') {
        await cancelBooking(item.BookingId);
      } else {
        toast.error('ບໍ່ສາມາດຍົກເລີກການເຊັກອິນທີ່ດຳເນີນການແລ້ວໄດ້');
        return;
      }
      
      toast.success('ຍົກເລີກສໍາເລັດແລ້ວ');
      
      // Refresh ข้อมูล
      await Promise.all([fetchCheckIns(), fetchBookings()]);
      
    } catch (error: any) {
      console.error('Error cancelling:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກ: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (item: any) => {
    try {
      if (window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບລາຍການນີ້?')) {
        toast.info('ກຳລັງດຳເນີນການລົບ...');
        
        if (item.type === 'checkin') {
          await deleteCheckIn(item.CheckInId);
        } else {
          toast.error('ບໍ່ສາມາດລົບ Booking ໄດ້ຈາກໜ້ານີ້');
          return;
        }
        
        toast.success('ລົບສໍາເລັດແລ້ວ');
        await fetchCheckIns();
      }
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການລົບ: ' + (error.message || 'Unknown error'));
    }
  };

  // Event handlers
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
  
  const hasDateFilter = Boolean(startDate && endDate);
  
  useEffect(() => {
    console.log("Loading check-in and booking data...");
    Promise.all([
      fetchCheckIns(),
      fetchBookings(),
      fetchStats()
    ]);
  }, [fetchCheckIns, fetchBookings, fetchStats]);
  
  if (isLoadingAuth) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress size={40} />
        <Typography sx={{ ml: 2 }}>ກຳລັງກວດສອບສິດການໃຊ້ງານ...</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={6}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" fontWeight={600} color="text.primary">
              ການຈັດການເຊັກອິນ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              ຈັດການການເຊັກອິນຂອງລູກຄ້າ ແລະ ການຈອງທີ່ພ້ອມເຊັກອິນ
            </Typography>
          </Box>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12}>
          <CheckInCards 
            totalCount={filteredItems.length}
            pendingCount={readyToCheckinCount}
            checkedInCount={checkedInCount}
            customLabels={{
              pending: 'ພ້ອມເຊັກອິນ',
              confirmed: 'ເຊັກອິນແລ້ວ'
            }}
          />
        </Grid>

        {/* Search and Filters Section */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 3, 
            flexWrap: 'wrap', 
            alignItems: 'center',
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}>
            <CheckInSearch
              value={searchValue}
              onFilterChange={handleFilterChange}
              placeholder="ຄົ້ນຫາ Check-in ID, Booking ID, ຫ້ອງ, ຫຼື ລູກຄ້າ..."
            />
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onClearFilter={handleClearFilter}
              hasFilter={hasDateFilter}
            />
          </Box>

          {/* Results Summary */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              ພົບ {filteredItems.length} ລາຍການ
              {hasDateFilter && (
                <span>
                  {' '}ໃນຊ່ວງ {new Date(startDate).toLocaleDateString('th-TH')} - {new Date(endDate).toLocaleDateString('th-TH')}
                </span>
              )}
              <span className="ml-4">
                ({readyToCheckinCount} ພ້ອມເຊັກອິນ, {checkedInCount} ກຳລັງພັກ)
              </span>
            </Typography>
          </Box>

          <CheckInTable
            data={filteredItems}
            loading={checkInLoading || bookingLoading}
            onCheckin={handleCheckinBooking}
            onCancel={handleCancel}
            onDelete={handleDelete}
            currentUserRole={userRoleId}
          />
        </Grid>
      </Grid>
    </Box>
  );
}