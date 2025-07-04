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
import RoomSelectionCards from '@/views/apps/components/customer/book-now/SelectionCard';
import RoomSearchFilter from '@/views/apps/components/customer/book-now/RoomSearchFilter';

// Store Imports
import { useCustomerBookingStore } from '@core/infrastructure/store/customer-booking/customer-booking.store';
import { RoomWithGallery } from '@core/domain/models/room-gallery/list.model';

export default function CustomerRoomsPage() {
  const {
    rooms,
    searchFilters,
    isLoading,
    fetchRooms,
    searchRooms,
    setSearchFilters,
    clearSearchFilters,
    bookRoom
  } = useCustomerBookingStore();

  const [searchValue, setSearchValue] = useState('');
  const [localFilters, setLocalFilters] = useState({
    checkinDate: '',
    checkoutDate: '',
    guests: 1,
    priceMin: '',
    priceMax: '',
    roomType: ''
  });

  const { data: session, status } = useSession();
  const isLoadingAuth = status === 'loading';

  const userCustomerId = session?.user?.customerId || 0;

  // กรองข้อมูลห้องพักตาม search value
  const filteredRooms = rooms.filter(room => {
    if (!searchValue) return true;
    
    const roomType = room.roomType?.TypeName?.toLowerCase() || '';
    const description = room.primaryImage?.ImageDescription?.toLowerCase() || '';
    const price = room.RoomPrice.toString();
    
    return roomType.includes(searchValue.toLowerCase()) ||
           description.includes(searchValue.toLowerCase()) ||
           price.includes(searchValue);
  });

  // Handlers
  const handleSearch = async (searchParams?: any) => {
    try {
      const params = searchParams || localFilters;
      console.log('🔍 Searching rooms with params:', params);
      
      // ถ้ามี search params จะค้นหา ถ้าไม่มีจะโหลดทั้งหมด
      if (params && Object.values(params).some(val => val !== '' && val !== 1)) {
        await searchRooms(params);
        setSearchFilters(params);
      } else {
        await fetchRooms();
      }
    } catch (error: any) {
      console.error('Error searching rooms:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການຄົ້ນຫາ: ' + (error.message || 'Unknown error'));
    }
  };

  const handleFilterChange = (filters: any) => {
    setLocalFilters(filters);
  };

  const handleClearFilters = async () => {
    setLocalFilters({
      checkinDate: '',
      checkoutDate: '',
      guests: 1,
      priceMin: '',
      priceMax: '',
      roomType: ''
    });
    clearSearchFilters();
    await fetchRooms();
  };

  const handleBookRoom = async (roomId: number, bookingData: any) => {
    try {
      if (!session) {
        toast.warning('ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນຈອງ');
        window.location.href = '/auth/login';
        return;
      }

      toast.info('ກຳລັງດຳເນີນການຈອງ...');

      const booking = await bookRoom({
        RoomId: roomId,
        CustomerId: userCustomerId,
        ...bookingData
      });

      toast.success('ຈອງສຳເລັດ!');
      
      // Navigate to booking success or detail page
      console.log('Booking successful:', booking);
      
    } catch (error: any) {
      // ดึง message จาก backend
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        'Unknown error';

      toast.error(` ${backendMessage}`);
    }
  };

  const handleViewDetails = (roomId: number) => {
    // Navigate to room detail page
    window.location.href = `/rooms/detail/${roomId}`;
  };

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  // Load initial data
  useEffect(() => {
    console.log("Loading rooms data...");
    fetchRooms();
  }, [fetchRooms]);

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
              ຈອງຫ້ອງພັກ
            </Typography>
           
          </Box>
        </Grid>

        {/* Search and Filter Section */}
        <Grid item xs={12}>
          <RoomSearchFilter
            filters={localFilters}
            searchValue={searchValue}
            onFilterChange={handleFilterChange}
            onSearchValueChange={handleSearchValueChange}
            onSearch={handleSearch}
            onClearFilters={handleClearFilters}
            loading={isLoading}
          />
        </Grid>

        {/* Results Summary */}
        <Grid item xs={12}>
        
        </Grid>

        {/* Room Cards Section */}
        <Grid item xs={12}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <CircularProgress size={40} />
              <Typography sx={{ ml: 2 }}>ກຳລັງໂຫລດຫ້ອງພັກ...</Typography>
            </Box>
          ) : filteredRooms.length > 0 ? (
            <RoomSelectionCards
              rooms={filteredRooms}
              onBookRoom={handleBookRoom}
              onViewDetails={handleViewDetails}
              searchFilters={localFilters}
            />
          ) : (
            <Box 
              display="flex" 
              flexDirection="column" 
              justifyContent="center" 
              alignItems="center" 
              height="300px"
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                ບໍ່ພົບຫ້ອງພັກ
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                ລອງປ່ຽນເງື່ອນໄຂການຄົ້ນຫາ ຫຼື ລ້າງຕົວກອງແລ້ວລອງໃໝ່
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}