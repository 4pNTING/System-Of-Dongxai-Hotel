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

// Icon Imports  
import LogoutIcon from '@mui/icons-material/Logout'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

interface CheckOutActionButtonsProps {
  item: any // CheckOut or CheckIn item
  type: 'checkin' | 'checkout' // Type of item (checkin = ready for checkout, checkout = completed)
  onCheckout?: (item: any) => Promise<void>
  onEdit?: (item: any) => void
  onDelete?: (item: any) => Promise<void>
  currentUserRole?: number
  showCheckoutButtons?: boolean // Show checkout buttons for currently checked-in rooms
}

const CheckOutActionButtons = ({ 
  item, 
  type,
  onCheckout,
  onEdit,
  onDelete,
  currentUserRole = 0,
  showCheckoutButtons = false
}: CheckOutActionButtonsProps) => {
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)
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
      console.error('Error getting user role:', error)
      return 0
    }
  }

  useEffect(() => {
    const userRole = getUserRoleFromSession()
    setCanPerformActions(userRole >= 2) // Staff level and above can perform actions
  }, [session, currentUserRole])

  // Handle checkout action for currently staying guests
  const handleCheckout = async () => {
    if (!onCheckout || !canPerformActions) return
    
    setIsProcessing(true)
    try {
      await onCheckout(item)
      setCheckoutDialogOpen(false)
    } catch (error) {
      console.error('Checkout failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle delete action for completed checkouts
  const handleDelete = async () => {
    if (!onDelete || !canPerformActions) return
    
    setIsProcessing(true)
    try {
      await onDelete(item)
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!canPerformActions) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 40 }}>
        <Typography variant="caption" color="textSecondary">
          ບໍ່ມີສິດ
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
      {/* Checkout Button for CheckIn Records (Currently Staying) */}
      {type === 'checkin' && onCheckout && (
        <Tooltip title="ເຊັກເອົາ">
          <IconButton
            size="small"
            color="success"
            onClick={() => setCheckoutDialogOpen(true)}
            sx={{
              '&:hover': {
                backgroundColor: 'success.lighter',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Edit Button for CheckOut Records (Completed Checkouts) */}
      {type === 'checkout' && onEdit && (
        <Tooltip title="ແກ້ໄຂ">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(item)}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.lighter',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Delete Button for CheckOut Records (Completed Checkouts) */}
      {type === 'checkout' && onDelete && (
        <Tooltip title="ລຶບ">
          <IconButton
            size="small"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              '&:hover': {
                backgroundColor: 'error.lighter',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Checkout Confirmation Dialog */}
      <Dialog open={checkoutDialogOpen} onClose={() => setCheckoutDialogOpen(false)}>
        <DialogTitle>ຢືນຢັນການເຊັກເອົາ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການເຊັກເອົາລູກຄ້າອອກຈາກຫ້ອງ {item.RoomId || item.room?.RoomId}?
            <br />
            <strong>ລູກຄ້າ:</strong> {item.customer?.CustomerName || item.checkIn?.customer?.CustomerName}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutDialogOpen(false)} disabled={isProcessing}>
            ຍົກເລີກ
          </Button>
          <Button 
            onClick={handleCheckout} 
            color="success"
            variant="contained"
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={16} /> : null}
          >
            {isProcessing ? 'ກຳລັງດຳເນີນການ...' : 'ເຊັກເອົາ'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>ຢືນຢັນການລຶບ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບການເຊັກເອົານີ້? ການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isProcessing}>
            ຍົກເລີກ
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={16} /> : null}
          >
            {isProcessing ? 'ກຳລັງລຶບ...' : 'ລຶບ'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CheckOutActionButtons