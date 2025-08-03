// Adapter functions to transform new report data to legacy component formats
import {
  DashboardStats,
  FinancialReport,
  PaymentMethodData,
  DailyRevenueData
} from '@core/domain/models/reports/report.model';

// Transform DashboardStats to legacy payment stats format
export const adaptDashboardStatsToPaymentStats = (dashboardStats: DashboardStats | null) => {
  if (!dashboardStats) {
    return {
      totalPayments: 0,
      paidPayments: 0,
      pendingPayments: 0,
      refundedPayments: 0,
      totalAmount: 0
    };
  }

  return {
    totalPayments: Math.floor(dashboardStats.totalBookings * 0.8), // Mock: 80% of bookings have payments
    paidPayments: Math.floor(dashboardStats.confirmedBookings * 0.9), // Mock: 90% of confirmed bookings are paid
    pendingPayments: dashboardStats.pendingBookings,
    refundedPayments: Math.floor(dashboardStats.totalBookings * 0.05), // Mock: 5% refunded
    totalAmount: dashboardStats.totalRevenue
  };
};

// Transform PaymentMethodData[] to PaymentModel[] format
export const adaptPaymentMethodsToPaymentModels = (paymentMethods: PaymentMethodData[] | null) => {
  if (!paymentMethods || !Array.isArray(paymentMethods)) {
    return [];
  }

  return paymentMethods.map((method, index) => ({
    PaymentId: index + 1,
    PaymentPrice: method.amount,
    PaymentDate: new Date().toISOString(),
    PaymentMethod: method.method,
    PaymentStatus: 'ຊຳລະແລ້ວ',
    StaffId: 1,
    // Mock additional fields for compatibility
    checkIn: {
      CheckInId: index + 1,
      customer: {
        CustomerName: `ລູກຄ້າ ${index + 1}`,
        CustomerTel: '020-1234-567'
      },
      room: {
        RoomNumber: `${100 + index}`,
        roomType: {
          TypeName: 'Standard'
        }
      }
    }
  }));
};

// Transform DailyRevenueData[] to PaymentModel[] format
export const adaptDailyRevenueToPaymentModels = (dailyRevenue: DailyRevenueData[] | null) => {
  if (!dailyRevenue || !Array.isArray(dailyRevenue)) {
    return [];
  }

  return dailyRevenue.flatMap((dayData, dayIndex) => {
    // Create multiple payment entries for each day based on booking count
    const paymentsPerDay = Math.max(1, dayData.bookings);
    const avgPaymentAmount = dayData.revenue / paymentsPerDay;

    return Array.from({ length: paymentsPerDay }, (_, paymentIndex) => ({
      PaymentId: dayIndex * 100 + paymentIndex + 1,
      PaymentPrice: avgPaymentAmount,
      PaymentDate: dayData.date,
      PaymentMethod: paymentIndex % 2 === 0 ? 'Cash' : 'Card',
      PaymentStatus: 'ຊຳລະແລ້ວ',
      StaffId: 1,
      // Mock additional fields for compatibility
      checkIn: {
        CheckInId: dayIndex * 100 + paymentIndex + 1,
        customer: {
          CustomerName: `ລູກຄ້າ ${dayIndex * 100 + paymentIndex + 1}`,
          CustomerTel: '020-1234-567'
        },
        room: {
          RoomNumber: `${200 + (paymentIndex % 20)}`,
          roomType: {
            TypeName: paymentIndex % 3 === 0 ? 'Deluxe' : paymentIndex % 3 === 1 ? 'Standard' : 'Suite'
          }
        }
      }
    }));
  });
};

// Transform FinancialReport to legacy format for components
export const adaptFinancialReportToLegacy = (financialReport: FinancialReport | null) => {
  if (!financialReport) {
    return {
      paymentMethods: [],
      dailyRevenue: [],
      stats: adaptDashboardStatsToPaymentStats(null)
    };
  }

  return {
    paymentMethods: adaptPaymentMethodsToPaymentModels(financialReport.paymentMethods),
    dailyRevenue: adaptDailyRevenueToPaymentModels(financialReport.dailyRevenue),
    totalRevenue: financialReport.totalRevenue,
    totalBookings: financialReport.totalBookings,
    averageBookingValue: financialReport.averageBookingValue
  };
};

// Create mock payment items from financial report for components that need full payment data
export const createMockPaymentItemsFromFinancialReport = (financialReport: FinancialReport | null) => {
  if (!financialReport) {
    return [];
  }

  // Use real payment count from financial report (totalBookings now represents real payment count)
  const realPaymentCount = financialReport.totalBookings || 0;
  
  // Generate mock payment items based on real payment count
  const mockPayments = [];
  for (let i = 1; i <= realPaymentCount; i++) {
    mockPayments.push({
      PaymentId: i + 7, // Start from 8 to match database IDs
      PaymentPrice: Math.floor(Math.random() * 200000) + 50000, // Random amount between 50K-250K
      PaymentDate: new Date().toISOString().split('T')[0],
      PaymentType: 'BOOKING_CONFIRMATION',
      PaymentMethod: i % 2 === 0 ? 'Card' : 'Cash',
      StaffId: 1,
      CheckInId: i,
      BookingId: i,
      status: 'ສຳເລັດແລ້ວ'
    });
  }
  
  return mockPayments;
};
