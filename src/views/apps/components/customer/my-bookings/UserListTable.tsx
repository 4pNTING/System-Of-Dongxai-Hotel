'use client'

// React Imports
import React, { useEffect, useState } from 'react'

// NextAuth Imports
import { useSession } from 'next-auth/react'

// Store Imports
import { useCustomerBookingStore } from '@core/infrastructure/store/customer-booking/customer-booking.store'

// Model Imports
import { Booking } from '@core/domain/models/booking/list.model'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Card from '@mui/material/Card'

// Print Service Import
import { BookingPrintService } from './BookingPrintService'

// BookingCard Component Import
import BookingCard from './BookingCard'

// Component Interfaces
interface BookingType {
  bookingId: number
  roomType: string
  roomPrice: number
  checkinDate: string
  checkoutDate: string
  statusId: number
  statusName: string
  roomImage?: string
  totalPrice?: number
  nights?: number
  rating?: number
  reviewCount?: number
  description?: string
  // Customer information
  customerName: string
  customerTel?: string
}

interface BookingCardProps {
  booking: BookingType
  onViewDetail?: (bookingId: number) => void
  onCancel?: (bookingId: number) => void
  onReview?: (bookingId: number) => void
  onPrint?: (bookingId: number) => void
}

const CustomerBookingComponent = () => {
  const { data: session, status } = useSession()
  
  // Zustand Store (ใช้ store อย่างถูกต้อง)
  const {
    bookings, // ใช้จาก store
    isLoading,
    fetchBookingHistory,
    fetchBookingDetail,
    cancelBooking,
    selectedBooking
  } = useCustomerBookingStore()

  // Local States
  const [filteredData, setFilteredData] = useState<BookingType[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<number | ''>('')
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null)
  const [bookingDetailOpen, setBookingDetailOpen] = useState(false)

  // Status Configuration
  const bookingStatusObj = {
    1: { color: 'warning', label: 'ລໍຖ້າການຢືນຢັນ', icon: '⏳' },
    2: { color: 'info', label: 'ຢືນຢັນແລ້ວ', icon: '✅' },
    3: { color: 'success', label: 'ເຊັກອິນແລ້ວ', icon: '🏨' },
    4: { color: 'secondary', label: 'ເຊັກເອົາແລ້ວ', icon: '🎉' },
    5: { color: 'error', label: 'ຍົກເລີກແລ້ວ', icon: '❌' }
  }

  // Helper functions
  const calculateNights = (checkinDate: string, checkoutDate: string): number => {
    const checkin = new Date(checkinDate)
    const checkout = new Date(checkoutDate)
    const diffTime = Math.abs(checkout.getTime() - checkin.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getStatusName = (statusId: number): string => {
    return bookingStatusObj[statusId as keyof typeof bookingStatusObj]?.label || 'ບໍ່ຮູ້ສະຖານະ'
  }

  // Transform booking data from store to component format
  const transformBookingData = (storeBookings: any[]): BookingType[] => {
    return storeBookings.map(booking => {
      console.log('🔄 Transforming booking:', booking)
      
      // Handle different date formats and field names
      const checkinDate = booking.CheckinDate || booking.checkinDate || booking.checkInDate
      const checkoutDate = booking.CheckoutDate || booking.checkoutDate || booking.checkOutDate
      
      const nights = calculateNights(checkinDate, checkoutDate)
      
      // Handle different room price formats
      const roomPrice = booking.room?.RoomPrice || 
                       booking.room?.roomPrice || 
                       booking.Room?.RoomPrice ||
                       booking.roomPrice || 0
      
      // Handle different room type formats
      const roomType = booking.room?.roomType?.TypeName || 
                      booking.room?.roomType ||
                      booking.Room?.RoomType?.TypeName ||
                      booking.Room?.roomType ||
                      booking.roomType || 'N/A'
      
      // Handle different booking ID formats
      const bookingId = booking.BookingId || booking.bookingId || booking.id
      
      // Handle different status formats
      const statusId = booking.StatusId || booking.statusId || 1
      const statusName = booking.BookingStatus?.StatusName || 
                        booking.statusName || 
                        getStatusName(statusId)
      
      // Handle image URL
      const roomImage = booking.room?.galleries?.[0]?.ImageUrl || 
                       booking.room?.primaryImage || 
                       booking.Room?.galleries?.[0]?.ImageUrl ||
                       booking.roomImage
      
      // Handle customer information
      console.log('👤 Customer data:', booking.customer)
      const customerName = booking.customer?.customerName || 
                          booking.customer?.CustomerName || 
                          booking.customerName ||
                          booking.CustomerName || 
                          'ບໍ່ລະບຸຊື່'
      const customerTel = booking.customer?.customerTel || 
                         booking.customer?.CustomerTel || 
                         booking.customerTel ||
                         booking.CustomerTel || 
                         null
      
      const result = {
        bookingId: bookingId,
        roomType: roomType,
        roomPrice: roomPrice,
        checkinDate: checkinDate,
        checkoutDate: checkoutDate,
        statusId: statusId,
        statusName: statusName,
        roomImage: roomImage,
        nights: nights,
        totalPrice: booking.TotalPrice || booking.totalPrice || (roomPrice * nights),
        rating: booking.room?.rating || booking.Room?.rating || booking.rating || 4,
        reviewCount: booking.room?.reviewCount || booking.Room?.reviewCount || booking.reviewCount || 0,
        description: booking.room?.Description || 
                    booking.room?.description || 
                    booking.Room?.Description ||
                    booking.description,
        // Customer information
        customerName: customerName,
        customerTel: customerTel
      }
      
      console.log('✅ Transformed result:', result)
      return result
    })
  }

  // Get customer ID from session or localStorage
  const getCustomerId = (): number | null => {
    // Try to get from session
    if (session?.user) {
      const sessionUser = session.user as any
      console.log('👤 Session user object:', sessionUser)
      
      if (sessionUser.id) {
        console.log('✅ Found customerId from session.user.id:', sessionUser.id)
        return parseInt(sessionUser.id)
      }
      if (sessionUser.CustomerId) {
        console.log('✅ Found customerId from session.user.CustomerId:', sessionUser.CustomerId)
        return parseInt(sessionUser.CustomerId)
      }
      if (sessionUser.customerId) {
        console.log('✅ Found customerId from session.user.customerId:', sessionUser.customerId)
        return parseInt(sessionUser.customerId)
      }
      if (sessionUser.sub) {
        console.log('✅ Found customerId from session.user.sub:', sessionUser.sub)
        return parseInt(sessionUser.sub)
      }
    }

    // Try to get from localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        console.log('💾 Parsed userData from localStorage:', parsed)
        
        if (parsed.id) {
          console.log('✅ Found customerId from userData.id:', parsed.id)
          return parseInt(parsed.id)
        }
        if (parsed.CustomerId) {
          console.log('✅ Found customerId from userData.CustomerId:', parsed.CustomerId)
          return parseInt(parsed.CustomerId)
        }
        if (parsed.customerId) {
          console.log('✅ Found customerId from userData.customerId:', parsed.customerId)
          return parseInt(parsed.customerId)
        }
      } catch (e) {
        console.warn('⚠️ Failed to parse userData:', e)
      }
    }

    // Try to decode JWT token to get user info
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        console.log('🔍 JWT payload:', payload)
        
        if (payload.id) {
          console.log('✅ Found customerId from JWT.id:', payload.id)
          return parseInt(payload.id)
        }
        if (payload.CustomerId) {
          console.log('✅ Found customerId from JWT.CustomerId:', payload.CustomerId)
          return parseInt(payload.CustomerId)
        }
        if (payload.sub) {
          console.log('✅ Found customerId from JWT.sub:', payload.sub)
          return parseInt(payload.sub)
        }
      } catch (e) {
        console.warn('⚠️ Failed to decode JWT token:', e)
      }
    }

    console.log('❌ No customerId found from any source')
    return null
  }

  // Fetch booking data on component mount
  useEffect(() => {
    const loadBookingHistory = async () => {
      try {
        const customerId = getCustomerId()
        
        if (!customerId) {
          setError('ກະລຸນາເຂົ້າສູ່ລະບົບເພື່ອເບິ່ງການຈອງ')
          return
        }

        console.log('🚀 Fetching booking history for customer:', customerId)
        
        // ✅ ใช้ store แทนการเรียก API โดยตรง
        await fetchBookingHistory(customerId)
        
        setError(null)
        
      } catch (err: any) {
        console.error('❌ Error loading booking history:', err)
        setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ')
      }
    }

    if (status !== 'loading') {
      loadBookingHistory()
    }
  }, [status, fetchBookingHistory])

  // Transform and filter data when bookings change
  useEffect(() => {
    let transformedData = transformBookingData(bookings)

    // Apply search filter
    if (searchTerm) {
      transformedData = transformedData.filter(booking => 
        booking.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId.toString().includes(searchTerm) ||
        booking.statusName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== '') {
      transformedData = transformedData.filter(booking => booking.statusId === statusFilter)
    }

    setFilteredData(transformedData)
  }, [bookings, searchTerm, statusFilter])

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('lo-LA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number): string => {
    return `₭${amount.toLocaleString()}`
  }

  const handleViewDetail = async (bookingId: number) => {
    try {
      await fetchBookingDetail(bookingId)
      setBookingDetailOpen(true)
    } catch (error) {
      console.error('Error fetching booking detail:', error)
    }
  }

  const handleCancel = (bookingId: number) => {
    setSelectedBookingId(bookingId)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (selectedBookingId) {
      try {
        await cancelBooking(selectedBookingId)
        setCancelDialogOpen(false)
        setSelectedBookingId(null)
      } catch (error) {
        console.error('Error canceling booking:', error)
      }
    }
  }

  const handleReview = (bookingId: number) => {
    alert(`ຂຽນລີວິວສຳລັບການຈອງ #${bookingId}`)
  }

  const handlePrint = (bookingId: number) => {
    const booking = filteredData.find(b => b.bookingId === bookingId)
    if (booking) {
      BookingPrintService.printBooking(booking)
    }
  }

  const canCancel = (statusId: number): boolean => {
    return statusId === 1 || statusId === 2
  }

  // Refresh booking data
  const handleRefresh = async () => {
    const customerId = getCustomerId()
    if (!customerId) {
      setError('ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່')
      return
    }

    try {
      console.log('🔄 Refreshing booking history for customer:', customerId)
      
      // ✅ ใช้ store method
      await fetchBookingHistory(customerId)
      
      setError(null)
    } catch (err: any) {
      console.error('❌ Error refreshing booking history:', err)
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ')
    }
  }

  // Loading Skeleton
  if (status === 'loading' || isLoading) {
    return (
      <Box sx={{ p: 2.5, pt: 30 }}> {/* ✅ ลด padding จาก 3 เป็น 2.5 */}
        <Typography variant="h4" gutterBottom>ການຈອງຂອງຂ້ອຍ</Typography>
        <Grid container spacing={3}>
          {[1,2,3].map(i => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  // Authentication Error
  if (status === 'unauthenticated') {
    return (
      <Box sx={{ p: 3, pt: 12 }}>
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>🔒</Typography>
          <Typography variant="h6" gutterBottom>
            ກະລຸນາເຂົ້າສູ່ລະບົບ
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            ທ່ານຕ້ອງເຂົ້າສູ່ລະບົບກ່ອນເພື່ອເບິ່ງປະຫວັດການຈອງ
          </Typography>
          <Button variant="contained" size="large">
            ເຂົ້າສູ່ລະບົບ
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, pt: 20 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box mb={2}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            ການຈອງຂອງຂ້ອຍ
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="ຄົ້ນຫາ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span>🔍</span>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>ກັ່ນຕອງສະຖານະ</InputLabel>
                <Select
                  value={statusFilter}
                  label="ກັ່ນຕອງສະຖານະ"
                  onChange={(e) => setStatusFilter(e.target.value as number | '')}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">ທັງໝົດ</MenuItem>
                  {Object.entries(bookingStatusObj).map(([id, status]) => (
                    <MenuItem key={id} value={parseInt(id)}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <span>{status.icon}</span>
                        {status.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<span>➕</span>}
                size="small"
                sx={{ py: 1.5, borderRadius: 2 }}
                onClick={() => {
                  window.location.href = '/book-now'
                }}
              >
                ຈອງໃໝ່
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<span>🔄</span>}
                size="small"
                sx={{ py: 1.5, borderRadius: 2 }}
                onClick={handleRefresh}
                disabled={isLoading}
              >
                ໂຫລດໃໝ່
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Booking Cards */}
      {filteredData.length === 0 ? (
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>🏨</Typography>
          <Typography variant="h6" gutterBottom>
            {searchTerm || statusFilter !== '' ? 'ບໍ່ພົບການຈອງທີ່ຄົ້ນຫາ' : 'ຍັງບໍ່ມີການຈອງ'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || statusFilter !== '' 
              ? 'ລອງປ່ຽນຄຳຄົ້ນຫາຫຼືຕົວກອງໃໝ່' 
              : 'ເລີ່ມຕົ້ນການເດີນທາງຂອງທ່ານດ້ວຍການຈອງຫ້ອງພັກກັບເຮົາ'
            }
          </Typography>
          {!searchTerm && statusFilter === '' && (
            <Button
              variant="contained" 
              size="large"
              startIcon={<span>🏠</span>}
              sx={{ borderRadius: 2 }}
              onClick={() => window.location.href = '/book-now'}
            >
              จองห້องพัก
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={1.5} sx={{ px: 0.5 }}>
          {filteredData.map((booking) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={booking.bookingId}>
              <Box sx={{ p: 0.5 }}>
                <BookingCard
                  booking={booking}
                  onViewDetail={handleViewDetail}
                  onCancel={handleCancel}
                  onReview={handleReview}
                  onPrint={handlePrint}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

    {/* Cancel Dialog */}
    <Dialog 
      open={cancelDialogOpen} 
      onClose={() => setCancelDialogOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <span>⚠️</span>
          ຢືນຢັນການຍົກເລີກ
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຍົກເລີກການຈອງ <strong>#{selectedBookingId}</strong>?
        </Typography>
        <Alert severity="warning" sx={{ mt: 2 }}>
          ການຍົກເລີກນີ້ບໍ່ສາມາດຍົກເລີກໄດ້ອີກ
        </Alert>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setCancelDialogOpen(false)} variant="outlined">
          ຍົກເລີກ
        </Button>
        <Button 
          onClick={handleConfirmCancel}
          color="error"
          variant="contained"
          startIcon={<span>🗑️</span>}
          disabled={isLoading}
        >
          ຢືນຢັນຍົກເລີກ
        </Button>
      </DialogActions>
    </Dialog>

    {/* Booking Detail Dialog */}
    <Dialog 
      open={bookingDetailOpen} 
      onClose={() => setBookingDetailOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {selectedBooking && (
        <>
          {/* Header */}
          <Box 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 3,
              position: 'relative'
            }}
          >
            <IconButton
              onClick={() => setBookingDetailOpen(false)}
                sx={{ 
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  color: 'white'
                }}
              >
                <span>✖️</span>
              </IconButton>
              
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box 
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}
                >
                  🏨
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    ລາຍລະອຽດການຈອງ
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Dongxai Hotel - Booking #{selectedBooking.BookingId}
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Chip
                  label={selectedBooking.bookingStatus?.StatusName || getStatusName(selectedBooking.StatusId)}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                  icon={<span>{bookingStatusObj[selectedBooking.StatusId as keyof typeof bookingStatusObj]?.icon}</span>}
                />
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency((selectedBooking.room?.RoomPrice || 0) * calculateNights(
                    typeof selectedBooking.CheckinDate === 'string' ? selectedBooking.CheckinDate : selectedBooking.CheckinDate.toISOString(),
                    typeof selectedBooking.CheckoutDate === 'string' ? selectedBooking.CheckoutDate : selectedBooking.CheckoutDate.toISOString()
                  ))}
                </Typography>
              </Box>
            </Box>

            {/* Content */}
            <DialogContent sx={{ p: 0 }}>
              <Box p={3}>
                {/* Room Information */}
                <Box mb={4}>
                  <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
                    🛏️ ຂໍ້ມູນຫ້ອງພັກ
                  </Typography>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" fontWeight="bold" mb={1}>
                          {selectedBooking.room?.roomType?.TypeName || 'N/A'}
                        </Typography>
                        <Typography color="text.secondary">
                          {formatCurrency(selectedBooking.room?.RoomPrice || 0)} ຕໍ່ຄືນ
                        </Typography>
                      </Box>
                      <Box 
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem'
                        }}
                      >
                        🏠
                      </Box>
                    </Box>
                  </Paper>
                </Box>

                {/* Check-in/out Information */}
                <Box mb={4}>
                  <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
                    📅 ວັນທີ່ເຂົ້າພັກ
                  </Typography>
                  <Box display="flex" gap={2}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, flex: 1 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box 
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'success.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          🟢
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            ເຊັກອິນ
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {formatDate(selectedBooking.CheckinDate)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        ເວລາ: 14:00 PM
                      </Typography>
                    </Paper>

                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, flex: 1 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box 
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'error.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          🔴
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            ເຊັກເອົາ
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {formatDate(selectedBooking.CheckoutDate)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        ເວລາ: 12:00 PM
                      </Typography>
                    </Paper>
                  </Box>
                  
                  <Box mt={2} textAlign="center">
                    <Chip 
                      label={`${calculateNights(
                        typeof selectedBooking.CheckinDate === 'string' ? selectedBooking.CheckinDate : selectedBooking.CheckinDate.toISOString(),
                        typeof selectedBooking.CheckoutDate === 'string' ? selectedBooking.CheckoutDate : selectedBooking.CheckoutDate.toISOString()
                      )} ຄືນ`}
                      color="primary"
                      variant="filled"
                      size="medium"
                      sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                    />
                  </Box>
                </Box>

                {/* Price Breakdown */}
                <Box mb={4}>
                  <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
                    💰 ລາຍລະອຽດລາຄາ
                  </Typography>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography>
                        {selectedBooking.room?.roomType?.TypeName} × {calculateNights(
                          typeof selectedBooking.CheckinDate === 'string' ? selectedBooking.CheckinDate : selectedBooking.CheckinDate.toISOString(),
                          typeof selectedBooking.CheckoutDate === 'string' ? selectedBooking.CheckoutDate : selectedBooking.CheckoutDate.toISOString()
                        )} ຄືນ
                      </Typography>
                      <Typography fontWeight="medium">
                        {formatCurrency((selectedBooking.room?.RoomPrice || 0) * calculateNights(
                          typeof selectedBooking.CheckinDate === 'string' ? selectedBooking.CheckinDate : selectedBooking.CheckinDate.toISOString(),
                          typeof selectedBooking.CheckoutDate === 'string' ? selectedBooking.CheckoutDate : selectedBooking.CheckoutDate.toISOString()
                        ))}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography color="text.secondary">
                        ຄ່າບໍລິການ
                      </Typography>
                      <Typography color="text.secondary">
                        ລວມແລ້ວ
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography color="text.secondary">
                        ພາສີ VAT (0%)
                      </Typography>
                      <Typography color="text.secondary">
                        ₭0
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        borderTop: '2px solid',
                        borderColor: 'divider',
                        pt: 2,
                        mt: 2
                      }}
                    >
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6" fontWeight="bold">
                          ລວມທັງໝົດ
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          {formatCurrency((selectedBooking.room?.RoomPrice || 0) * calculateNights(
                            typeof selectedBooking.CheckinDate === 'string' ? selectedBooking.CheckinDate : selectedBooking.CheckinDate.toISOString(),
                            typeof selectedBooking.CheckoutDate === 'string' ? selectedBooking.CheckoutDate : selectedBooking.CheckoutDate.toISOString()
                          ))}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>

                {/* Hotel Contact Information */}
                <Box mb={3}>
                  <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
                    📞 ຂໍ້ມູນການຕິດຕໍ່
                  </Typography>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          ໂທລະສັບ
                        </Typography>
                        <Typography fontWeight="medium">
                          +856 20 7776 3575
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          ອີເມລ
                        </Typography>
                        <Typography fontWeight="medium">
                          info@dongxaihotel.com
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          ທີ່ຢູ່
                        </Typography>
                        <Typography fontWeight="medium">
                          Nabong Village, Thakhaek District
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          ເວັບໄຊທ໌
                        </Typography>
                        <Typography fontWeight="medium" color="primary">
                          www.dongxaihotel.com
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </Box>
            </DialogContent>

            {/* Actions */}
            <Box 
              sx={{ 
                p: 3, 
                bgcolor: 'grey.50',
                borderTop: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box display="flex" gap={2} justifyContent="flex-end" flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<span>🖨️</span>}
                  onClick={() => {
                    // ดึงข้อมูลลูกค้าจาก booking หรือ session
                    const customerName = selectedBooking.customer?.CustomerName || 
                                       session?.user?.name || 
                                       session?.user?.CustomerName || 
                                       'ບໍ່ລະບຸ'
                    
                    const customerTel = selectedBooking.customer?.CustomerTel || 
                                      session?.user?.CustomerTel || 
                                      'ບໍ່ລະບຸ'
                    
                    const bookingData = {
                      bookingId: selectedBooking.BookingId,
                      roomType: selectedBooking.room?.roomType?.TypeName || 'N/A',
                      roomPrice: selectedBooking.room?.RoomPrice || 0,
                      checkinDate: typeof selectedBooking.CheckinDate === 'string' ? selectedBooking.CheckinDate : selectedBooking.CheckinDate.toISOString(),
                      checkoutDate: typeof selectedBooking.CheckoutDate === 'string' ? selectedBooking.CheckoutDate : selectedBooking.CheckoutDate.toISOString(),
                      statusId: selectedBooking.StatusId,
                      statusName: selectedBooking.bookingStatus?.StatusName || '',
                      totalPrice: (selectedBooking.room?.RoomPrice || 0) * calculateNights(
                        typeof selectedBooking.CheckinDate === 'string' ? selectedBooking.CheckinDate : selectedBooking.CheckinDate.toISOString(), 
                        typeof selectedBooking.CheckoutDate === 'string' ? selectedBooking.CheckoutDate : selectedBooking.CheckoutDate.toISOString()
                      ),
                      nights: calculateNights(
                        typeof selectedBooking.CheckinDate === 'string' ? selectedBooking.CheckinDate : selectedBooking.CheckinDate.toISOString(), 
                        typeof selectedBooking.CheckoutDate === 'string' ? selectedBooking.CheckoutDate : selectedBooking.CheckoutDate.toISOString()
                      ),
                      customerName: customerName,
                      customerTel: customerTel
                    }
                    BookingPrintService.printBooking(bookingData)
                  }}
                >
                  ພິມບັດຈອງ
                </Button>
                
                {canCancel(selectedBooking.StatusId) && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<span>🗑️</span>}
                    onClick={() => {
                      setSelectedBookingId(selectedBooking.BookingId)
                      setCancelDialogOpen(true)
                      setBookingDetailOpen(false)
                    }}
                  >
                    ຍົກເລີກການຈອງ
                  </Button>
                )}
                
                {selectedBooking.StatusId === 4 && (
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<span>⭐</span>}
                    onClick={() => {
                      alert('ໃຫ້ຄະແນນແລະຄຳຄິດເຫັນ (ຟີເຈີນີ້ຈະມາໃນອະນາຄົດ)')
                    }}
                  >
                    ໃຫ້ຄະແນນ
                  </Button>
                )}
                
                <Button
                  variant="contained"
                  startIcon={<span>📞</span>}
                  onClick={() => {
                    window.open('tel:+85620776355', '_self')
                  }}
                >
                  ໂທຫາໂຮງແຮມ
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default CustomerBookingComponent