// src/app/(dashboard)/checkouts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

// Component Imports
import CheckOutSearch from '@/views/apps/checkout/CheckOutSearch';
import CheckOutTable from '@views/apps/checkout/CheckOutTable';
import CheckOutCards from '@views/apps/checkout/CheckOutCard';
import { DateRangePicker } from '@views/apps/checkin/DateRangePicker';
import CheckoutConfirmDialog from '@views/apps/checkout/CheckoutConfirmDialog';

// Store Imports
import { useCheckOutStore } from '@core/infrastructure/store/checkout/checkout.store';
import { useCheckInStore } from '@core/infrastructure/store/checkin/checkin.store';

export default function CheckOutPage() {
  const { 
    items: checkOuts,
    stats,
    fetchItems: fetchCheckOuts,
    fetchStats,
    checkoutCheckIn,
    delete: deleteCheckOut,
    isLoading: checkOutLoading
  } = useCheckOutStore();
  
  const {
    items: checkIns,
    fetchItems: fetchCheckIns,
    isLoading: checkInLoading
  } = useCheckInStore();
  
  const [searchValue, setSearchValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [checkInSearchOpen, setCheckInSearchOpen] = useState(false);
  const [checkInSearch, setCheckInSearch] = useState('');
  const [selectedCheckIn, setSelectedCheckIn] = useState<any>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  
  const { data: session, status } = useSession();
  const isLoadingAuth = status === 'loading';
  
  const userRoleId = session?.user?.roleId ?  
    (typeof session.user.roleId === 'string' ? parseInt(session.user.roleId, 10) : session.user.roleId) : 0;

  // กรองข้อมูล check-ins ที่พร้อม checkout (กำลังพัก)
  const readyToCheckoutCheckIns = checkIns.filter(checkIn => 
    !checkIn.checkOuts || checkIn.checkOuts.length === 0
  );

  // รวมข้อมูล check-ins ที่กำลังพักและ check-outs ที่เสร็จแล้ว
  const combinedData = [
    // ห้องที่กำลังเข้าพัก (พร้อม checkout buttons)
    ...readyToCheckoutCheckIns.map(checkIn => ({
      ...checkIn,
      status: 'checked_in',
      type: 'checkin'
    })),
    // ประวัติ checkout ที่เสร็จแล้ว
    ...checkOuts.map(checkOut => ({
      ...checkOut,
      status: 'checked_out',
      type: 'checkout'
    }))
  ];

  // กรองข้อมูลรวม
  const filteredCombinedData = combinedData.filter(item => {
    // กรองตาม search - ใช้ type guards แทน type assertions
    let checkInId = '';
    let checkOutId = '';
    let roomId = '';
    let customerName = '';
    let roomTypeName = '';

    if (item.type === 'checkin') {
      // สำหรับ check-in records - เข้าถึง properties โดยตรง
      checkInId = 'CheckInId' in item ? String(item.CheckInId) : '';
      roomId = 'RoomId' in item ? String(item.RoomId) : '';
      customerName = ('customer' in item && item.customer) ? item.customer.CustomerName || '' : '';
      roomTypeName = ('room' in item && item.room?.roomType) ? item.room.roomType.TypeName || '' : '';
    } else {
      // สำหรับ checkout records - เข้าถึงผ่าน nested checkIn
      checkOutId = 'CheckOutId' in item ? String(item.CheckOutId) : '';
      if ('checkIn' in item && item.checkIn) {
        checkInId = item.checkIn.CheckInId ? String(item.checkIn.CheckInId) : '';
        roomId = item.checkIn.RoomId ? String(item.checkIn.RoomId) : '';
        customerName = item.checkIn.customer?.CustomerName || '';
        roomTypeName = item.checkIn.room?.roomType?.TypeName || '';
      }
    }

    const matchesSearch = !searchValue ||
      checkInId.includes(searchValue) ||
      checkOutId.includes(searchValue) ||
      roomId.includes(searchValue) ||
      customerName.toLowerCase().includes(searchValue.toLowerCase()) ||
      roomTypeName.toLowerCase().includes(searchValue.toLowerCase());

    // กรองตามวันที่
    let matchesDate = true;
    if (startDate && endDate) {
      const relevantDate = item.type === 'checkin' ? 
        new Date(item.CheckInDate) : 
        new Date(item.CheckOutDate || (item as any).checkIn?.CheckInDate);
      const filterStartDate = new Date(startDate);
      const filterEndDate = new Date(endDate);

      relevantDate.setHours(0, 0, 0, 0);
      filterStartDate.setHours(0, 0, 0, 0);
      filterEndDate.setHours(23, 59, 59, 999);

      matchesDate = relevantDate >= filterStartDate && relevantDate <= filterEndDate;
    }

    return matchesSearch && matchesDate;
  });

  // กรอง check-ins สำหรับการเลือก checkout
  const filteredCheckInsForCheckout = readyToCheckoutCheckIns.filter(checkIn => {
    const checkInId = String(checkIn.CheckInId);
    const roomId = String(checkIn.RoomId);
    const customerName = checkIn.customer?.CustomerName || '';

    return !checkInSearch ||
      checkInId.includes(checkInSearch) ||
      roomId.includes(checkInSearch) ||
      customerName.toLowerCase().includes(checkInSearch.toLowerCase());
  });

  // Handlers
  const handleCheckout = async () => {
    if (!selectedCheckIn || !session?.user?.id) return;
    
    try {
      setIsProcessingCheckout(true);
      toast.info('ກຳລັງດຳເນີນການເຊັກເອົາ...');
      
      const staffId = parseInt(session.user.id);
      await checkoutCheckIn(selectedCheckIn.CheckInId, staffId);
      
      toast.success('ເຊັກເອົາສໍາເລັດແລ້ວ');
      
      // Refresh ข้อมูล
      await Promise.all([
        fetchCheckOuts(),
        fetchCheckIns(),
        fetchStats()
      ]);
      
      // ปิด dialogs
      setCheckoutDialogOpen(false);
      setCheckInSearchOpen(false);
      setSelectedCheckIn(null);
      setCheckInSearch('');
      
    } catch (error: any) {
      console.error('Error checking out:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການເຊັກເອົາ: ' + (error.message || 'Unknown error'));
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handleDelete = async (item: any) => {
    try {
      if (window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບລາຍການນີ້?')) {
        toast.info('ກຳລັງດຳເນີນການລົບ...');
        
        await deleteCheckOut(item.CheckOutId);
        
        toast.success('ລົບສໍາເລັດແລ້ວ');
        await fetchCheckOuts();
      }
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການລົບ: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEdit = (item: any) => {
    // แสดงรายละเอียด checkout (อาจจะเป็น modal หรือ navigate ไปหน้าอื่น)
    console.log('View checkout details:', item);
    toast.info('ຟີເຈີນີ້ຈະມາໃນໄວໆນີ້');
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
  
  const handleNewCheckout = () => {
    setCheckInSearchOpen(true);
  };

  const handleSelectCheckIn = async (checkIn: any) => {
    setSelectedCheckIn(checkIn);
    setCheckInSearchOpen(false);
    setCheckoutDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setCheckoutDialogOpen(false);
    setCheckInSearchOpen(false);
    setSelectedCheckIn(null);
    setCheckInSearch('');
  };
  
  const hasDateFilter = Boolean(startDate && endDate);
  
  useEffect(() => {
    console.log("Loading check-out and check-in data...");
    Promise.all([
      fetchCheckOuts(),
      fetchCheckIns(),
      fetchStats()
    ]);
  }, [fetchCheckOuts, fetchCheckIns, fetchStats]);
  
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
              ການຈັດການເຊັກເອົາ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              ຈັດການການເຊັກເອົາຂອງລູກຄ້າ ແລະ ເບິ່ງປະຫວັດການເຊັກເອົາ
            </Typography>
          </Box>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12}>
          <CheckOutCards 
            totalCheckOuts={stats?.totalCheckOuts || 0}
            checkOutsToday={stats?.checkOutsToday || 0}
            averageStayDuration={stats?.averageStayDuration || 0}
            totalRevenue={stats?.totalRevenue || 0}
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
            <CheckOutSearch
              value={searchValue}
              onFilterChange={handleFilterChange}
              placeholder="ຄົ້ນຫາ Check-in/Checkout ID, ຫ້ອງ, ລູກຄ້າ, ຫຼື ປະເພດຫ້ອງ..."
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
              ພົບ {filteredCombinedData.length} ລາຍການທັງໝົດ
              {hasDateFilter && (
                <span>
                  {' '}ໃນຊ່ວງ {new Date(startDate).toLocaleDateString('th-TH')} - {new Date(endDate).toLocaleDateString('th-TH')}
                </span>
              )}
              <span className="ml-4">
                (
                {filteredCombinedData.filter(item => item.type === 'checkin').length} ເຂົ້າພັກ, {' '}
                {filteredCombinedData.filter(item => item.type === 'checkout').length} ເຊັກເອົາແລ້ວ
                )
              </span>
            </Typography>
          </Box>

          <CheckOutTable
            data={filteredCombinedData}
            loading={checkOutLoading || checkInLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCheckout={handleSelectCheckIn}
            currentUserRole={userRoleId}
            showCheckoutButtons={false}
          />
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        aria-label="add checkout"
        onClick={handleNewCheckout}
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          zIndex: 1000
        }}
      >
        <i className="tabler-door-exit text-xl" />
      </Fab>

      {/* Check-in Selection Dialog */}
      <Dialog 
        open={checkInSearchOpen} 
        onClose={handleCloseDialogs} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            ເລືອກ Check-in ເພື່ອເຊັກເອົາ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ມີ {readyToCheckoutCheckIns.length} ລາຍການພ້ອມເຊັກເອົາ
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="ຄົ້ນຫາ Check-in ID, ຫ້ອງ, ຫຼື ລູກຄ້າ..."
              value={checkInSearch}
              onChange={(e) => setCheckInSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredCheckInsForCheckout.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  ບໍ່ມີລາຍການທີ່ພ້ອມເຊັກເອົາ
                </Typography>
              </Box>
            ) : (
              filteredCheckInsForCheckout.map((checkIn) => (
                <Box
                  key={checkIn.CheckInId}
                  sx={{
                    p: 2,
                    mb: 1,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'grey.50',
                      borderColor: 'primary.main'
                    }
                  }}
                  onClick={() => handleSelectCheckIn(checkIn)}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Check-in #{checkIn.CheckInId} - ຫ້ອງ {checkIn.RoomId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ລູກຄ�້າ: {checkIn.customer?.CustomerName || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ເຂົ້າພັກ: {new Date(checkIn.CheckInDate).toLocaleDateString('th-TH')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ກຳນົດອອກ: {new Date(checkIn.CheckoutDate).toLocaleDateString('th-TH')}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body2" color="success.main" fontWeight="bold">
                        ກຳລັງພັກ
                      </Typography>
                      {checkIn.room?.roomType?.TypeName && (
                        <Typography variant="caption" color="text.secondary">
                          {checkIn.room.roomType.TypeName}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>ຍົກເລີກ</Button>
        </DialogActions>
      </Dialog>

      {/* Checkout Confirmation Dialog */}
      <CheckoutConfirmDialog
        open={checkoutDialogOpen}
        checkIn={selectedCheckIn}
        isProcessing={isProcessingCheckout}
        onConfirm={handleCheckout}
        onCancel={handleCloseDialogs}
      />
    </Box>
  );
}