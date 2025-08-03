import { api } from '@core/infrastructure/api/axios.config';
import { ApiResponse } from '@core/domain/models/common/api.model';
import { REPORTS_ENDPOINTS } from '@core/infrastructure/api/config/endpoints.config';
import {DashboardStats,FinancialReport,BookingReport,RoomReport,CustomerReport,RevenueReport,OccupancyReport,ReportQueryDto,FinancialReportQueryDto,BookingReportQueryDto,RoomReportQueryDto,CustomerReportQueryDto,RevenueReportQueryDto,
OccupancyReportQueryDto
} from '@core/domain/models/reports/report.model';

export class ReportsRepository {
  private readonly URL = REPORTS_ENDPOINTS;

  async getDashboardStats(query: ReportQueryDto = {}): Promise<DashboardStats> {
    try {
      const response = await api.post<ApiResponse<DashboardStats>>(
        this.URL.DASHBOARD,
        query
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getFinancialReport(query: FinancialReportQueryDto = {}): Promise<FinancialReport> {
    try {
      const response = await api.post<ApiResponse<FinancialReport>>(
        this.URL.FINANCIAL,
        query
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching financial report:', error);
      throw error;
    }
  }

  async getBookingReport(query: BookingReportQueryDto = {}): Promise<BookingReport> {
    try {
      const response = await api.post<ApiResponse<BookingReport>>(
        this.URL.BOOKING,
        query
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching booking report:', error);
      throw error;
    }
  }

  async getRoomReport(query: RoomReportQueryDto = {}): Promise<RoomReport> {
    try {
      const response = await api.post<ApiResponse<RoomReport>>(
        this.URL.ROOM,
        query
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching room report:', error);
      throw error;
    }
  }

  async getCustomerReport(query: CustomerReportQueryDto = {}): Promise<CustomerReport> {
    try {
      const response = await api.post<ApiResponse<CustomerReport>>(
        this.URL.CUSTOMER,
        query
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching customer report:', error);
      throw error;
    }
  }

  async getRevenueReport(query: RevenueReportQueryDto = {}): Promise<RevenueReport> {
    try {
      const response = await api.post<ApiResponse<RevenueReport>>(
        this.URL.REVENUE,
        query
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching revenue report:', error);
      throw error;
    }
  }

  async getOccupancyReport(query: OccupancyReportQueryDto = {}): Promise<OccupancyReport> {
    try {
      const response = await api.post<ApiResponse<OccupancyReport>>(
        this.URL.OCCUPANCY,
        query
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching occupancy report:', error);
      throw error;
    }
  }

  async getPaymentsList(query: ReportQueryDto = {}): Promise<any[]> {
    try {
      const response = await api.post<ApiResponse<any[]>>(
        this.URL.PAYMENTS,
        query
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payments list:', error);
      throw error;
    }
  }
}
