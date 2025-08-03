// src/app/[lang]/(dashboard)/(private)/apps/reports/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';

// Icon Imports
import TrendingUp from '@mui/icons-material/TrendingUp';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Receipt from '@mui/icons-material/Receipt';
import Assessment from '@mui/icons-material/Assessment';
import GetApp from '@mui/icons-material/GetApp';
import Print from '@mui/icons-material/Print';
import DateRange from '@mui/icons-material/DateRange';
import Hotel from '@mui/icons-material/Hotel';
import People from '@mui/icons-material/People';
import RoomService from '@mui/icons-material/RoomService';
import PieChart from '@mui/icons-material/PieChart';

// Component Imports - Reusing existing report components
import FinancialOverviewCards from '@views/apps/report/FinancialOverviewCards';
import PaymentMethodChart from '@views/apps/report/PaymentMethodChart';
import RevenueChart from '@views/apps/report/RevenueChart';
import FinancialTable from '@views/apps/report/FinancialTable';
import ExportDialog from '@views/apps/report/ExportDialog';

// Store Imports
import { useReportsStore } from '@core/infrastructure/store/reports/reports.store';

// Adapter Imports
import {
  adaptDashboardStatsToPaymentStats,
  adaptFinancialReportToLegacy,
  createMockPaymentItemsFromFinancialReport
} from '@core/utils/report-adapters';

// Type Imports
import type { SelectChangeEvent } from '@mui/material/Select';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ReportsPage = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState<string>('thisMonth');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Reports store state
  const {
    dashboardStats,
    financialReport,
    bookingReport,
    roomReport,
    customerReport,
    revenueReport,
    occupancyReport,
    paymentsList,
    isDashboardLoading,
    isFinancialLoading,
    isBookingLoading,
    isRoomLoading,
    isCustomerLoading,
    isRevenueLoading,
    isOccupancyLoading,
    isPaymentsLoading,
    dashboardError,
    financialError,
    bookingError,
    roomError,
    customerError,
    revenueError,
    occupancyError,
    paymentsError,
    fetchDashboardStats,
    fetchFinancialReport,
    fetchBookingReport,
    fetchRoomReport,
    fetchCustomerReport,
    fetchRevenueReport,
    fetchOccupancyReport,
    fetchPaymentsList,
    clearErrors
  } = useReportsStore();

  // Helper function to build query based on date range
  const getDateRangeQuery = () => {
    const now = new Date();
    let query: any = {};

    switch (dateRange) {
      case 'today':
        query.startDate = now.toISOString().split('T')[0];
        query.endDate = now.toISOString().split('T')[0];
        break;
      case 'thisWeek':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        query.startDate = startOfWeek.toISOString().split('T')[0];
        query.endDate = now.toISOString().split('T')[0];
        break;
      case 'thisMonth':
        query.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        query.endDate = now.toISOString().split('T')[0];
        break;
      case 'thisYear':
        query.startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        query.endDate = now.toISOString().split('T')[0];
        break;
      case 'custom':
        if (startDate) query.startDate = startDate.toISOString().split('T')[0];
        if (endDate) query.endDate = endDate.toISOString().split('T')[0];
        break;
    }

    return query;
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        clearErrors();
        
        // Build query based on date range
        const query = getDateRangeQuery();
        
        // Fetch all report data
        await Promise.all([
          fetchDashboardStats(query),
          fetchFinancialReport(query),
          fetchBookingReport(query),
          fetchRoomReport(query),
          fetchRevenueReport(query),
          fetchOccupancyReport(query),
          fetchPaymentsList(query)
        ]);
        
      } catch (error) {
        console.error('Error initializing reports data:', error);
        toast.error('ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນລາຍງານ');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      initializeData();
    }
  }, [session]);

  // Refresh data when date range changes
  useEffect(() => {
    if (session?.user && (dateRange !== 'thisMonth' || startDate || endDate)) {
      const refreshData = async () => {
        try {
          clearErrors();
          const query = getDateRangeQuery();
          
          // Only refresh if we have a valid date range
          if (query.startDate || query.endDate || dateRange === 'custom') {
            await Promise.all([
              fetchDashboardStats(query),
              fetchFinancialReport(query),
              fetchBookingReport(query),
              fetchRoomReport(query),
              fetchRevenueReport(query),
              fetchOccupancyReport(query),
              fetchPaymentsList(query)
            ]);
          }
        } catch (error) {
          console.error('Error refreshing reports data:', error);
        }
      };
      
      refreshData();
    }
  }, [dateRange, startDate, endDate, session]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDateRangeChange = (event: SelectChangeEvent) => {
    setDateRange(event.target.value);
  };

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Page Header */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={(
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Assessment color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1">
                ລາຍງານສະຫຼຸບ
              </Typography>
            </Box>
          )}
          subheader="ລາຍງານການດຳເນີນງານໂຮງແຮມ ແລະ ການເງິນ"
          action={(
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* Date Range Filter */}
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>ໄລຍະເວລາ</InputLabel>
                <Select
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  label="ໄລຍະເວລາ"
                >
                  <MenuItem value="today">ມື້ນີ້</MenuItem>
                  <MenuItem value="thisWeek">ອາທິດນີ້</MenuItem>
                  <MenuItem value="thisMonth">ເດືອນນີ້</MenuItem>
                  <MenuItem value="thisYear">ປີນີ້</MenuItem>
                  <MenuItem value="custom">ກຳນົດເອງ</MenuItem>
                </Select>
              </FormControl>
              
              {/* Export Button */}
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                onClick={handleExport}
              >
                ນຳອອກ
              </Button>
            </Box>
          )}
        />
        
        {/* Custom Date Range */}
        {dateRange === 'custom' && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="ວັນທີເລີ່ມຕົ້ນ"
                  value={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="ວັນທີສິ້ນສຸດ"
                  value={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>

      {/* Main Content - Tab Navigation */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
            <Tab 
              label="ການເງິນ" 
              icon={<AttachMoney />} 
              iconPosition="start"
              {...a11yProps(0)} 
            />
            <Tab 
              label="ການຈອງ" 
              icon={<Hotel />} 
              iconPosition="start"
              {...a11yProps(1)} 
            />
            <Tab 
              label="ຫ້ອງພັກ" 
              icon={<RoomService />} 
              iconPosition="start"
              {...a11yProps(2)} 
            />
            <Tab 
              label="ລູກຄ້າ" 
              icon={<People />} 
              iconPosition="start"
              {...a11yProps(3)} 
            />
          </Tabs>
        </Box>

        {/* Financial Reports Tab */}
        <CustomTabPanel value={tabValue} index={0}>
          {isPaymentsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : paymentsError ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {paymentsError}
            </Alert>
          ) : (
          <Grid container spacing={4}>
            {/* Financial Overview Cards */}
            <Grid item xs={12}>
              <FinancialOverviewCards 
                stats={adaptDashboardStatsToPaymentStats(dashboardStats)}
                dateRange={dateRange}
                paymentItems={paymentsList || []}
              />
            </Grid>
            
            {/* Revenue Chart and Payment Method Chart */}
            <Grid item xs={12} md={8}>
              <RevenueChart 
                paymentItems={paymentsList || []}
                dateRange={dateRange}
                reportType="summary"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PaymentMethodChart paymentItems={paymentsList || []} />
            </Grid>
            
            {/* Financial Details Table */}
            <Grid item xs={12}>
              <FinancialTable 
                paymentItems={paymentsList || []}
                reportType="detailed"
                dateRange={dateRange}
              />
            </Grid>
          </Grid>
          )}
        </CustomTabPanel>

        {/* Booking Reports Tab */}
        <CustomTabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            {/* Booking Statistics Cards */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Hotel color="primary" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="h4">{financialReport?.totalBookings || 0}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ການຊໍາລະທັງໝົດ
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TrendingUp color="success" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="h4">{dashboardStats?.occupiedRooms || 0}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ເຂົ້າພັກແລ້ວ
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Receipt color="info" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="h4">{bookingReport?.pendingBookings || 0}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ການຈອງມື້ນີ້
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PieChart color="warning" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="h4">
                            {dashboardStats?.occupancyRate ? `${dashboardStats.occupancyRate}%` : '0%'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ອັດຕາການເຂົ້າພັກ
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Booking trend and details would go here */}
            <Grid item xs={12}>
              <Alert severity="info">
                ລາຍລະອຽດການຈອງ ແລະ ກາຟິກແນວໂນ້ມຈະຖືກເພີ່ມໃນເວີຊັ່ນຕໍ່ໄປ
              </Alert>
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* Room Reports Tab */}
        <CustomTabPanel value={tabValue} index={2}>
          <Grid container spacing={4}>
            {/* Room Statistics */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <RoomService color="primary" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="h4">{roomReport?.totalRooms || dashboardStats?.totalRooms || 0}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ຫ້ອງທັງໝົດ
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Hotel color="success" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="h4">{roomReport?.availableRooms || dashboardStats?.availableRooms || 0}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ຫ້ອງວ່າງ
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <People color="error" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="h4">{roomReport?.occupiedRooms || dashboardStats?.occupiedRooms || 0}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ຫ້ອງໄດ້ຈອງ
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Assessment color="info" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="h4">{roomReport?.maintenanceRooms || 0}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ຫ້ອງບຳລຸງ
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Room details would go here */}
            <Grid item xs={12}>
              <Alert severity="info">
                ລາຍລະອຽດຫ້ອງພັກ ແລະ ການວິເຄາະຈະຖືກເພີ່ມໃນເວີຊັ່ນຕໍ່ໄປ
              </Alert>
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* Customer Reports Tab */}
        <CustomTabPanel value={tabValue} index={3}>
          <Grid container spacing={4}>
            {/* Customer Statistics */}
            <Grid item xs={12}>
              <Alert severity="info">
                ລາຍງານລູກຄ້າ ແລະ ການວິເຄາະພຶດຕິກຳລູກຄ້າຈະຖືກເພີ່ມໃນເວີຊັ່ນຕໍ່ໄປ
              </Alert>
            </Grid>
          </Grid>
        </CustomTabPanel>
      </Card>

      {/* Export Dialog */}
      <ExportDialog 
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        paymentItems={createMockPaymentItemsFromFinancialReport(financialReport)}
        stats={adaptDashboardStatsToPaymentStats(dashboardStats)}
        dateRange={dateRange}
        reportType="summary"
      />
    </Box>
  );
};

export default ReportsPage;