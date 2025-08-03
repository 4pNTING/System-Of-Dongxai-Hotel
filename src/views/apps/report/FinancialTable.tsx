// src/views/apps/payments/report/FinancialTable.tsx
import React, { useState, useMemo } from 'react';

// MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Icon Imports
import Search from '@mui/icons-material/Search';
import Receipt from '@mui/icons-material/Receipt';
import Print from '@mui/icons-material/Print';
import Visibility from '@mui/icons-material/Visibility';

// Component Imports
import PaymentStatusChip from '@views/apps/payments/PaymentStatusChip';

// Types
import { PaymentModel } from '@core/domain/models/payments/list.model';

// Utils
import { formatCurrency } from '@core/utils/formatters';

interface FinancialTableProps {
  paymentItems: any[]; // Allow any array type for compatibility
  reportType: 'summary' | 'detailed' | 'trends';
  dateRange: string;
}

type Order = 'asc' | 'desc';
type OrderBy = string; // Allow any string for flexible sorting

interface HeadCell {
  id: OrderBy;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const FinancialTable: React.FC<FinancialTableProps> = ({
  paymentItems,
  reportType,
  dateRange
}) => {
  // State management
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<OrderBy>('PaymentDate');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Table configuration based on report type
  const getTableColumns = (): HeadCell[] => {
    const baseColumns: HeadCell[] = [
      { id: 'PaymentId', label: 'ID ການຊໍາລະ', numeric: true, sortable: true },
      { id: 'PaymentDate', label: 'ວັນທີ', numeric: false, sortable: true },
      { id: 'Amount', label: 'ຈຳນວນເງິນ', numeric: true, sortable: true },
      { id: 'PaymentMethod', label: 'ວິທີການ', numeric: false, sortable: true },
      { id: 'Status', label: 'ສະຖານະ', numeric: false, sortable: true }
    ];

    if (reportType === 'detailed') {
      return [
        ...baseColumns,
        { id: 'CustomerId', label: 'ລູກຄ້າ', numeric: false, sortable: true },
        { id: 'RoomId', label: 'ຫ້ອງ', numeric: false, sortable: true },
        { id: 'StaffId', label: 'ພະນັກງານ', numeric: false, sortable: true },
        { id: 'CreatedAt', label: 'ສ້າງເມື່ອ', numeric: false, sortable: true }
      ];
    }

    return baseColumns;
  };

  const headCells = getTableColumns();

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = paymentItems.filter(payment => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        payment.PaymentId?.toString().includes(searchLower) ||
        payment.PaymentType?.toLowerCase().includes(searchLower) ||
        payment.PaymentDate?.toString().toLowerCase().includes(searchLower) ||
        payment.checkIn?.customer?.CustomerName?.toLowerCase().includes(searchLower) ||
        payment.checkIn?.room?.RoomNumber?.toLowerCase().includes(searchLower)
      );
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any = a[orderBy];
      let bValue: any = b[orderBy];

      // Handle nested properties
      if (orderBy === 'CustomerId') {
        aValue = a.checkIn?.customer?.CustomerName || '';
        bValue = b.checkIn?.customer?.CustomerName || '';
      } else if (orderBy === 'RoomId') {
        aValue = a.checkIn?.room?.RoomNumber || '';
        bValue = b.checkIn?.room?.RoomNumber || '';
      } else if (orderBy === 'StaffId') {
        aValue = a.checkIn?.staff?.StaffName || a.staff?.StaffName || '';
        bValue = b.checkIn?.staff?.StaffName || b.staff?.StaffName || '';
      }

      // Handle dates
      if (orderBy === 'PaymentDate' || orderBy === 'CreatedAt') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      // Handle numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle strings
      const aStr = String(aValue || '').toLowerCase();
      const bStr = String(bValue || '').toLowerCase();
      
      if (order === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    return filtered;
  }, [paymentItems, searchQuery, order, orderBy]);

  // Pagination
  const paginatedData = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Event handlers
  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('lo-LA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodLabels: { [key: string]: string } = {
      'credit_card': 'ບັດເຄຣດິດ',
      'debit_card': 'ບັດເດບິດ',
      'bank_transfer': 'ໂອນເງິນ',
      'cash': 'ເງິນສົດ',
      'mobile_payment': 'ມືຖືຈ່າຍ',
      'qr_payment': 'QR ຈ່າຍ'
    };
    return methodLabels[method] || method;
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalAmount = filteredAndSortedData.reduce((sum, payment) => {
      if (payment.Status === 'paid' || payment.Status === 'completed') {
        return sum + payment.Amount;
      }
      return sum;
    }, 0);

    const refundedAmount = filteredAndSortedData.reduce((sum, payment) => {
      if (payment.Status === 'refunded') {
        return sum + payment.Amount;
      }
      return sum;
    }, 0);

    return {
      totalTransactions: filteredAndSortedData.length,
      totalAmount,
      refundedAmount,
      netAmount: totalAmount - refundedAmount
    };
  }, [filteredAndSortedData]);

  return (
    <Card>
      <CardHeader
        title={`ລາຍງານການຊໍາລະ${reportType === 'detailed' ? ' (ລະອຽດ)' : ''}`}
        subheader={`ທັງໝົດ: ${summaryStats.totalTransactions} ລາຍການ • ລາຍໄດ້ສຸດທິ: ${formatCurrency(summaryStats.netAmount)}`}
      />
      <CardContent>
        {/* Search and Summary */}
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <TextField
              placeholder="ຄົ້ນຫາການຊໍາລະ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
            
            <Box display="flex" gap={2}>
              <Chip
                label={`ລາຍໄດ້: ${formatCurrency(summaryStats.totalAmount)}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`ເງິນຄືນ: ${formatCurrency(summaryStats.refundedAmount)}`}
                color="error"
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => handleRequestSort(headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
                <TableCell align="center">ການດຳເນີນການ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((payment) => (
                <TableRow key={payment.PaymentId} hover>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      #{payment.PaymentId}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    {formatDate(payment.PaymentDate)}
                  </TableCell>
                  
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      color="success.main"
                    >
                      {formatCurrency(payment.PaymentPrice)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={getPaymentMethodLabel(payment.PaymentType || 'BOOKING_CONFIRMATION')}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label="ຊຳລະແລ້ວ"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>

                  {reportType === 'detailed' && (
                    <>
                      <TableCell>
                        {payment.checkIn?.customer?.CustomerName || '-'}
                      </TableCell>
                      
                      <TableCell>
                        {payment.checkIn?.room?.RoomNumber || '-'}
                      </TableCell>
                      
                      <TableCell>
                        {payment.checkIn?.staff?.StaffName || payment.staff?.StaffName || '-'}
                      </TableCell>
                      
                      <TableCell>
                        {formatDate(payment.CreatedAt)}
                      </TableCell>
                    </>
                  )}
                  
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={0.5}>
                      <Tooltip title="ເບິ່ງລາຍລະອຽດ">
                        <IconButton size="small">
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="ພິມໃບເສັດ">
                        <IconButton size="small">
                          <Print fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery ? 'ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ' : 'ບໍ່ມີຂໍ້ມູນການຊໍາລະ'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredAndSortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="ຈຳນວນຕໍ່ໜ້າ:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} ຈາກ ${count !== -1 ? count : `ຫຼາຍກວ່າ ${to}`}`
          }
        />
      </CardContent>
    </Card>
  );
};

export default FinancialTable;
