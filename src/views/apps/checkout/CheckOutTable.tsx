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
import CheckOutStatusChip from './CheckOutStatusChip'
import CheckOutActionButtons from './CheckOutActionButtons'

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

const formatDateTime = (date: string | Date): string => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('th-TH') + ' ' + d.toLocaleTimeString('th-TH', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

const calculateStayDuration = (checkInDate: string | Date, checkOutDate: string | Date): string => {
  if (!checkInDate || !checkOutDate) return 'N/A';
  
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return `${diffDays} ຄືນ`;
}

interface CheckOutTableProps {
  data: any[] // CheckOut items
  loading: boolean
  currentUserRole: number
  onEdit?: (item: any) => void
  onDelete?: (item: any) => Promise<void>
}

const columnHelper = createColumnHelper<any>()

const CheckOutTable: React.FC<CheckOutTableProps> = ({ 
  data, 
  loading, 
  currentUserRole,
  onEdit,
  onDelete
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const dataCopy = [...data];
    
    // เรียงลำดับตาม CheckoutDate (ใหม่ไปเก่า)
    return dataCopy.sort((a, b) => {
      const aDate = new Date(a.CheckoutDate);
      const bDate = new Date(b.CheckoutDate);
      return bDate.getTime() - aDate.getTime();
    });
  }, [data]);

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        id: 'sequence',
        header: () => <div style={{ textAlign: 'center' }}>ລຳດັບ</div>,
        cell: ({ row }) => <div style={{ textAlign: 'center' }}>{row.index + 1}</div>
      },
      columnHelper.accessor('CheckOutId', {
        id: 'checkoutId',
        header: () => <div style={{ textAlign: 'center' }}>ລະຫັດເຊັກເອົາ</div>,
        cell: info => (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>CO</span>
            {info.getValue()}
          </div>
        )
      }),
      columnHelper.accessor(row => row.checkIn?.CheckInId, {
        id: 'checkInId',
        header: () => <div style={{ textAlign: 'center' }}>ລະຫັດເຊັກອິນ</div>,
        cell: info => (
          <div style={{ textAlign: 'center' }}>
            {info.getValue() ? (
              <>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>CI</span>
                {info.getValue()}
              </>
            ) : 'N/A'}
          </div>
        )
      }),
      columnHelper.accessor('RoomId', {
        header: () => <div style={{ textAlign: 'center' }}>ຫ້ອງພັກ</div>,
        cell: info => {
          const roomId = info.getValue();
          const item = info.row.original;
          const roomTypeName = item.room?.roomType?.TypeName || 
                              item.checkIn?.room?.roomType?.TypeName || '';
          const roomPrice = item.room?.RoomPrice || 
                           item.checkIn?.room?.RoomPrice;
          
          return (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 500 }}>{roomId}</div>
              {roomTypeName && (
                <div style={{ fontSize: '0.75rem', color: '#666' }}>{roomTypeName}</div>
              )}
              {roomPrice && (
                <div style={{ fontSize: '0.75rem', color: '#888' }}>
                  {roomPrice.toLocaleString()} ກີບ
                </div>
              )}
            </div>
          );
        }
      }),
      columnHelper.accessor(row => row.checkIn?.customer?.CustomerName || 'N/A', {
        id: 'CustomerName',
        header: () => <div style={{ textAlign: 'center' }}>ລູກຄ້າ</div>,
        cell: info => (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 500 }}>{info.getValue()}</div>
            {info.row.original.checkIn?.customer?.CustomerTel && (
              <div style={{ fontSize: '0.75rem', color: '#666' }}>
                {info.row.original.checkIn.customer.CustomerTel}
              </div>
            )}
          </div>
        )
      }),
      columnHelper.accessor(row => row.checkIn?.CheckInDate, {
        id: 'checkinDate',
        header: () => <div style={{ textAlign: 'center' }}>ເຂົ້າພັກ</div>,
        cell: info => <div style={{ textAlign: 'center' }}>{formatDate(info.getValue())}</div>
      }),
      columnHelper.accessor('CheckOutDate', {
        id: 'checkoutDate',
        header: () => <div style={{ textAlign: 'center' }}>ເຊັກເອົາ</div>,
        cell: info => <div style={{ textAlign: 'center' }}>{formatDateTime(info.getValue())}</div>
      }),
      {
        id: 'stayDuration',
        header: () => <div style={{ textAlign: 'center' }}>ຄືນທີ່ພັກ</div>,
        cell: ({ row }) => {
          const item = row.original;
          const checkInDate = item.checkIn?.CheckInDate;
          const checkOutDate = item.CheckOutDate;
          
          return (
            <div style={{ textAlign: 'center' }}>
              {calculateStayDuration(checkInDate, checkOutDate)}
            </div>
          );
        }
      },
      {
        id: 'status',
        header: () => <div style={{ textAlign: 'center' }}>ສະຖານະ</div>,
        cell: ({ row }) => {
          const item = row.original;
          
          return (
            <div style={{ textAlign: 'center' }}>
              <CheckOutStatusChip 
                status="completed"
                checkoutDate={item.CheckoutDate}
              />
            </div>
          );
        }
      },
      columnHelper.accessor(row => row.staff?.StaffName || 'N/A', {
        id: 'staffName',
        header: () => <div style={{ textAlign: 'center' }}>ພນັກງານ</div>,
        cell: info => <div style={{ textAlign: 'center' }}>{info.getValue()}</div>
      }),
      {
        id: 'actions',
        header: () => <div style={{ textAlign: 'center' }}>ຈັດການ</div>,
        cell: ({ row }) => {
          const item = row.original;
          
          return (
            <CheckOutActionButtons
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUserRole={currentUserRole}
            />
          );
        }
      }
    ],
    [currentUserRole, onEdit, onDelete]
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

export default CheckOutTable