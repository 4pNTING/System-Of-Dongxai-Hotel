import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Type Imports - รองรับทั้ง CheckIn และ Booking
interface CheckInActionButtonsProps {
  item: any // รองรับทั้ง CheckIn และ Booking
  onCheckin?: (item: any) => Promise<void>
  onCancel?: (item: any) => Promise<void>
  onEdit?: (item: any) => void
  onDelete?: (item: any) => Promise<void>
  currentUserRole?: number
}

const CheckInActionButtons = ({ 
  item, 
  onCheckin,
  onCancel,
  onEdit,
  onDelete,
  currentUserRole = 0 
}: CheckInActionButtonsProps) => {
  const [checkinDialogOpen, setCheckinDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [canPerformActions, setCanPerformActions] = useState(false)
  
  const { data: session } = useSession()
  
  const getUserRoleFromSession = (): number => {
    try {
      if (currentUserRole !== undefined && currentUserRole > 0) {
        return currentUserRole
      }
      
      if (session?.user?.roleId) {
        const roleId = typeof session.user.roleId === 'string' 
          ? parseInt(session.user.roleId, 10) 
          : session.user.roleId
        return roleId
      }
      
      return 0
    } catch (error) {
      console.error('Error getting user role from session:', error)
      return 0
    }
  }
  
  useEffect(() => {
    const userRole = getUserRoleFromSession()
    const isManager = userRole === 4
    const isAdmin = userRole === 1
    const isReceptionist = userRole === 2
    
    setCanPerformActions(isManager || isAdmin || isReceptionist)
  }, [item, currentUserRole, session])
  
  // ตรวจสอบประเภทของ item
  const isBooking = item.type === 'booking' || (!item.CheckInId && item.BookingId)
  const isCheckIn = item.type === 'checkin' || item.CheckInId
  
  // สำหรับ booking: ตรวจสอบว่าสามารถเช็คอินได้หรือไม่
  const canCheckin = isBooking && item.status === 'confirmed' && item.StatusId === 2
  const isCheckedIn = isCheckIn && item.status === 'checked_in'
  
  // สำหรับทั้งคู่: ตรวจสอบว่าสามารถยกเลิกได้หรือไม่
  const canCancel = isBooking && item.StatusId === 2

  // Handlers
  const handleCheckinClick = () => {
    if (canCheckin && canPerformActions) {
      setCheckinDialogOpen(true)
    }
  }
  
  const handleCancelClick = () => {
    if (canCancel && canPerformActions) {
      setCancelDialogOpen(true)
    }
  }
  
  const handleDeleteClick = () => {
    if (isCheckIn && canPerformActions) {
      setDeleteDialogOpen(true)
    }
  }
  
  const handleEditClick = () => {
    if (isCheckIn && canPerformActions && onEdit) {
      onEdit(item)
    }
  }
  
  const handleCheckinConfirm = async () => {
    if (!onCheckin) return
    try {
      setIsProcessing(true)
      await onCheckin(item)
      setCheckinDialogOpen(false)
    } catch (error) {
      console.error('Error checking in:', error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleCancelConfirm = async () => {
    if (!onCancel) return
    try {
      setIsProcessing(true)
      await onCancel(item)
      setCancelDialogOpen(false)
    } catch (error) {
      console.error('Error cancelling:', error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleDeleteConfirm = async () => {
    if (!onDelete) return
    try {
      setIsProcessing(true)
      await onDelete(item)
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting:', error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleDialogCancel = () => {
    setCheckinDialogOpen(false)
    setCancelDialogOpen(false)
    setDeleteDialogOpen(false)
  }

  // สร้าง display info สำหรับ dialogs
  const getDisplayInfo = () => {
    if (isBooking) {
      return {
        id: item.BookingId,
        idLabel: 'ລະຫັດການຈອງ',
        customer: item.customer?.CustomerName || 'N/A',
        room: item.RoomId,
        checkinDate: item.CheckinDate,
        checkoutDate: item.CheckoutDate
      }
    } else {
      return {
        id: item.CheckInId,
        idLabel: 'ລະຫັດເຊັກອິນ',
        customer: item.customer?.CustomerName || 'N/A',
        room: item.RoomId,
        checkinDate: item.CheckInDate,
        checkoutDate: item.CheckoutDate
      }
    }
  }

  const displayInfo = getDisplayInfo()

  return (
    <>
      <div className='flex items-center justify-center gap-2'>
        {/* ปุ่มเช็คอิน - แสดงเสมอ */}
        <Tooltip title={
          isCheckedIn ? 'ກຳລັງພັກ - ບໍ່ສາມາດເຊັກອິນໄດ້' :
          !canPerformActions ? 'ບໍ່ມີສິດການເຊັກອິນ' :
          !canCheckin ? 'ບໍ່ສາມາດເຊັກອິນໄດ້' : 'ເຊັກອິນ'
        }>
          <span>
            <IconButton
              color={isCheckedIn ? 'default' : 'success'}
              onClick={handleCheckinClick}
              size='small'
              disabled={!canPerformActions || !canCheckin || isCheckedIn}
              sx={{ 
                opacity: (!canPerformActions || !canCheckin || isCheckedIn) ? 0.3 : 1,
                cursor: (!canPerformActions || !canCheckin || isCheckedIn) ? 'not-allowed' : 'pointer',
                backgroundColor: isCheckedIn ? 'grey.300' : 
                                 canPerformActions && canCheckin ? 'success.main' : 'grey.300',
                color: isCheckedIn ? 'grey.500' :
                       canPerformActions && canCheckin ? 'white' : 'grey.500',
                '&:hover': {
                  backgroundColor: isCheckedIn ? 'grey.300' :
                                   canPerformActions && canCheckin ? 'success.dark' : 'grey.300',
                }
              }}
            >
              <i className='tabler-door-enter text-lg' />
            </IconButton>
          </span>
        </Tooltip>

        {/* ปุ่มแก้ไข - แสดงเสมอสำหรับ check-in */}
        <Tooltip title={
          !canPerformActions ? 'ບໍ່ມີສິດການແກ້ໄຂ' :
          !isCheckIn ? 'ບໍ່ສາມາດແກ້ໄຂໄດ້' : 'ແກ້ໄຂ'
        }>
          <span>
            <IconButton
              color='primary'
              onClick={handleEditClick}
              size='small'
              disabled={!canPerformActions || !isCheckIn}
              sx={{ 
                opacity: (!canPerformActions || !isCheckIn) ? 0.3 : 1,
                cursor: (!canPerformActions || !isCheckIn) ? 'not-allowed' : 'pointer'
              }}
            >
              <i className='tabler-edit text-lg' />
            </IconButton>
          </span>
        </Tooltip>

        {/* ปุ่มยกเลิก - แสดงเสมอสำหรับ booking */}
        <Tooltip title={
          !canPerformActions ? 'ບໍ່ມີສິດການຍົກເລີກ' :
          !canCancel ? 'ບໍ່ສາມາດຍົກເລີກໄດ້' : 'ຍົກເລີກ'
        }>
          <span>
            <IconButton
              color='warning'
              onClick={handleCancelClick}
              size='small'
              disabled={!canPerformActions || !canCancel}
              sx={{ 
                opacity: (!canPerformActions || !canCancel) ? 0.3 : 1,
                cursor: (!canPerformActions || !canCancel) ? 'not-allowed' : 'pointer'
              }}
            >
              <i className='tabler-x text-lg' />
            </IconButton>
          </span>
        </Tooltip>

        {/* ปุ่มลบ - แสดงเสมอสำหรับ check-in */}
        <Tooltip title={
          !canPerformActions ? 'ບໍ່ມີສິດການລົບ' :
          !isCheckIn ? 'ບໍ່ສາມາດລົບໄດ້' : 'ລົບ'
        }>
          <span>
            <IconButton
              color='error'
              onClick={handleDeleteClick}
              size='small'
              disabled={!canPerformActions || !isCheckIn}
              sx={{ 
                opacity: (!canPerformActions || !isCheckIn) ? 0.3 : 1,
                cursor: (!canPerformActions || !isCheckIn) ? 'not-allowed' : 'pointer'
              }}
            >
              <i className='tabler-trash text-lg' />
            </IconButton>
          </span>
        </Tooltip>
      </div>

      {/* Check-in Confirmation Dialog */}
      <Dialog open={checkinDialogOpen} onClose={handleDialogCancel} maxWidth="sm" fullWidth>
        <DialogTitle>ຢືນຢັນການເຊັກອິນ</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການເຊັກອິນການຈອງນີ້?
          </DialogContentText>
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
            <Typography variant="body2"><strong>{displayInfo.idLabel}:</strong> #{displayInfo.id}</Typography>
            <Typography variant="body2"><strong>ລູກຄ້າ:</strong> {displayInfo.customer}</Typography>
            <Typography variant="body2"><strong>ຫ້ອງພັກ:</strong> {displayInfo.room}</Typography>
            <Typography variant="body2"><strong>ວັນທີເຂົ້າພັກ:</strong> {new Date(displayInfo.checkinDate).toLocaleDateString('th-TH')}</Typography>
            <Typography variant="body2"><strong>ວັນທີອອກຈາກຫ້ອງ:</strong> {new Date(displayInfo.checkoutDate).toLocaleDateString('th-TH')}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel} disabled={isProcessing}>ຍົກເລີກ</Button>
          <Button 
            onClick={handleCheckinConfirm} 
            variant="contained" 
            color="success"
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <i className='tabler-door-enter' />}
          >
            {isProcessing ? 'ກຳລັງເຊັກອິນ...' : 'ຢືນຢັນເຊັກອິນ'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleDialogCancel} maxWidth="sm" fullWidth>
        <DialogTitle>ຢືນຢັນການຍົກເລີກ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຍົກເລີກການຈອງນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel} disabled={isProcessing}>ກັບຄືນ</Button>
          <Button 
            onClick={handleCancelConfirm} 
            variant="contained" 
            color="error"
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <i className='tabler-x' />}
          >
            {isProcessing ? 'ກຳລັງຍົກເລີກ...' : 'ຢືນຢັນຍົກເລີກ'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDialogCancel} maxWidth="sm" fullWidth>
        <DialogTitle>ຢືນຢັນການລົບ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບການເຊັກອິນນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel} disabled={isProcessing}>ຍົກເລີກ</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <i className='tabler-trash' />}
          >
            {isProcessing ? 'ກຳລັງລົບ...' : 'ລົບ'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CheckInActionButtons