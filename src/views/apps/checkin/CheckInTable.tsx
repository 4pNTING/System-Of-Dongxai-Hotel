'use client'

import { useEffect, useMemo, useState } from 'react'
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import classnames from 'classnames'
import {useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table'

import ChevronRight from '@menu/svg/ChevronRight'
import styles from '@core/styles/table.module.css'
import CheckInStatusChip from './CheckInStatusChip'
import CheckInActionButtons from './CheckInActionButtons'

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-GB');
}

interface CheckInTableProps {
  data: any[] // รองรับทั้ง CheckIn และ Booking
  loading: boolean
  currentUserRole: number
  onCheckin?: (item: any) => Promise<void>
  onCancel?: (item: any) => Promise<void>
  onEdit?: (item: any) => void
  onDelete?: (item: any) => Promise<void>
}

const columnHelper = createColumnHelper<any>()

const CheckInTable: React.FC<CheckInTableProps> = ({ 
  data, 
  loading, 
  currentUserRole,
  onCheckin,
  onCancel,
  onEdit,
  onDelete
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const dataCopy = [...data];
    
    // เรียงลำดับตาม ID (ใหม่ไปเก่า)
    return dataCopy.sort((a, b) => {
      const aId = a.CheckInId || a.BookingId || 0;
      const bId = b.CheckInId || b.BookingId || 0;
      return bId - aId;
    });
  }, [data]);

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        id: 'sequence',
        header: () => <div style={{ textAlign: 'center' }}>ລຳດັບ</div>,
        cell: ({ row }) => <div style={{ textAlign: 'center' }}>{row.index + 1}</div>
      },
      columnHelper.accessor(row => row.CheckInId || row.BookingId, {
        id: 'id',
        header: () => <div style={{ textAlign: 'center' }}>ລະຫັດ</div>,
        cell: info => {
          const item = info.row.original;
          const isBooking = item.type === 'booking' || (!item.CheckInId && item.BookingId);
          const id = info.getValue();
          const prefix = isBooking ? 'B' : 'C';
          
          return (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>{prefix}</span>
              {id}
            </div>
          );
        }
      }),
      columnHelper.accessor('RoomId', {
        header: () => <div style={{ textAlign: 'center' }}>ຫ້ອງພັກ</div>,
        cell: info => {
          const roomId = info.getValue();
          const item = info.row.original;
          const roomTypeName = item.room?.roomType?.TypeName || '';
          const roomPrice = item.room?.RoomPrice ? 
            item.room.RoomPrice.toLocaleString() + ' ກີບ' : '';
          
          return (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 500 }}>{roomId}</div>
              {roomTypeName && (
                <div style={{ fontSize: '0.75rem', color: '#666' }}>{roomTypeName}</div>
              )}
              {roomPrice && (
                <div style={{ fontSize: '0.75rem', color: '#888' }}>{roomPrice}</div>
              )}
            </div>
          );
        }
      }),
      columnHelper.accessor(row => row.customer?.CustomerName || 'N/A', {
        id: 'CustomerName',
        header: () => <div style={{ textAlign: 'center' }}>ລູກຄ້າ</div>,
        cell: info => (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 500 }}>{info.getValue()}</div>
            {info.row.original.customer?.CustomerTel && (
              <div style={{ fontSize: '0.75rem', color: '#666' }}>
                {info.row.original.customer.CustomerTel}
              </div>
            )}
          </div>
        )
      }),
      columnHelper.accessor(row => {
        // ใช้วันที่ที่เหมาะสมตามประเภท
        return row.CheckInDate || row.CheckinDate;
      }, {
        id: 'checkinDate',
        header: () => <div style={{ textAlign: 'center' }}>ເຂົ້າພັກ</div>,
        cell: info => <div style={{ textAlign: 'center' }}>{formatDate(info.getValue())}</div>
      }),
      columnHelper.accessor(row => {
        // ใช้วันที่ที่เหมาะสมตามประเภท
        return row.CheckoutDate;
      }, {
        id: 'checkoutDate',
        header: () => <div style={{ textAlign: 'center' }}>ອອກຈາກຫ້ອງພັກ</div>,
        cell: info => <div style={{ textAlign: 'center' }}>{formatDate(info.getValue())}</div>
      }),
      {
        id: 'status',
        header: () => <div style={{ textAlign: 'center' }}>ສະຖານະ</div>,
        cell: ({ row }) => {
          const item = row.original;
          const isBooking = item.type === 'booking' || (!item.CheckInId && item.BookingId);
          
          return (
            <div style={{ textAlign: 'center' }}>
              <CheckInStatusChip 
                type={isBooking ? 'booking' : 'checkin'}
                status={item.status || ''}
                statusId={item.StatusId}
              />
            </div>
          );
        }
      },
      {
        id: 'actions',
        header: () => <div style={{ textAlign: 'center' }}>ຈັດການ</div>,
        cell: ({ row }) => {
          const item = row.original;
          
          return (
            <CheckInActionButtons
              item={item}
              onCheckin={onCheckin}
              onCancel={onCancel}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUserRole={currentUserRole}
            />
          );
        }
      }
    ],
    [currentUserRole, onCheckin, onCancel, onEdit, onDelete]
  );

  const table = useReactTable({
    data: sortedData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { columnFilters, globalFilter },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <Card>
      <div className='overflow-x-auto'>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>ກຳລັງໂຫລດຂໍ້ມູນ...</span>
            </div>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
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
                  ))}
                </tr>
              ))}
            </thead>
            {table.getRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center py-8'>
                    <div className="flex flex-col items-center gap-2">
                      <i className="tabler-search text-4xl text-gray-400"></i>
                      <div>ບໍ່ພົບຂໍ້ມູນ</div>
                      <div className="text-sm text-gray-500">ລອງປ່ຽນຄຳຄົ້ນຫາຫຼືຕົວກອງ</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
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
        sx={{
          borderTop: '1px solid #e0e0e0',
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.875rem'
          }
        }}
      />
    </Card>
  )
}

export default CheckInTable