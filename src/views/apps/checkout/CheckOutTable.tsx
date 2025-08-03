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
  data: any[] // CheckOut items and CheckIn items (currently staying)
  loading: boolean
  currentUserRole: number
  onCheckout?: (item: any) => Promise<void>
  onEdit?: (item: any) => void
  onDelete?: (item: any) => Promise<void>
  showCheckoutButtons?: boolean // Show checkout buttons for check-in data
}

const columnHelper = createColumnHelper<any>()

const CheckOutTable: React.FC<CheckOutTableProps> = ({ 
  data, 
  loading, 
  currentUserRole,
  onCheckout,
  onEdit,
  onDelete,
  showCheckoutButtons = false
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const dataCopy = [...data];
    
    // เรียงลำดับโดยแยกระหว่าง checkin และ checkout records
    // CheckIn records (พร้อมเช็คเอาต์) ขึ้นก่อน, แล้ว CheckOut records เรียงตาม CheckoutDate
    return dataCopy.sort((a, b) => {
      const aIsCheckin = a.type === 'checkin' || (!a.CheckOutDate && a.status === 'checked_in');
      const bIsCheckin = b.type === 'checkin' || (!b.CheckOutDate && b.status === 'checked_in');
      
      // CheckIn records มาก่อน
      if (aIsCheckin && !bIsCheckin) return -1;
      if (!aIsCheckin && bIsCheckin) return 1;
      
      // ถ้าทั้งคู่เป็น checkin หรือ checkout ให้เรียงตามวันที่
      if (aIsCheckin && bIsCheckin) {
        // เรียงตาม CheckInDate สำหรับ checkin records
        const aDate = new Date(a.CheckInDate);
        const bDate = new Date(b.CheckInDate);
        return bDate.getTime() - aDate.getTime();
      }
      
      // เรียงตาม CheckoutDate สำหรับ checkout records
      const aDate = new Date(a.CheckOutDate || a.checkIn?.CheckInDate);
      const bDate = new Date(b.CheckOutDate || b.checkIn?.CheckInDate);
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
      // แสดงคอลัมน์ต่างกันตาม showCheckoutButtons
      ...(showCheckoutButtons ? [
        // For currently checked-in rooms
        columnHelper.accessor('CheckInId', {
          id: 'checkInId',
          header: () => <div style={{ textAlign: 'center' }}>ລະຫັດເຊັກອິນ</div>,
          cell: info => (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>CI</span>
              {info.getValue()}
            </div>
          )
        })
      ] : [
        // For checkout history
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
        })
      ]),
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
      columnHelper.accessor(row => {
        // สำหรับ CheckIn data ใช้ row.customer, สำหรับ CheckOut data ใช้ row.checkIn?.customer
        return row.customer?.CustomerName || row.checkIn?.customer?.CustomerName || 'N/A';
      }, {
        id: 'CustomerName',
        header: () => <div style={{ textAlign: 'center' }}>ລູກຄ້າ</div>,
        cell: info => {
          const item = info.row.original;
          const customerTel = item.customer?.CustomerTel || item.checkIn?.customer?.CustomerTel;
          
          return (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 500 }}>{info.getValue()}</div>
              {customerTel && (
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  {customerTel}
                </div>
              )}
            </div>
          );
        }
      }),
      columnHelper.accessor(row => {
        // สำหรับ CheckIn data ใช้ row.CheckInDate, สำหรับ CheckOut data ใช้ row.checkIn?.CheckInDate
        return row.CheckInDate || row.checkIn?.CheckInDate;
      }, {
        id: 'checkinDate',
        header: () => <div style={{ textAlign: 'center' }}>ເຂົ້າພັກ</div>,
        cell: info => {
          const checkInDate = info.getValue();
          const item = info.row.original;
          const isCheckin = showCheckoutButtons || (!item.CheckOutDate && item.status === 'checked_in');
          
          return (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 500, color: isCheckin ? '#1976d2' : 'inherit' }}>
                {formatDate(checkInDate)}
              </div>
              {checkInDate && (
                <div style={{ fontSize: '0.70rem', color: '#666' }}>
                  {formatDateTime(checkInDate).split(' ')[1]}
                </div>
              )}
              {isCheckin && (
                <div style={{ fontSize: '0.65rem', color: '#1976d2', fontWeight: 500 }}>
                  ກຳລັງພັກ
                </div>
              )}
            </div>
          );
        }
      }),
      columnHelper.accessor('CheckOutDate', {
        id: 'checkoutDate',
        header: () => <div style={{ textAlign: 'center' }}>ເຊັກເອົາ</div>,
        cell: info => {
          const checkoutDate = info.getValue();
          const item = info.row.original;
          const isCheckin = !item.CheckOutDate && item.status === 'checked_in';
          
          return (
            <div style={{ textAlign: 'center' }}>
              {checkoutDate ? (
                <>
                  <div style={{ fontWeight: 500 }}>
                    {formatDate(checkoutDate)}
                  </div>
                  <div style={{ fontSize: '0.70rem', color: '#666' }}>
                    {formatDateTime(checkoutDate).split(' ')[1]}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#4caf50', fontWeight: 500 }}>
                    ເຊັກເອົາແລ້ວ
                  </div>
                </>
              ) : isCheckin ? (
                <>
                  <div style={{ color: '#ff9800', fontWeight: 500 }}>
                    -
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#ff9800', fontWeight: 500 }}>
                    ຍັງບໍ່ເຊັກເອົາ
                  </div>
                </>
              ) : (
                <div style={{ color: '#999' }}>N/A</div>
              )}
            </div>
          );
        }
      }),
      {
        id: 'stayDuration',
        header: () => <div style={{ textAlign: 'center' }}>ໄລຍະເວລາພັກ</div>,
        cell: ({ row }) => {
          const item = row.original;
          const checkInDate = item.checkIn?.CheckInDate || item.CheckInDate;
          const checkOutDate = item.CheckOutDate;
          const isCheckin = !item.CheckOutDate && item.status === 'checked_in';
          
          if (!checkInDate) {
            return <div style={{ textAlign: 'center', color: '#999' }}>N/A</div>;
          }
          
          let duration = '';
          let currentStay = '';
          
          if (isCheckin) {
            // คำนวณจำนวนวันที่พักอยู่ปัจจุบัน
            const now = new Date();
            const checkIn = new Date(checkInDate);
            const diffTime = now.getTime() - checkIn.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            duration = `${diffDays} ຄືນ`;
            currentStay = '(ກຳລັງພັກ)';
          } else if (checkOutDate) {
            // คำนวณจำนวนวันที่พักทั้งหมด
            const totalStay = calculateStayDuration(checkInDate, checkOutDate);
            duration = totalStay;
            currentStay = '(ສຳເລັດ)';
          }
          
          return (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontWeight: 500, 
                color: isCheckin ? '#ff9800' : '#4caf50' 
              }}>
                {duration}
              </div>
              <div style={{ 
                fontSize: '0.65rem', 
                color: isCheckin ? '#ff9800' : '#666',
                fontWeight: isCheckin ? 500 : 400
              }}>
                {currentStay}
              </div>
              {isCheckin && (
                <div style={{ 
                  fontSize: '0.60rem', 
                  color: '#999',
                  marginTop: '2px'
                }}>
                  ແຕ່ເຂົ້າພັກ
                </div>
              )}
            </div>
          );
        }
      },
      {
        id: 'status',
        header: () => <div style={{ textAlign: 'center' }}>ສະຖານະ</div>,
        cell: ({ row }) => {
          const item = row.original;
          const isCheckin = !item.CheckOutDate && item.status === 'checked_in';
          
          return (
            <div style={{ textAlign: 'center' }}>
              <CheckOutStatusChip 
                type={isCheckin ? 'checkin' : 'checkout'}
                status={item.status || ''}
                statusId={item.StatusId}
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
          const isCheckin = item.type === 'checkin' || (!item.CheckOutDate && item.status === 'checked_in');
          
          return (
            <CheckOutActionButtons
              item={item}
              type={isCheckin ? 'checkin' : 'checkout'}
              onCheckout={onCheckout}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUserRole={currentUserRole}
              showCheckoutButtons={showCheckoutButtons}
            />
          );
        }
      }
    ],
    [currentUserRole, onCheckout, onEdit, onDelete]
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