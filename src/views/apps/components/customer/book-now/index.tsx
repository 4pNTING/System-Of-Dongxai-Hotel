// src/views/apps/components/customer/my-bookings/index.tsx
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// MUI Imports
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Type Imports
import type { UsersType } from '@/types/apps/userTypes';

// Component Imports
import CardUser from './CardUser';
import SelectionCard from './SelectionCard';
import RoomSearchFilter from './RoomSearchFilter';

// Store Imports - แก้ไข import path
import { useCustomerBookingStore } from '@/@core/infrastructure/store/customer-booking/customer-booking.store';

interface BookNowListProps {
  userData?: UsersType[];
}

const BookNowList: React.FC<BookNowListProps> = ({ userData }) => {
  const {
    rooms,
    isLoading,
    fetchRooms,
    searchRooms,
    bookRoom
  } = useCustomerBookingStore();

  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({
    checkinDate: '',
    checkoutDate: '',
    priceMax: '',
  });

  // กรองข้อมูลห้องพักตาม search value และ ราคา
  const filteredRooms = rooms.filter(room => {
    // กรองตาม search text
    const searchMatch = !searchValue || 
      room.roomType?.TypeName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      room.RoomPrice.toString().includes(searchValue);

    // กรองตามราคา
    const priceMatch = !filters.priceMax || 
      room.RoomPrice <= parseInt(filters.priceMax);

    return searchMatch && priceMatch;
  });

  // Handlers
  const handleSearch = async () => {
    try {
      console.log('🔍 Searching with filters:', filters);
      
      // ถ้ามีวันที่จะใช้ search API ถ้าไม่มีใช้ filter ใน client
      if (filters.checkinDate && filters.checkoutDate) {
        await searchRooms({
          checkinDate: filters.checkinDate,
          checkoutDate: filters.checkoutDate,
          priceMax: parseInt(filters.priceMax) || undefined
        });
      } else {
        // ใช้ข้อมูลที่มีอยู่แล้ว กรองใน client
        console.log('Using client-side filtering');
      }
    } catch (error: any) {
      console.error('Error searching rooms:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການຄົ້ນຫາ');
    }
  };

  const handleClearFilters = async () => {
    setFilters({
      checkinDate: '',
      checkoutDate: '',
      priceMax: '',
    });
    setSearchValue('');
    await fetchRooms();
  };

  const handleBookRoom = async (roomId: number, bookingData: any) => {
    try {
      toast.info('ກຳລັງດຳເນີນການຈອງ...');

      // ✅ ส่งเฉพาะข้อมูลที่ backend ต้องการ (ไม่มี CustomerId)
      const completeBookingData = {
        RoomId: roomId,
        CheckinDate: bookingData.CheckinDate,    // ✅ string format
        CheckoutDate: bookingData.CheckoutDate,  // ✅ string format
      };

      console.log('📝 Complete booking data:', completeBookingData);

      // const booking = await bookRoom(completeBookingData);

      toast.success('ຈອງສຳເລັດ!');
  
      
    } catch (error: any) {
      console.error('Error booking room:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Unknown error';
      
      console.log('Full error response:', error.response?.data);
      toast.error(`ເກີດຂໍ້ຜິດພາດໃນການຈອງ 1: ${errorMessage}`);
    }
  };

  const handleViewDetails = (roomId: number) => {
    window.location.href = `/rooms/detail/${roomId}`;
  };

  // Load initial data
  useEffect(() => {
    console.log("Loading rooms data...");
    fetchRooms();
  }, [fetchRooms]);

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          ຈອງຫ້ອງພັກ
        </Typography>
      </Grid>

      {/* Search Filter */}
      <Grid item xs={12}>
        <RoomSearchFilter
          filters={filters}
          searchValue={searchValue}
          onFilterChange={setFilters}
          onSearchValueChange={setSearchValue}
          onSearch={handleSearch}
          onClearFilters={handleClearFilters}
          loading={isLoading}
        />
      </Grid>

      {/* Results */}
      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          ພົບ {filteredRooms.length} ຫ້ອງພັກ
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={40} />
          </Box>
        ) : filteredRooms.length > 0 ? (
          <SelectionCard
            rooms={filteredRooms}
            onBookRoom={handleBookRoom}
            onViewDetails={handleViewDetails}
            searchFilters={filters}
          />
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              ບໍ່ພົບຫ້ອງພັກ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ລອງປ່ຽນເງື່ອນໄຂການຄົ້ນຫາ
            </Typography>
          </Box>
        )}
      </Grid>

      {/* User Card */}
      <Grid item xs={12}>
        <CardUser />
      </Grid>
    </Grid>
  );
};

export default BookNowList;