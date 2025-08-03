import { BaseService } from './base.service';

// DTOs matching backend
export interface DashboardStatsDto {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalCustomers: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRoomRate: number;
}

export interface FinancialReportDto {
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  paymentMethods: {
    method: string;
    amount: number;
    count: number;
  }[];
  dailyRevenue: {
    date: string;
    revenue: number;
    bookings: number;
  }[];
}

export interface BookingReportDto {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  bookingsByStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
  bookingsByMonth: {
    month: string;
    count: number;
    revenue: number;
  }[];
  averageStayDuration: number;
}

export interface RoomReportDto {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  outOfOrderRooms: number;
  occupancyRate: number;
  roomsByType: {
    type: string;
    total: number;
    occupied: number;
    available: number;
    occupancyRate: number;
  }[];
  roomsByStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
}

export interface CustomerReportDto {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customersByGender: {
    gender: string;
    count: number;
    percentage: number;
  }[];
  topCustomers: {
    customerId: number;
    customerName: string;
    totalBookings: number;
    totalSpent: number;
  }[];
}

export interface RevenueReportDto {
  totalRevenue: number;
  previousPeriodRevenue: number;
  growthRate: number;
  revenueByPeriod: {
    period: string;
    revenue: number;
    bookings: number;
  }[];
  revenueByRoomType: {
    roomType: string;
    revenue: number;
    bookings: number;
  }[];
}

export interface OccupancyReportDto {
  averageOccupancyRate: number;
  peakOccupancyRate: number;
  lowOccupancyRate: number;
  occupancyByDate: {
    date: string;
    occupancyRate: number;
    occupiedRooms: number;
    totalRooms: number;
  }[];
  occupancyByRoomType: {
    roomType: string;
    occupancyRate: number;
    totalRooms: number;
    averageOccupied: number;
  }[];
}

export interface ReportQueryParams {
  startDate?: string;
  endDate?: string;
  status?: string;
  groupBy?: 'day' | 'week' | 'month';
}

class ReportService extends BaseService {
  private readonly basePath = '/reports';

  // Dashboard Statistics
  async getDashboardStats(): Promise<DashboardStatsDto> {
    try {
      const response = await this.api.get(`${this.basePath}/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Financial Report
  async getFinancialReport(params?: ReportQueryParams): Promise<FinancialReportDto> {
    try {
      const response = await this.api.get(`${this.basePath}/financial`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching financial report:', error);
      throw error;
    }
  }

  // Booking Report
  async getBookingReport(params?: ReportQueryParams): Promise<BookingReportDto> {
    try {
      const response = await this.api.get(`${this.basePath}/bookings`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching booking report:', error);
      throw error;
    }
  }

  // Room Report
  async getRoomReport(): Promise<RoomReportDto> {
    try {
      const response = await this.api.get(`${this.basePath}/rooms`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room report:', error);
      throw error;
    }
  }

  // Customer Report
  async getCustomerReport(params?: ReportQueryParams): Promise<CustomerReportDto> {
    try {
      const response = await this.api.get(`${this.basePath}/customers`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer report:', error);
      throw error;
    }
  }

  // Revenue Report
  async getRevenueReport(params?: ReportQueryParams): Promise<RevenueReportDto> {
    try {
      const response = await this.api.get(`${this.basePath}/revenue`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue report:', error);
      throw error;
    }
  }

  // Occupancy Report
  async getOccupancyReport(params?: ReportQueryParams): Promise<OccupancyReportDto> {
    try {
      const response = await this.api.get(`${this.basePath}/occupancy`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching occupancy report:', error);
      throw error;
    }
  }
}

export const reportService = new ReportService();
