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
import RoomSelectionCards from './SelectionCard';
import RoomSearchFilter from './RoomSearchFilter';

// Store Imports
import { useCustomerBookingStore } from '@core/infrastructure/store/customer-booking/customer-booking.store';

const CustomerRoomsPage = () => {
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
    priceMax: '',
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
      if (params && (params.checkinDate || params.checkoutDate || params.priceMax)) {
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
      priceMax: '',
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

      toast.success('ຈອງສຳເລັດ! ທ່ານຈະໄດ້ຮັບການຢືນຢັນໃນໄວໆນີ້');
      
      // Navigate to booking success or detail page
      console.log('Booking successful:', booking);
      
    } catch (error: any) {
      console.error('Error booking room:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການຈອງ 12: ' + (error.message || 'Unknown error'));
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
        <CircularProgress size={40} sx={{ color: '#d4851c' }} />
        <Typography sx={{ ml: 2, color: '#d4851c' }}>ກຳລັງກວດສອບສິດການໃຊ້ງານ...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={6}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="h4" 
              fontWeight={600} 
              sx={{ 
                color: '#d4851c',
                background: 'linear-gradient(135deg, #d4851c, #f4a261)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              ຈອງຫ້ອງພັກ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              ເລືອກຫ້ອງພັກທີ່ທ່ານຕ້ອງການ ແລະ ດຳເນີນການຈອງ
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
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#d4851c', fontWeight: 500 }}>
              ພົບ <strong style={{ color: '#d4851c' }}>{filteredRooms.length}</strong> ຫ້ອງພັກ
              {searchValue && (
                <span> ສຳລັບ "<strong style={{ color: '#d4851c' }}>{searchValue}</strong>"</span>
              )}
              {localFilters.checkinDate && localFilters.checkoutDate && (
                <span>
                  {' '}ໃນວັນທີ່ {new Date(localFilters.checkinDate).toLocaleDateString('th-TH')} - {new Date(localFilters.checkoutDate).toLocaleDateString('th-TH')}
                </span>
              )}
            </Typography>
          </Box>
        </Grid>

        {/* Room Cards Section */}
        <Grid item xs={12}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <CircularProgress size={40} sx={{ color: '#d4851c' }} />
              <Typography sx={{ ml: 2, color: '#d4851c' }}>ກຳລັງໂຫລດຫ້ອງພັກ...</Typography>
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
                border: '2px dashed #d4851c',
                borderColor: '#d4851c'
              }}
            >
              <Typography variant="h6" sx={{ color: '#d4851c' }} gutterBottom>
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
};

export default CustomerRoomsPage;