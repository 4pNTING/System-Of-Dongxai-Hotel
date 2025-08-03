import { create } from 'zustand';
import { ReportsService } from '@core/services/reports.service';
import {
  DashboardStats,
  FinancialReport,
  BookingReport,
  RoomReport,
  CustomerReport,
  RevenueReport,
  OccupancyReport,
  ReportQueryDto,
  FinancialReportQueryDto,
  BookingReportQueryDto,
  RoomReportQueryDto,
  CustomerReportQueryDto,
  RevenueReportQueryDto,
  OccupancyReportQueryDto
} from '@core/domain/models/reports/report.model';

interface ReportsState {
  // Data states
  dashboardStats: DashboardStats | null;
  financialReport: FinancialReport | null;
  bookingReport: BookingReport | null;
  roomReport: RoomReport | null;
  customerReport: CustomerReport | null;
  revenueReport: RevenueReport | null;
  occupancyReport: OccupancyReport | null;
  paymentsList: any[] | null;

  // Loading states
  isDashboardLoading: boolean;
  isFinancialLoading: boolean;
  isBookingLoading: boolean;
  isRoomLoading: boolean;
  isCustomerLoading: boolean;
  isRevenueLoading: boolean;
  isOccupancyLoading: boolean;
  isPaymentsLoading: boolean;

  // Error states
  dashboardError: string | null;
  financialError: string | null;
  bookingError: string | null;
  roomError: string | null;
  customerError: string | null;
  revenueError: string | null;
  occupancyError: string | null;
  paymentsError: string | null;

  // Actions
  fetchDashboardStats: (query?: ReportQueryDto) => Promise<void>;
  fetchFinancialReport: (query?: FinancialReportQueryDto) => Promise<void>;
  fetchBookingReport: (query?: BookingReportQueryDto) => Promise<void>;
  fetchRoomReport: (query?: RoomReportQueryDto) => Promise<void>;
  fetchCustomerReport: (query?: CustomerReportQueryDto) => Promise<void>;
  fetchRevenueReport: (query?: RevenueReportQueryDto) => Promise<void>;
  fetchOccupancyReport: (query?: OccupancyReportQueryDto) => Promise<void>;
  fetchPaymentsList: (query?: ReportQueryDto) => Promise<void>;
  clearErrors: () => void;
}

const reportsService = new ReportsService();

export const useReportsStore = create<ReportsState>((set, get) => ({
  // Initial data states
  dashboardStats: null,
  financialReport: null,
  bookingReport: null,
  roomReport: null,
  customerReport: null,
  revenueReport: null,
  occupancyReport: null,
  paymentsList: null,

  // Initial loading states
  isDashboardLoading: false,
  isFinancialLoading: false,
  isBookingLoading: false,
  isRoomLoading: false,
  isCustomerLoading: false,
  isRevenueLoading: false,
  isOccupancyLoading: false,
  isPaymentsLoading: false,

  // Initial error states
  dashboardError: null,
  financialError: null,
  bookingError: null,
  roomError: null,
  customerError: null,
  revenueError: null,
  occupancyError: null,
  paymentsError: null,

  // Actions
  fetchDashboardStats: async (query: ReportQueryDto = {}) => {
    set({ isDashboardLoading: true, dashboardError: null });
    try {
      const dashboardStats = await reportsService.getDashboardStats(query);
      set({ dashboardStats, isDashboardLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
      set({ dashboardError: errorMessage, isDashboardLoading: false });
      console.error('Error fetching dashboard stats:', error);
    }
  },

  fetchFinancialReport: async (query: FinancialReportQueryDto = {}) => {
    set({ isFinancialLoading: true, financialError: null });
    try {
      const financialReport = await reportsService.getFinancialReport(query);
      set({ financialReport, isFinancialLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch financial report';
      set({ financialError: errorMessage, isFinancialLoading: false });
      console.error('Error fetching financial report:', error);
    }
  },

  fetchBookingReport: async (query: BookingReportQueryDto = {}) => {
    set({ isBookingLoading: true, bookingError: null });
    try {
      const bookingReport = await reportsService.getBookingReport(query);
      set({ bookingReport, isBookingLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch booking report';
      set({ bookingError: errorMessage, isBookingLoading: false });
      console.error('Error fetching booking report:', error);
    }
  },

  fetchRoomReport: async (query: RoomReportQueryDto = {}) => {
    set({ isRoomLoading: true, roomError: null });
    try {
      const roomReport = await reportsService.getRoomReport(query);
      set({ roomReport, isRoomLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch room report';
      set({ roomError: errorMessage, isRoomLoading: false });
      console.error('Error fetching room report:', error);
    }
  },

  fetchCustomerReport: async (query: CustomerReportQueryDto = {}) => {
    set({ isCustomerLoading: true, customerError: null });
    try {
      const customerReport = await reportsService.getCustomerReport(query);
      set({ customerReport, isCustomerLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customer report';
      set({ customerError: errorMessage, isCustomerLoading: false });
      console.error('Error fetching customer report:', error);
    }
  },

  fetchRevenueReport: async (query: RevenueReportQueryDto = {}) => {
    set({ isRevenueLoading: true, revenueError: null });
    try {
      const revenueReport = await reportsService.getRevenueReport(query);
      set({ revenueReport, isRevenueLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch revenue report';
      set({ revenueError: errorMessage, isRevenueLoading: false });
      console.error('Error fetching revenue report:', error);
    }
  },

  fetchOccupancyReport: async (query: OccupancyReportQueryDto = {}) => {
    set({ isOccupancyLoading: true, occupancyError: null });
    try {
      const occupancyReport = await reportsService.getOccupancyReport(query);
      set({ occupancyReport, isOccupancyLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch occupancy report';
      set({ occupancyError: errorMessage, isOccupancyLoading: false });
      console.error('Error fetching occupancy report:', error);
    }
  },

  fetchPaymentsList: async (query: ReportQueryDto = {}) => {
    try {
      set({ isPaymentsLoading: true, paymentsError: null });
      const paymentsList = await reportsService.getPaymentsList(query);
      set({ paymentsList, isPaymentsLoading: false });
    } catch (error) {
      console.error('Error fetching payments list:', error);
      set({
        paymentsError: error instanceof Error ? error.message : 'Unknown error occurred',
        isPaymentsLoading: false
      });
    }
  },

  clearErrors: () => {
    set({
      dashboardError: null,
      financialError: null,
      bookingError: null,
      roomError: null,
      customerError: null,
      revenueError: null,
      occupancyError: null,
      paymentsError: null,
    });
  },
}));
