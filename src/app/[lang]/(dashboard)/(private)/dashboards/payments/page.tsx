// src/app/(dashboard)/payments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Component Imports
import PaymentTable from '@views/apps/payments/PaymentTable';
import PaymentCard from '@views/apps/payments/PaymentCard';
import PaymentSearch from '@views/apps/payments/PaymentSearch';
import PaymentStatusFilter from '@views/apps/payments/PaymentStatusFilter';

// Store Imports
import { usePaymentStore } from '@core/infrastructure/store/payments/payment.store';

// Utils Imports
import { mapPaymentsToDisplayModels } from '@core/utils/payment-mapper';

export default function PaymentPage() {
  // Payment store integration
  const {
    items: paymentItems,
    isLoading: paymentLoading,
    stats: paymentStats,
    fetchItems: fetchPayments,
    fetchStats: fetchPaymentStats,
    refundPayment,
    setFilters
  } = usePaymentStore();
  
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data: session, status } = useSession();
  const isLoadingAuth = status === 'loading';
  
  const userRoleId = session?.user?.roleId ?  
    (typeof session.user.roleId === 'string' ? parseInt(session.user.roleId, 10) : session.user.roleId) : 0;

  // Map backend payment data to display format
  const mappedPayments = mapPaymentsToDisplayModels(paymentItems || []);

  // Filter payments based on search and status
  const filteredPayments = mappedPayments.filter(payment => {
    const matchesSearch = !searchValue ||
      payment.paymentId.toLowerCase().includes(searchValue.toLowerCase()) ||
      payment.booking.customer.customerName.toLowerCase().includes(searchValue.toLowerCase()) ||
      payment.booking.room.roomNumber.includes(searchValue);
      
    const matchesStatus = !statusFilter || payment.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Use stats from store
  const {
    totalPayments,
    paidPayments,
    pendingPayments,
    refundedPayments,
    totalAmount
  } = paymentStats;

  // Event handlers
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };
  
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleView = async (payment: any) => {
    console.log('View payment:', payment);
    toast.info(`ເບິ່ງລາຍລະອຽດການຊຳລະ ${payment.paymentId}`);
  };

  const handlePrint = async (payment: any) => {
    console.log('Print payment:', payment);
    toast.info(`ພິມໃບເກັບເງິນ ${payment.paymentId}`);
  };

  const handleRefund = async (payment: any) => {
    try {
      if (window.confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຄືນເງິນການຊຳລະ ${payment.paymentId}?`)) {
        toast.info('ກຳລັງດຳເນີນການຄືນເງິນ...');
        const paymentId = parseInt(payment.paymentId);
        await refundPayment(paymentId);
        toast.success('ຄືນເງິນສຳເລັດແລ້ວ');
      }
    } catch (error: any) {
      console.error('Error refunding:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການຄືນເງິນ: ' + (error.message || 'Unknown error'));
    }
  };
  
  useEffect(() => {
    // Load payment data and statistics when component mounts
    console.log('Loading payment data from backend...');
    Promise.all([
      fetchPayments(),
      fetchPaymentStats()
    ]).catch(error => {
      console.error('Error loading payment data:', error);
    });
  }, [fetchPayments, fetchPaymentStats]);
  
  if (isLoadingAuth) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress size={40} />
        <Typography sx={{ ml: 2 }}>ກຳລັງກວດສອບສິດການໃຊ້ງານ...</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={6}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" fontWeight={600} color="text.primary">
              ການຈັດການການຊຳລະ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              ຈັດການການຊຳລະເງິນຂອງລູກຄ້າ ແລະ ລາຍການທຳລະກຳ
            </Typography>
          </Box>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12}>
          <PaymentCard 
            totalCount={totalPayments}
            paidCount={paidPayments}
            pendingCount={pendingPayments}
            refundedCount={refundedPayments}
            totalAmount={totalAmount}
          />
        </Grid>

        {/* Search and Filters Section */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 3, 
            flexWrap: 'wrap', 
            alignItems: 'center',
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}>
            <PaymentSearch
              value={searchValue}
              onChange={handleSearchChange}
            />
            <PaymentStatusFilter
              value={statusFilter}
              onChange={handleStatusFilterChange}
            />
          </Box>

          {/* Results Summary */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              ພົບ {filteredPayments.length} ລາຍການຊຳລະ
              <span className="ml-4">
                ({paidPayments} ຊຳລະແລ້ວ, {pendingPayments} ລໍຖ້າຊຳລະ, {refundedPayments} ຄືນເງິນແລ້ວ)
              </span>
            </Typography>
          </Box>

          <PaymentTable
            data={filteredPayments}
            loading={paymentLoading}
            onView={handleView}
            onPrint={handlePrint}
            onRefund={handleRefund}
            currentUserRole={userRoleId}
          />
        </Grid>
      </Grid>
    </Box>
  );
}