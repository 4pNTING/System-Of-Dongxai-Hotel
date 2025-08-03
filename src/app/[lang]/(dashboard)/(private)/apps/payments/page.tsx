// src/app/[lang]/(dashboard)/(private)/apps/payments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import DatePicker from '@mui/lab/DatePicker';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

// Icon Imports
import TrendingUp from '@mui/icons-material/TrendingUp';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Receipt from '@mui/icons-material/Receipt';
import Assessment from '@mui/icons-material/Assessment';
import GetApp from '@mui/icons-material/GetApp';
import Print from '@mui/icons-material/Print';
import DateRange from '@mui/icons-material/DateRange';

// Component Imports
import FinancialOverviewCards from '@/views/apps/report/FinancialOverviewCards';
import RevenueChart from '@/views/apps/report/RevenueChart';
import PaymentMethodChart from '@/views/apps/report/PaymentMethodChart';
import FinancialTable from '@/views/apps/report/FinancialTable';
import ExportDialog from '@/views/apps/report/ExportDialog';

// Store Imports
import { usePaymentStore } from '@core/infrastructure/store/payments/payment.store';

// Utils Imports

export default function PaymentReportPage() {
  // Payment store integration
  const {
    items: paymentItems,
    isLoading: paymentLoading,
    stats: paymentStats,
    fetchItems: fetchPayments,
    fetchStats: fetchPaymentStats,
    setFilters
  } = usePaymentStore();

  // State management
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'trends'>('summary');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  const { data: session, status } = useSession();
  const isLoadingAuth = status === 'loading';
  
  const userRoleId = session?.user?.roleId ?  
    (typeof session.user.roleId === 'string' ? parseInt(session.user.roleId, 10) : session.user.roleId) : 0;

  // Check permissions for financial reports
  const canViewFinancialReports = userRoleId === 1 || userRoleId === 2; // Admin or Manager

  // Load initial data
  useEffect(() => {
    if (session?.user && canViewFinancialReports) {
      loadReportData();
    }
  }, [session, dateRange, startDate, endDate]);

  const loadReportData = async () => {
    try {
      // Set filters based on date range
      const filters = getDateFilters();
      setFilters(filters);
      
      // Fetch payments and stats
      await Promise.all([
        fetchPayments(filters),
        fetchPaymentStats()
      ]);
    } catch (error) {
      console.error('Error loading report data:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ');
    }
  };

  const getDateFilters = () => {
    const now = new Date();
    const filters: any = {};

    switch (dateRange) {
      case 'today':
        filters.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filters.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        filters.startDate = weekStart;
        filters.endDate = now;
        break;
      case 'month':
        filters.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        filters.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        filters.startDate = quarterStart;
        filters.endDate = now;
        break;
      case 'year':
        filters.startDate = new Date(now.getFullYear(), 0, 1);
        filters.endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;
      case 'custom':
        if (startDate && endDate) {
          filters.startDate = startDate;
          filters.endDate = endDate;
        }
        break;
    }

    return filters;
  };

  const handleExportReport = () => {
    setExportDialogOpen(true);
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Show loading state
  if (isLoadingAuth || paymentLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          ກຳລັງໂຫຼດຂໍ້ມູນ...
        </Typography>
      </Box>
    );
  }

  // Check permissions
  if (!canViewFinancialReports) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" color="error">
          ທ່ານບໍ່ມີສິດເຂົ້າເບິ່ງລາຍງານການເງິນ
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
            ລາຍງານການເງິນ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ລາຍງານແລະວິເຄາະຂໍ້ມູນການເງິນຂອງໂຮງແຮມ
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrintReport}
          >
            ພິມລາຍງານ
          </Button>
          <Button
            variant="contained"
            startIcon={<GetApp />}
            onClick={handleExportReport}
          >
            ຍ້າຍອອກ
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>ໄລຍະເວລາ</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  label="ໄລຍະເວລາ"
                >
                  <MenuItem value="today">ມື້ນີ້</MenuItem>
                  <MenuItem value="week">ອາທິດນີ້</MenuItem>
                  <MenuItem value="month">ເດືອນນີ້</MenuItem>
                  <MenuItem value="quarter">ໄຕມາດນີ້</MenuItem>
                  <MenuItem value="year">ປີນີ້</MenuItem>
                  <MenuItem value="custom">ກຳນົດເອງ</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {dateRange === 'custom' && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label="ວັນທີເລີ່ມຕົ້ນ"
                    value={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label="ວັນທີສິ້ນສຸດ"
                    value={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>ປະເພດລາຍງານ</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  label="ປະເພດລາຍງານ"
                >
                  <MenuItem value="summary">ສະຫຼຸບຫຍໍ້</MenuItem>
                  <MenuItem value="detailed">ລະອຽດ</MenuItem>
                  <MenuItem value="trends">ແນວໂນ້ມ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <FinancialOverviewCards 
        stats={paymentStats}
        dateRange={dateRange}
        paymentItems={paymentItems || []}
      />

      {/* Charts and Analysis */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <RevenueChart 
            paymentItems={paymentItems || []}
            dateRange={dateRange}
            reportType={reportType}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PaymentMethodChart 
            paymentItems={paymentItems || []}
          />
        </Grid>
      </Grid>

      {/* Detailed Table */}
      <FinancialTable 
        paymentItems={paymentItems || []}
        reportType={reportType}
        dateRange={dateRange}
      />

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        paymentItems={paymentItems || []}
        stats={paymentStats}
        dateRange={dateRange}
        reportType={reportType}
      />
    </Box>
  );
}
