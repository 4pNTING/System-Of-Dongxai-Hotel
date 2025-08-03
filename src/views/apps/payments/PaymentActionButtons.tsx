import React from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PrintIcon from '@mui/icons-material/Print'
import RefreshIcon from '@mui/icons-material/Refresh'

interface PaymentActionButtonsProps {
  item: any
  currentUserRole: number
  onView?: (item: any) => void
  onPrint?: (item: any) => void
  onRefund?: (item: any) => Promise<void>
}

const PaymentActionButtons: React.FC<PaymentActionButtonsProps> = ({
  item,
  currentUserRole,
  onView,
  onPrint,
  onRefund
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleView = () => {
    handleClose()
    onView?.(item)
  }

  const handlePrint = () => {
    handleClose()
    onPrint?.(item)
  }

  const handleRefund = async () => {
    handleClose()
    await onRefund?.(item)
  }

  // ตรวจสอบว่าสามารถคืนเงินได้หรือไม่
  const canRefund = item?.paymentStatus === 'paid' || item?.paymentStatus === 'completed'
  
  return (
    <div className="flex items-center gap-1">
      {/* Quick Actions */}
      <Tooltip title="ເບິ່ງລາຍລະອຽດ">
        <IconButton size="small" onClick={() => onView?.(item)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="ພິມໃບເສັດ">
        <IconButton size="small" onClick={() => onPrint?.(item)}>
          <PrintIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* More Actions Menu */}
      <Tooltip title="ເພີ່ມເຕີມ">
        <IconButton size="small" onClick={handleClick}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          ເບິ່ງລາຍລະອຽດ
        </MenuItem>

        <MenuItem onClick={handlePrint}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          ພິມໃບເສັດ
        </MenuItem>

        {canRefund && (currentUserRole === 1 || currentUserRole === 2) && (
          <MenuItem onClick={handleRefund} sx={{ color: 'warning.main' }}>
            <ListItemIcon>
              <RefreshIcon fontSize="small" sx={{ color: 'warning.main' }} />
            </ListItemIcon>
            ຄືນເງິນ
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}

export default PaymentActionButtons
