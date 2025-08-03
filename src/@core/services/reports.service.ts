import { ReportsRepository } from '@core/infrastructure/api/repository/reports.repository';
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

export class ReportsService {
  private reportsRepository: ReportsRepository;

  constructor() {
    this.reportsRepository = new ReportsRepository();
  }

  async getDashboardStats(query: ReportQueryDto = {}): Promise<DashboardStats> {
    try {
      return await this.reportsRepository.getDashboardStats(query);
    } catch (error) {
      console.error('ReportsService - Error getting dashboard stats:', error);
      throw error;
    }
  }

  async getFinancialReport(query: FinancialReportQueryDto = {}): Promise<FinancialReport> {
    try {
      return await this.reportsRepository.getFinancialReport(query);
    } catch (error) {
      console.error('ReportsService - Error getting financial report:', error);
      throw error;
    }
  }

  async getBookingReport(query: BookingReportQueryDto = {}): Promise<BookingReport> {
    try {
      return await this.reportsRepository.getBookingReport(query);
    } catch (error) {
      console.error('ReportsService - Error getting booking report:', error);
      throw error;
    }
  }

  async getRoomReport(query: RoomReportQueryDto = {}): Promise<RoomReport> {
    try {
      return await this.reportsRepository.getRoomReport(query);
    } catch (error) {
      console.error('ReportsService - Error getting room report:', error);
      throw error;
    }
  }

  async getCustomerReport(query: CustomerReportQueryDto = {}): Promise<CustomerReport> {
    try {
      return await this.reportsRepository.getCustomerReport(query);
    } catch (error) {
      console.error('ReportsService - Error getting customer report:', error);
      throw error;
    }
  }

  async getRevenueReport(query: RevenueReportQueryDto = {}): Promise<RevenueReport> {
    try {
      return await this.reportsRepository.getRevenueReport(query);
    } catch (error) {
      console.error('ReportsService - Error getting revenue report:', error);
      throw error;
    }
  }

  async getOccupancyReport(query: OccupancyReportQueryDto = {}): Promise<OccupancyReport> {
    try {
      return await this.reportsRepository.getOccupancyReport(query);
    } catch (error) {
      console.error('ReportsService - Error getting occupancy report:', error);
      throw error;
    }
  }

  async getPaymentsList(query: ReportQueryDto = {}): Promise<any[]> {
    try {
      return await this.reportsRepository.getPaymentsList(query);
    } catch (error) {
      console.error('ReportsService - Error getting payments list:', error);
      throw error;
    }
  }
}
