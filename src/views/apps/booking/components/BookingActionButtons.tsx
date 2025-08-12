// src/views/apps/booking/components/BookingActionButtons.tsx
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
import TextField from '@mui/material/TextField'

// Type Imports
import { Booking } from '@core/domain/models/booking/list.model'

// Toast Import
import { toast } from 'react-toastify'
import { MESSAGES } from '../../../../libs/constants/messages.constant'

interface BookingActionButtonsProps {
  booking: Booking
  onEdit?: (booking: Booking) => void
  onDelete: (id: number) => Promise<void>
  onConfirm?: (booking: Booking) => Promise<void>
  onCheckin?: (booking: Booking) => Promise<void>
  onCancel?: (booking: Booking) => Promise<void>
  currentUserRole?: number
}

const BookingActionButtons = ({ 
  booking, 
  onEdit, 
  onDelete, 
  onConfirm,
  onCheckin,
  onCancel,
  currentUserRole = 0 
}: BookingActionButtonsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  const [canConfirm, setCanConfirm] = useState(false)
  const [deposit, setDeposit] = useState<number>(0) // มัดจำที่พนักงานกำหนด
  const [depositError, setDepositError] = useState<string>('')
  
  // ใช้ useSession hook จาก next-auth/react
  const { data: session } = useSession()
  
  // ฟังก์ชันสำหรับดึงข้อมูล role จาก session
  const getUserRoleFromSession = (): number => {
    try {
      // 1. ตรวจสอบ prop ที่ส่งเข้ามา
      if (currentUserRole !== undefined && currentUserRole > 0) {
        return currentUserRole
      }
      
      // 2. ตรวจสอบจาก next-auth session
      if (session?.user?.roleId) {
        const roleId = typeof session.user.roleId === 'string' 
          ? parseInt(session.user.roleId, 10) 
          : session.user.roleId
        return roleId
      }
      
      // 3. ตรวจสอบจาก sessionStorage
      const sessionData = sessionStorage.getItem('user')
      if (sessionData) {
        const userData = JSON.parse(sessionData)
        if (userData.roleId && typeof userData.roleId === 'number') {
          return userData.roleId
        }
      }
      
      // 4. ตรวจสอบจาก localStorage (zustand persist)
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        const authData = JSON.parse(authStorage)
        if (authData.state?.user?.roleId) {
          return authData.state.user.roleId
        }
      }
      
      return 0
    } catch (error) {
      console.error('Error getting user role from session:', error)
      return 0
    }
  }
  
  // ตรวจสอบสิทธิ์การแก้ไข, ลบ และยืนยันการจอง
  useEffect(() => {
    const userRole = getUserRoleFromSession()
  
    const isManager = userRole === 4
    const isAdmin = userRole === 1
    const isReceptionist = userRole === 2
  
    // กำหนดสิทธิ์: 
    // - Admin (roleId=1) สามารถแก้ไข, ลบ และยืนยันได้
    // - Manager (roleId=4) สามารถแก้ไข, ลบ และยืนยันได้
    // - Receptionist (roleId=2) สามารถแก้ไขและยืนยันได้แต่ลบไม่ได้
    setCanEdit(isManager || isAdmin || isReceptionist)
    setCanDelete(isManager || isAdmin)
    setCanConfirm(isManager || isAdmin || isReceptionist)
  }, [booking, currentUserRole, session])
  
  // ตรวจสอบว่าสถานะการจองเป็น "รอการยืนยัน" หรือไม่
  const isPendingConfirmation = () => {
    // สมมติว่า StatusId = 1 คือสถานะ "รอการยืนยัน"
    return booking.StatusId === 1
  }
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(booking)
    }
  }
  
  const handleDeleteClick = async () => {
    setDeleteDialogOpen(true)
    return Promise.resolve()
  }
  
  const handleConfirmClick = () => {
    setConfirmDialogOpen(true)
  }
  
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      await onDelete(booking.BookingId)
      setDeleteDialogOpen(false)
      toast.success(MESSAGES.SUCCESS.DELETE)
    } catch (error) {
      console.error('Error deleting booking:', error)
      toast.error(MESSAGES.ERROR.DELETE)
    } finally {
      setIsDeleting(false)
    }
  }
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    toast.info(MESSAGES.SUCCESS.CANCElED)
  }
  
  const validateDeposit = (): boolean => {
    setDepositError('')
    const roomPrice = booking.room?.RoomPrice || 0
    
    if (deposit < 0) {
      setDepositError('ມັດຈໍາບໍ່ສາມາດນ້ອຍກວ່າ 0')
      return false
    }
    
    if (deposit > roomPrice) {
      setDepositError(`ມັດຈໍາບໍ່ສາມາດເກີນລາຄາຫ້ອງ ${roomPrice.toLocaleString()} LAK`)
      return false
    }
    
    return true
  }

  const handleConfirmBooking = async () => {
    if (!validateDeposit()) {
      return
    }
    
    try {
      setIsConfirming(true)
      if (onConfirm) {
        // ສົ່ງຂໍ້ມູນການຈອງທີ່ມີມັດຈໍາ
        const bookingWithDeposit = {
          ...booking,
          deposit: deposit
        }
        await onConfirm(bookingWithDeposit)
        toast.success(`ຍືນຍັນການຈອງສໍາເລັດແລ້ວ${deposit > 0 ? ` (ມັດຈໍາ: ${deposit.toLocaleString()} LAK)` : ''}`)
      }
      setConfirmDialogOpen(false)
      setDeposit(0) // Reset deposit
      setDepositError('')
    } catch (error) {
      console.error('Error confirming booking:', error)
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການຢືນຢັນການຈອງ')
    } finally {
      setIsConfirming(false)
    }
  }
  
  const handleConfirmCancel = () => {
    setConfirmDialogOpen(false)
    toast.info(MESSAGES.SUCCESS.CANCElED)
  }
  
  // แสดงปุ่มทั้งหมดเสมอ แต่ disable ตามเงื่อนไข
  return (
    <>
      <div className='flex items-center justify-center gap-2'>
        {/* ปุ่มยืนยันการจอง - แสดงเสมอ แต่ disable เมื่อไม่ใช่สถานะรอการยืนยัน */}
        <Tooltip title={
          !isPendingConfirmation() 
            ? 'ສະຖານະບໍ່ໃຊ່ຮອການຢືນຢັນ' 
            : canConfirm 
              ? 'ຢືນຢັນການຈອງ' 
              : 'ບໍ່ມີສິດການຢືນຢັນ'
        }>
          <span>
            <IconButton
              color='success'
              onClick={handleConfirmClick}
              size='small'
              disabled={!isPendingConfirmation() || !canConfirm}
              sx={{ 
                opacity: (isPendingConfirmation() && canConfirm) ? 1 : 0.3,
                cursor: (isPendingConfirmation() && canConfirm) ? 'pointer' : 'not-allowed',
                backgroundColor: (isPendingConfirmation() && canConfirm) ? 'success.main' : 'grey.300',
                color: (isPendingConfirmation() && canConfirm) ? 'white' : 'grey.500',
                '&:hover': {
                  backgroundColor: (isPendingConfirmation() && canConfirm) ? 'success.dark' : 'grey.300',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'grey.300',
                  color: 'grey.500'
                }
              }}
            >
              <i className='tabler-check text-lg' />
            </IconButton>
          </span>
        </Tooltip>
        
        {/* ปุ่มแก้ไข - แสดงเสมอ */}
        <Tooltip title={canEdit ? 'ແກ້ໄຂ' : 'ບໍ່ມີສິດການແກ້ໄຂ'}>
          <span>
            <IconButton
              color='primary'
              onClick={handleEdit}
              size='small'
              disabled={!canEdit}
              sx={{ 
                opacity: canEdit ? 1 : 0.3,
                cursor: canEdit ? 'pointer' : 'not-allowed'
              }}
            >
              <i className='tabler-edit text-lg' />
            </IconButton>
          </span>
        </Tooltip>
        
        {/* ปุ่มลบ - แสดงเสมอ */}
        <Tooltip title={canDelete ? 'ລົບ' : 'ບໍ່ມີສິດການລົບ'}>
          <span>
            <IconButton
              color='error'
              onClick={handleDeleteClick}
              size='small'
              disabled={!canDelete}
              sx={{ 
                opacity: canDelete ? 1 : 0.3,
                cursor: canDelete ? 'pointer' : 'not-allowed'
              }}
            >
              <i className='tabler-trash text-lg' />
            </IconButton>
          </span>
        </Tooltip>
      </div>
      
      {/* Dialog ยืนยันการลบ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        closeAfterTransition={false}
      >
        <DialogTitle id='alert-dialog-title'>ຢືນຢັນການລົບການຈອງ</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບການຈອງນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button 
            variant='contained' 
            endIcon={<i className='tabler-send' />}
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            ຍົກເລີກ
          </Button>
          <Button 
            variant='contained' 
            color='secondary' 
            startIcon={isDeleting ? <CircularProgress size={20} /> : <i className='tabler-trash' />}
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'ກຳລັງລົບ...' : 'ລົບ'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog ยืนยันการจอง */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmCancel}
        aria-labelledby='confirm-dialog-title'
        aria-describedby='confirm-dialog-description'
        closeAfterTransition={false}
      >
        <DialogTitle id='confirm-dialog-title'>ຢືນຢັນການຈອງ</DialogTitle>
        <DialogContent>
          <DialogContentText id='confirm-dialog-description'>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຢືນຢັນການຈອງນີ້? ການຢືນຢັນຈະປ່ຽນສະຖານະການຈອງເປັນ "ຢືນຢັນແລ້ວ"
          </DialogContentText>
          
          {/* ສ່ວນສໍາລັບກໍານີດມັດຈໍາ */}
          <div style={{ marginTop: '20px' }}>
            <TextField
              type="number"
              label='ມັດຈໍາ (LAK)'
              fullWidth
              value={deposit || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = parseFloat(e.target.value) || 0
                setDeposit(value)
                setDepositError('') // Clear error when user types
              }}
              error={!!depositError}
              helperText={depositError || `ລາຄາຫ້ອງ: ${(booking.room?.RoomPrice || 0).toLocaleString()} LAK | ມັດຈໍາສູງສຸດ: ${(booking.room?.RoomPrice || 0).toLocaleString()} LAK`}
              disabled={isConfirming}
              inputProps={{ 
                min: 0, 
                max: booking.room?.RoomPrice || 0,
                step: 1000,
                placeholder: '0'
              }}
              InputProps={{
                startAdornment: (
                  <span style={{ marginRight: '8px', color: '#666' }}>💰</span>
                ),
              }}
              sx={{ 
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#4CAF50',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4CAF50',
                  },
                }
              }}
            />
            
            {/* ສະແດງການຄິດໄລ່ລາຄາ */}
            {deposit > 0 && (
              <div style={{ 
                marginTop: '12px', 
                padding: '12px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>ລາຄາຫ້ອງ:</span>
                  <span>{(booking.room?.RoomPrice || 0).toLocaleString()} LAK</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#f44336' }}>
                  <span>ມັດຈໍາ:</span>
                  <span>-{deposit.toLocaleString()} LAK</span>
                </div>
                <hr style={{ margin: '8px 0', border: '0', borderTop: '1px solid #ddd' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#4CAF50' }}>
                  <span>ລາຄາສຸດທິ:</span>
                  <span>{((booking.room?.RoomPrice || 0) - deposit).toLocaleString()} LAK</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button 
            variant='contained' 
            endIcon={<i className='tabler-x' />}
            onClick={handleConfirmCancel}
            disabled={isConfirming}
          >
            ຍົກເລີກ
          </Button>
          <Button 
            variant='contained' 
            color='success' 
            startIcon={isConfirming ? <CircularProgress size={20} /> : <i className='tabler-check' />}
            onClick={handleConfirmBooking}
            disabled={isConfirming}
          >
            {isConfirming ? 'ກຳລັງຢືນຢັນ...' : 'ຢືນຢັນ'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BookingActionButtons