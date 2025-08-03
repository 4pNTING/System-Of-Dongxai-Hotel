'use client'

import { useEffect, useMemo, useState } from 'react'
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import classnames from 'classnames'
import {useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn, ColumnFiltersState, RowData } from '@tanstack/react-table'

// Extend the ColumnMeta interface to include cellClassName
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    cellClassName?: string
  }
}

import ChevronRight from '@menu/svg/ChevronRight'
import styles from '@core/styles/table.module.css'
import PaymentStatusChip from './PaymentStatusChip'
import PaymentActionButtons from './PaymentActionButtons'

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

const formatCurrency = (amount: number): string => {
  if (!amount) return '0 ₭';
  return new Intl.NumberFormat('lo-LA', {
    style: 'currency',
    currency: 'LAK'
  }).format(amount);
}

interface PaymentTableProps {
  data: any[] // รองรับ Payment data
  loading: boolean
  currentUserRole: number
  onView?: (item: any) => void
  onPrint?: (item: any) => void
  onRefund?: (item: any) => Promise<void>
}

const columnHelper = createColumnHelper<any>()

const PaymentTable: React.FC<PaymentTableProps> = ({ 
  data, 
  loading, 
  currentUserRole,
  onView,
  onPrint,
  onRefund
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('paymentId', {
        header: 'ລະຫັດການຊຳລະ',
        cell: info => <span className="font-medium text-textPrimary">{info.getValue()}</span>
      }),
      columnHelper.accessor('booking.customer.customerName', {
        header: 'ລູກຄ້າ',
        cell: info => (
          <div className="flex flex-col">
            <span className="font-medium text-textPrimary">{info.getValue() || 'N/A'}</span>
            <span className="text-xs text-textSecondary">
              {info.row.original?.booking?.customer?.customerTel || ''}
            </span>
          </div>
        )
      }),
      columnHelper.accessor('booking.room.roomNumber', {
        header: 'ຫ້ອງ',
        cell: info => (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="font-medium text-textPrimary">{info.getValue() || 'N/A'}</span>
              <span className="text-xs text-textSecondary">
                {info.row.original?.booking?.room?.roomType?.roomTypeName || ''}
              </span>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('paymentMethod', {
        header: 'ວິທີການຊຳລະ',
        cell: info => {
          const method = info.getValue();
          const methodText = method === 'cash' ? 'ເງິນສົດ' : method === 'card' ? 'ບັດ' : method === 'transfer' ? 'ໂອນເງິນ' : method;
          return <span className="text-textSecondary">{methodText}</span>
        }
      }),
      columnHelper.accessor('amount', {
        header: 'ຈຳນວນເງິນ',
        cell: info => (
          <span className="font-medium text-success">{formatCurrency(info.getValue())}</span>
        )
      }),
      columnHelper.accessor('paymentDate', {
        header: 'ວັນທີຊຳລະ',
        cell: info => <span className="text-textSecondary">{formatDate(info.getValue())}</span>
      }),
      columnHelper.accessor('paymentStatus', {
        header: 'ສະຖານະ',
        cell: info => (
          <PaymentStatusChip 
            status={info.getValue()}
            statusId={info.row.original?.paymentStatusId}
          />
        )
      }),
      columnHelper.display({
        id: 'actions',
        header: 'ການດຳເນີນງານ',
        cell: info => (
          <PaymentActionButtons
            item={info.row.original}
            currentUserRole={currentUserRole}
            onView={onView}
            onPrint={onPrint}
            onRefund={onRefund}
          />
        ),
        meta: {
          cellClassName: 'is-sticky is-sticky-column'
        }
      })
    ],
    [currentUserRole, onView, onPrint, onRefund]
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      columnFilters,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} {...{ 
                      className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                      onClick: header.column.getToggleSortingHandler()
                    }}>
                      <div className='flex items-center justify-between min-is-[120px] pli-2 plb-2.5'>
                        <span className='text-textPrimary'>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        <div className='flex flex-col'>
                          <ChevronRight
                            {...{
                              className: classnames('flip-in-rtl text-xl transition-transform', {
                                'rotate-90': header.column.getIsSorted() === 'asc',
                                '-rotate-90': header.column.getIsSorted() === 'desc'
                              })
                            }}
                          />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    {loading ? 'ກຳລັງໂຫຼດ...' : 'ບໍ່ມີຂໍ້ມູນການຊຳລະ'}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className={classnames('plb-1', cell.column.columnDef.meta?.cellClassName)}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
          labelRowsPerPage='ແຖວຕໍ່ໜ້າ:'
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} ຈາກ ${count}`}
        />
      </Card>
    </>
  )
}

export default PaymentTable
