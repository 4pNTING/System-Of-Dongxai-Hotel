import { create } from 'zustand';
import { 
  reportService, 
  DashboardStatsDto,
  FinancialReportDto,
  BookingReportDto,
  RoomReportDto,
  CustomerReportDto,
  RevenueReportDto,
  OccupancyReportDto,
  ReportQueryParams
} from '@core/services/report.service';
import { useErrorStore } from '../useError.store';
import { useLoadingStore } from '../useLoading.store';

interface ReportState {
  // Dashboard stats
  dashboardStats: DashboardStatsDto | null;
  
  // Reports data
  financialReport: FinancialReportDto | null;
  bookingReport: BookingReportDto | null;
  roomReport: RoomReportDto | null;
  customerReport: CustomerReportDto | null;
  revenueReport: RevenueReportDto | null;
  occupancyReport: OccupancyReportDto | null;
  
  // Loading states
  isLoading: boolean;
  isLoadingDashboard: boolean;
  isLoadingFinancial: boolean;
  isLoadingBooking: boolean;
  isLoadingRoom: boolean;
  isLoadingCustomer: boolean;
  isLoadingRevenue: boolean;
  isLoadingOccupancy: boolean;
  
  // Current filters
  filters: ReportQueryParams;
  
  // Actions - Dashboard
  fetchDashboardStats: () => Promise<void>;
  
  // Actions - Reports
  fetchFinancialReport: (params?: ReportQueryParams) => Promise<void>;
  fetchBookingReport: (params?: ReportQueryParams) => Promise<void>;
  fetchRoomReport: () => Promise<void>;
  fetchCustomerReport: (params?: ReportQueryParams) => Promise<void>;
  fetchRevenueReport: (params?: ReportQueryParams) => Promise<void>;
  fetchOccupancyReport: (params?: ReportQueryParams) => Promise<void>;
  
  // Actions - Utility
  fetchAllReports: (params?: ReportQueryParams) => Promise<void>;
  setFilters: (filters: ReportQueryParams) => void;
  reset: () => void;
}

export const useReportStore = create<ReportState>((set, get) => ({
  // Initial state
  dashboardStats: null,
  financialReport: null,
  bookingReport: null,
  roomReport: null,
  customerReport: null,
  revenueReport: null,
  occupancyReport: null,
  
  // Loading states
  isLoading: false,
  isLoadingDashboard: false,
  isLoadingFinancial: false,
  isLoadingBooking: false,
  isLoadingRoom: false,
  isLoadingCustomer: false,
  isLoadingRevenue: false,
  isLoadingOccupancy: false,
  
  // Filters
  filters: {},
  
  // Dashboard actions
  fetchDashboardStats: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isLoadingDashboard: true });
      setLoading(true);
      
      console.log('📊 ReportStore: Fetching dashboard stats...');
      const stats = await reportService.getDashboardStats();
      
      set({ 
        dashboardStats: stats,
        isLoadingDashboard: false 
      });
      
      console.log('✅ ReportStore: Dashboard stats fetched successfully');
      setLoading(false);
    } catch (error: any) {
      console.error('❌ ReportStore: Error fetching dashboard stats:', error);
      set({ isLoadingDashboard: false });
      setLoading(false);
      setError(error.message || 'ไม่สามารถโหลดสถิติแดชบอร์ดได้');
      throw error;
    }
  },
  
  // Financial report
  fetchFinancialReport: async (params?: ReportQueryParams) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isLoadingFinancial: true });
      setLoading(true);
      
      console.log('📊 ReportStore: Fetching financial report...');
      const report = await reportService.getFinancialReport(params);
      
      set({ 
        financialReport: report,
        isLoadingFinancial: false,
        filters: { ...get().filters, ...params }
      });
      
      console.log('✅ ReportStore: Financial report fetched successfully');
      setLoading(false);
    } catch (error: any) {
      console.error('❌ ReportStore: Error fetching financial report:', error);
      set({ isLoadingFinancial: false });
      setLoading(false);
      setError(error.message || 'ไม่สามารถโหลดรายงานการเงินได้');
      throw error;
    }
  },
  
  // Booking report
  fetchBookingReport: async (params?: ReportQueryParams) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isLoadingBooking: true });
      setLoading(true);
      
      console.log('📊 ReportStore: Fetching booking report...');
      const report = await reportService.getBookingReport(params);
      
      set({ 
        bookingReport: report,
        isLoadingBooking: false,
        filters: { ...get().filters, ...params }
      });
      
      console.log('✅ ReportStore: Booking report fetched successfully');
      setLoading(false);
    } catch (error: any) {
      console.error('❌ ReportStore: Error fetching booking report:', error);
      set({ isLoadingBooking: false });
      setLoading(false);
      setError(error.message || 'ไม่สามารถโหลดรายงานการจองได้');
      throw error;
    }
  },
  
  // Room report
  fetchRoomReport: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isLoadingRoom: true });
      setLoading(true);
      
      console.log('📊 ReportStore: Fetching room report...');
      const report = await reportService.getRoomReport();
      
      set({ 
        roomReport: report,
        isLoadingRoom: false 
      });
      
      console.log('✅ ReportStore: Room report fetched successfully');
      setLoading(false);
    } catch (error: any) {
      console.error('❌ ReportStore: Error fetching room report:', error);
      set({ isLoadingRoom: false });
      setLoading(false);
      setError(error.message || 'ไม่สามารถโหลดรายงานห้องพักได้');
      throw error;
    }
  },
  
  // Customer report
  fetchCustomerReport: async (params?: ReportQueryParams) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isLoadingCustomer: true });
      setLoading(true);
      
      console.log('📊 ReportStore: Fetching customer report...');
      const report = await reportService.getCustomerReport(params);
      
      set({ 
        customerReport: report,
        isLoadingCustomer: false,
        filters: { ...get().filters, ...params }
      });
      
      console.log('✅ ReportStore: Customer report fetched successfully');
      setLoading(false);
    } catch (error: any) {
      console.error('❌ ReportStore: Error fetching customer report:', error);
      set({ isLoadingCustomer: false });
      setLoading(false);
      setError(error.message || 'ไม่สามารถโหลดรายงานลูกค้าได้');
      throw error;
    }
  },
  
  // Revenue report
  fetchRevenueReport: async (params?: ReportQueryParams) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isLoadingRevenue: true });
      setLoading(true);
      
      console.log('📊 ReportStore: Fetching revenue report...');
      const report = await reportService.getRevenueReport(params);
      
      set({ 
        revenueReport: report,
        isLoadingRevenue: false,
        filters: { ...get().filters, ...params }
      });
      
      console.log('✅ ReportStore: Revenue report fetched successfully');
      setLoading(false);
    } catch (error: any) {
      console.error('❌ ReportStore: Error fetching revenue report:', error);
      set({ isLoadingRevenue: false });
      setLoading(false);
      setError(error.message || 'ไม่สามารถโหลดรายงานรายได้ได้');
      throw error;
    }
  },
  
  // Occupancy report
  fetchOccupancyReport: async (params?: ReportQueryParams) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isLoadingOccupancy: true });
      setLoading(true);
      
      console.log('📊 ReportStore: Fetching occupancy report...');
      const report = await reportService.getOccupancyReport(params);
      
      set({ 
        occupancyReport: report,
        isLoadingOccupancy: false,
        filters: { ...get().filters, ...params }
      });
      
      console.log('✅ ReportStore: Occupancy report fetched successfully');
      setLoading(false);
    } catch (error: any) {
      console.error('❌ ReportStore: Error fetching occupancy report:', error);
      set({ isLoadingOccupancy: false });
      setLoading(false);
      setError(error.message || 'ไม่สามารถโหลดรายงานการเข้าพักได้');
      throw error;
    }
  },
  
  // Fetch all reports
  fetchAllReports: async (params?: ReportQueryParams) => {
    try {
      set({ isLoading: true });
      
      await Promise.all([
        get().fetchDashboardStats(),
        get().fetchFinancialReport(params),
        get().fetchBookingReport(params),
        get().fetchRoomReport(),
        get().fetchCustomerReport(params),
        get().fetchRevenueReport(params),
        get().fetchOccupancyReport(params)
      ]);
      
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  // Utility actions
  setFilters: (filters: ReportQueryParams) => {
    set({ filters: { ...get().filters, ...filters } });
  },
  
  reset: () => {
    set({
      dashboardStats: null,
      financialReport: null,
      bookingReport: null,
      roomReport: null,
      customerReport: null,
      revenueReport: null,
      occupancyReport: null,
      isLoading: false,
      isLoadingDashboard: false,
      isLoadingFinancial: false,
      isLoadingBooking: false,
      isLoadingRoom: false,
      isLoadingCustomer: false,
      isLoadingRevenue: false,
      isLoadingOccupancy: false,
      filters: {}
    });
  }
}));
