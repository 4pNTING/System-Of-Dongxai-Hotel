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

interface CheckOutActionButtonsProps {
  item: any // CheckOut item
  onEdit?: (item: any) => void
  onDelete?: (item: any) => Promise<void>
  currentUserRole?: number
}

const CheckOutActionButtons = ({ 
  item, 
  onEdit,
  onDelete,
  currentUserRole = 0 
}: CheckOutActionButtonsProps) => {
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

  // Handlers
  const handleDeleteClick = () => setDeleteDialogOpen(true)
  const handleEditClick = () => onEdit && onEdit(item)
  
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
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <div className='flex items-center justify-center gap-2'>
        {/* ปุ่มดูรายละเอียด */}
        <Tooltip title="ດູລາຍລະອຽດ">
          <IconButton
            color='info'
            size='small'
            onClick={handleEditClick}
          >
            <i className='tabler-eye text-lg' />
          </IconButton>
        </Tooltip>

        {/* ปุ่มลบ - เฉพาะ Admin/Manager */}
        {(getUserRoleFromSession() === 1 || getUserRoleFromSession() === 4) && onDelete && (
          <Tooltip title={canPerformActions ? 'ລົບ' : 'ບໍ່ມີສິດການລົບ'}>
            <span>
              <IconButton
                color='error'
                onClick={handleDeleteClick}
                size='small'
                disabled={!canPerformActions}
                sx={{ 
                  opacity: canPerformActions ? 1 : 0.3,
                  cursor: canPerformActions ? 'pointer' : 'not-allowed'
                }}
              >
                <i className='tabler-trash text-lg' />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDialogCancel} maxWidth="sm" fullWidth>
        <DialogTitle>ຢືນຢັນການລົບ</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບການເຊັກເອົານີ້? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
          </DialogContentText>
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
            <Typography variant="body2"><strong>ລະຫັດເຊັກເອົາ:</strong> #{item.CheckOutId}</Typography>
            <Typography variant="body2"><strong>ລູກຄ້າ:</strong> {item.checkIn?.customer?.CustomerName || 'N/A'}</Typography>
            <Typography variant="body2"><strong>ຫ້ອງພັກ:</strong> {item.RoomId}</Typography>
            <Typography variant="body2"><strong>ວັນທີເຊັກເອົາ:</strong> {new Date(item.CheckOutDate).toLocaleDateString('th-TH')}</Typography>
          </Box>
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

export default CheckOutActionButtons