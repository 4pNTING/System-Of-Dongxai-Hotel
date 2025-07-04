'use client'

// React Imports
'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import type { TextFieldProps } from '@mui/material/TextField'
import { Customer } from '@core/domain/models/customer/list.model'
// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomerActionButtons from '@views/apps/customers/dashboard/CustomerActionButtons'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Types Imports
// Using the exact structure from the database
interface CustomerData {
  CustomerId: number;
  CustomerName: string;
  CustomerGender: string;
  CustomerTel: string | number;
  CustomerPostcode: number | null;
  CustomerAddress: string;
  userName: string;
  password: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  roleId: number;
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper<CustomerData>()

interface CustomerDataTableProps {
  data: any; // Use any type to accept any data format
  filters?: Record<string, any>;
  onEdit: (customer: Customer) => void; 
  onDelete?: (id: number) => void;
  loading?: boolean;
  currentUserRole?: number;
}

const CustomerDataTable = ({ data, filters, onEdit, onDelete, loading = false, currentUserRole = 0 }: CustomerDataTableProps) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [filteredData, setFilteredData] = useState<CustomerData[]>([])

  // Update filtered data when data changes
  useEffect(() => {
    try {
      let customersArray: CustomerData[] = [];
      
      // Check if data is already an array
      if (Array.isArray(data)) {
        customersArray = data;
      } 
      // Check if data is an object with numeric keys and a length property (array-like)
      else if (data && typeof data === 'object' && 'length' in data && typeof data.length === 'number') {
        // Use type assertion to tell TypeScript that data is an array-like object
        const arrayLikeData = data as unknown as { [key: number]: CustomerData; length: number };
        customersArray = Array.from({ length: arrayLikeData.length }, (_, i) => arrayLikeData[i] || {}) as CustomerData[];
      }
      
      setFilteredData(customersArray);
      
      // Apply global filter from props if available
      if (filters?.global?.value) {
        setGlobalFilter(filters.global.value as string);
      }
    } catch (error) {
      console.error('Error processing customer data:', error);
      setFilteredData([]);
    }
  }, [data, filters]);

  // Format date
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCustomerId = (id: number): string => {
    return `C${String(id).padStart(3, '0')}`
  }

  const handleDelete = async (id: number) => {
    if (onDelete) {
      await onDelete(id);
    }
  }

  const columns = useMemo<ColumnDef<CustomerData, any>[]>(
    () => [
      columnHelper.accessor('CustomerId', {
        header: () => <div className='text-center font-medium text-base'>ລຳດັບ</div>,
        cell: ({ row }) => <Typography align='center'>{row.index + 1}</Typography>,
        enableSorting: false
      }),
      columnHelper.accessor('CustomerId', {
        id: 'customerCode',
        header: () => <div className='text-center font-medium text-base'>ລະຫັດລູກຄ້າ</div>,
        cell: ({ row }) => <Typography align='center'>{formatCustomerId(row.original.CustomerId)}</Typography>
      }),
      columnHelper.accessor('CustomerName', {
        header: () => <div className='text-center font-medium text-base'>ຊື່ລູກຄ້າ</div>,
        cell: ({ row }) => <Typography align='center'>{row.original.CustomerName || '-'}</Typography>
      }),
      columnHelper.accessor('CustomerGender', {
        header: () => <div className='text-center font-medium text-base'>ເພດ</div>,
        cell: ({ row }) => {
          const gender = row.original.CustomerGender || '';
          const isMale = gender.toLowerCase() === 'male' || gender === 'ชาย';
          return (
            <div className='text-center'>
              <Chip 
                label={isMale ? 'ຊາຍ' : 'ຍິງ'} 
                color={isMale ? 'primary' : 'secondary'}
                size="small"
              />
            </div>
          );
        }
      }),
      columnHelper.accessor('CustomerTel', {
        header: () => <div className='text-center font-medium text-base'>ເບີໂທລະສັບ</div>,
        cell: ({ row }) => <Typography align='center'>{row.original.CustomerTel || '-'}</Typography>
      }),
      columnHelper.accessor('CustomerAddress', {
        header: () => <div className='text-center font-medium text-base'>ທີ່ຢູ່</div>,
        cell: ({ row }) => <Typography align='center'>{row.original.CustomerAddress || '-'}</Typography>
      }),
      columnHelper.accessor('CustomerPostcode', {
        header: () => <div className='text-center font-medium text-base'>ລະຫັດພັດສະປອດ</div>,
        cell: ({ row }) => <Typography align='center'>{row.original.CustomerPostcode || '-'}</Typography>
      }),
      columnHelper.accessor('userName', {
        header: () => <div className='text-center font-medium text-base'>ຊື່ຜູ້ໃຊ້</div>,
        cell: ({ row }) => <Typography align='center'>{row.original.userName || '-'}</Typography>
      }),
   
      columnHelper.accessor('CustomerId', {
        id: 'actions',
        header: () => <div className='text-center font-medium text-base'>ຈັດການ</div>,
        cell: ({ row }) => (
          <CustomerActionButtons 
            customer={row.original} 
            onEdit={onEdit} 
            onDelete={handleDelete} 
            currentUserRole={currentUserRole} 
          />
        ),
        enableSorting: false
      })
    ],
    [onEdit, handleDelete, currentUserRole]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 25
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card>
      <Divider />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={classnames({
                            'flex items-center justify-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl ml-2' />,
                            desc: <i className='tabler-chevron-down text-xl ml-2' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center py-10'>
                  <CircularProgress size={40} />
                  <Box sx={{ mt: 2 }}>ກຳລັງໂຫລດຂໍ້ມູນ...</Box>
                </td>
              </tr>
            </tbody>
          ) : table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center py-10'>
                  ບໍ່ມີຂໍ້ມູນລູກຄ້າ
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
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        component='div'
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => {
          table.setPageSize(Number(e.target.value))
        }}
        labelRowsPerPage='ແຖວຕໍ່ໜ້າ'
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} ຈາກ ${count}`}
      />
    </Card>
  )
}

export default CustomerDataTable

 