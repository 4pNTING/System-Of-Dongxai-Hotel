// src/views/apps/booking/BookingTable.tsx
'use client'

// React Imports
import { useEffect, useMemo, useState, useCallback } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import classnames from 'classnames'
import {useReactTable, getCoreRowModel, getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, getPaginationRowModel, getSortedRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Icon Imports
import ChevronRight from '@menu/svg/ChevronRight'

// Style Imports
import styles from '@core/styles/table.module.css'

// Component Imports
import BookingStatusChip from './components/BookingStatus'
import BookingActionButtons from './components/BookingActionButtons'

// Store Imports
import { useBookingStore } from '@/@core/infrastructure/store/booking/booking.store'
import { toast } from 'react-toastify'
import { MESSAGES } from '../../../libs/constants/messages.constant'
import { Booking } from '@core/domain/models/booking/list.model'
import { BookingStatus } from '@core/domain/models/booking/booking-status/list.model'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank
  })

  return itemRank.passed
}

// Helper function to format dates
const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-GB'); 
}

interface BookingTableProps {
  data: Booking[]
  loading: boolean
  onConfirm?: (item: Booking) => Promise<void>
  onCheckin?: (item: Booking) => Promise<void>
  onCancel?: (item: Booking) => Promise<void>
  onDelete?: (item: Booking) => Promise<void>
  currentUserRole: number
  bookingStatuses?: BookingStatus[]
}

const columnHelper = createColumnHelper<Booking>()

const BookingTable: React.FC<BookingTableProps> = ({ 
  data, 
  loading, 
  onConfirm,
  onCheckin,
  onCancel,
  onDelete,
  currentUserRole,
  bookingStatuses = []
}) => {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null)

  // Status mapping
  const statusMap = useMemo(() => {
    const map: {[key: number]: string} = {};
    bookingStatuses.forEach(status => {
      map[status.StatusId] = status.StatusName;
    });
    return map;
  }, [bookingStatuses]);

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const dataCopy = [...data];
    
    // เรียงลำดับตาม BookingId (ใหม่ไปเก่า)
    return dataCopy.sort((a, b) => {
      const aId = a.BookingId || 0;
      const bId = b.BookingId || 0;
      
      // เรียงจากมากไปน้อย (ล่าสุดอยู่บนสุด)
      return bId - aId;
    });
  }, [data]);

  // Handlers - ใช้ ID เพื่อให้ตรงกับ store
  const handleConfirmBooking = async (booking: Booking): Promise<void> => {
    try {
      if (onConfirm) {
        await onConfirm(booking);
        toast.success('ຢືນຢັນການຈອງແລ້ວ');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການຢືນຢັນການຈອງ');
      throw error; 
    }
  };

  const handleCheckinBooking = async (booking: Booking): Promise<void> => {
    try {
      if (onCheckin) {
        await onCheckin(booking);
        toast.success('ເຊັກອິນສໍາເລັດແລ້ວ');
      }
    } catch (error) {
      console.error('Error checking in booking:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການເຊັກອິນ');
      throw error;
    }
  };

  const handleCancelBooking = async (booking: Booking): Promise<void> => {
    try {
      if (onCancel) {
        await onCancel(booking);
        toast.success('ຍົກເລີກການຈອງສໍາເລັດແລ້ວ');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກ');
      throw error;
    }
  };

  const handleDeleteClick = async (booking: Booking): Promise<void> => {
    const hasDeletePermission = currentUserRole === 1 || currentUserRole === 4; // Admin or Manager
    
    if (!hasDeletePermission) {
      toast.error('ທ່ານບໍ່ມີສິດໃນການລຶບຂໍ້ມູນ');
      return Promise.resolve(); 
    }
    
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
    return Promise.resolve();
  }

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete || !onDelete) return;
    
    try {
      setIsDeleting(true);
      await onDelete(bookingToDelete);
      
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
      toast.success(MESSAGES.SUCCESS.DELETE);
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      
      if (error.response && error.response.status === 404) {
        toast.error(`ບໍ່ພົບຂໍ້ມູນການຈອງ: ${error.response.data.message || 'Booking not found'}`);
      } else if (error.message && typeof error.message === 'string') {
        toast.error(`ເກີດຂໍ້ຜິດພາດ: ${error.message}`);
      } else {
        toast.error(MESSAGES.ERROR.DELETE);
      }
      
      if (error.response && error.response.status === 404) {
        setDeleteDialogOpen(false);
        setBookingToDelete(null);
      }
    } finally {
      setIsDeleting(false);
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBookingToDelete(null);
  }

  // Function to get status text based on ID, using the status map from backend
  function getStatusText(statusId: number): string {
    // Try to get status name from our map
    if (statusMap[statusId]) {
      return statusMap[statusId];
    }
    
    // Fallback to hardcoded values if not found in map
    switch (statusId) {
      case 1: return 'ລໍຖ້າຢືນຢັນ';
      case 2: return 'ຢືນຢັນແລ້ວ';
      case 3: return 'ເຊັກອິນແລ້ວ';
      case 4: return 'ຊຳລະເງິນແລ້ວ';
      case 5: return 'ຍົກເລີກການຈອງ';
      case 6: return 'ຊຳລະເງິນ';
      case 7: return 'ຂໍຄືນເງິນມັດຈຳ';
      default: return `Status ID: ${statusId}`;
    }
  }

  // Hooks
  const columns = useMemo<ColumnDef<Booking, any>[]>(
    () => [
      // Sequence number column
      {
        id: 'sequence',
        header: () => (
          <div style={{ textAlign: 'center' }}>ລຳດັບ</div>
        ),
        cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>{row.index + 1}</div>
        )
      },
      columnHelper.accessor('BookingId', {
        header: () => (
          <div style={{ textAlign: 'center' }}>ລະຫັດການຈອງ</div>
        ),
        cell: info => (
          <div style={{ textAlign: 'center' }}>{(info.getValue())}</div>
        )
      }),
      columnHelper.accessor('RoomId', {
        header: () => (
          <div style={{ textAlign: 'center' }}>ຫ້ອງພັກ</div>
        ),
        cell: info => {
          const roomId = info.getValue();
          const booking = info.row.original;
          
          // Try to access roomType name from different possible paths
          const roomTypeName = booking.room?.roomType?.TypeName || '';
          const roomPrice = booking.room?.RoomPrice ? 
            booking.room.RoomPrice.toLocaleString() + ' ກີບ' : '';
          
          return (
            <div style={{ textAlign: 'center' }}>
              {roomId} 
              {roomTypeName ? ` - ${roomTypeName}` : ''} 
              {roomPrice ? ` (${roomPrice})` : ''}
            </div>
          );
        }
      }),
      columnHelper.accessor(row => {
        return row.customer?.CustomerName || 'N/A';
      }, {
        id: 'CustomerName',
        header: () => (
          <div style={{ textAlign: 'center' }}>ລູກຄ້າ</div>
        ),
        cell: info => (
          <div style={{ textAlign: 'center' }}>{info.getValue()}</div>
        )
      }),
      columnHelper.accessor('CheckinDate', {
        header: () => (
          <div style={{ textAlign: 'center' }}>ເຂົ້າພັກ</div>
        ),
        cell: info => (
          <div style={{ textAlign: 'center' }}>{formatDate(info.getValue())}</div>
        )
      }),
      columnHelper.accessor('CheckoutDate', {
        header: () => (
          <div style={{ textAlign: 'center' }}>ອອກຈາກຫ້ອງພັກ</div>
        ),
        cell: info => (
          <div style={{ textAlign: 'center' }}>{formatDate(info.getValue())}</div>
        )
      }),
      columnHelper.accessor(row => {
        // Try multiple ways to get the status name
        // 1. From bookingStatus object 
        // 2. From status map using StatusId
        return row.bookingStatus?.StatusName || getStatusText(row.StatusId);
      }, {
        id: 'StatusName',
        header: () => (
          <div style={{ textAlign: 'center' }}>ສະຖານະ</div>
        ),
        cell: info => {
          const statusName = info.getValue();
          const statusId = info.row.original.StatusId;
          
          return (
            <div style={{ textAlign: 'center' }}>
              <BookingStatusChip status={{ StatusId: statusId, StatusName: statusName }} />
            </div>
          );
        }
      }),
      // Actions column for confirm, checkin, cancel and delete
      {
        id: 'actions',
        header: () => (
          <div style={{ textAlign: 'center' }}>ຈັດການ</div>
        ),
        cell: ({ row }) => {
          const booking = row.original;
          
          return (
            <BookingActionButtons
              booking={booking}
              onConfirm={handleConfirmBooking}
              onCheckin={handleCheckinBooking}
              onCancel={handleCancelBooking}
              onDelete={(id: number) => handleDeleteClick(booking)} // แปลง signature ให้ตรงกับ BookingActionButtons
              currentUserRole={currentUserRole}
            />
          );
        }
      }
    ],
    [currentUserRole, statusMap, handleConfirmBooking, handleCheckinBooking, handleCancelBooking, handleDeleteClick]
  );

  const table = useReactTable({
    data: sortedData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      columnFilters,
      globalFilter
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
          {loading ? (
            <div className="text-center py-4">ກຳລັງໂຫລດຂໍ້ມູນ...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <th key={header.id}>
                          {header.isPlaceholder ? null : (
                            <div
                              className={classnames({
                                'flex items-center justify-center': true,
                                'cursor-pointer select-none': header.column.getCanSort()
                              })}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                                desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
                              }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                            </div>
                          )}
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              {table.getRowModel().rows.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      ບໍ່ພົບຂໍ້ມູນການຈອງ
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table.getRowModel().rows.map(row => {
                    return (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => {
                          return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              )}
            </table>
          )}
        </div>
        <TablePagination
          component="div"
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="ຈຳນວນແຖວຕໍ່ໜ້າ:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} ຈາກ ${count}`}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
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
    </>
  )
}

export default BookingTable