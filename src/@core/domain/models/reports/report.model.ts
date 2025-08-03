// Domain models for reports
export interface DashboardStats {
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

export interface FinancialReport {
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  paymentMethods: PaymentMethodData[];
  dailyRevenue: DailyRevenueData[];
}

export interface PaymentMethodData {
  method: string;
  amount: number; 
  count: number;
}

export interface DailyRevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

export interface BookingReport {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  bookingsByStatus: BookingStatusData[];
  bookingsByRoomType: BookingRoomTypeData[];
}

export interface BookingStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface BookingRoomTypeData {
  roomType: string;
  count: number;
  revenue: number;
}

export interface RoomReport {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  roomsByType: RoomTypeData[];
  occupancyByType: RoomOccupancyData[];
}

export interface RoomTypeData {
  type: string;
  total: number;
  available: number;
  occupied: number;
}

export interface RoomOccupancyData {
  roomType: string;
  occupancyRate: number;
  averageRate: number;
}

export interface CustomerReport {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customersByBookings: CustomerBookingData[];
  topCustomers: TopCustomerData[];
}

export interface CustomerBookingData {
  bookingCount: string;
  customerCount: number;
}

export interface TopCustomerData {
  customerId: number;
  customerName: string;
  bookingCount: number;
  totalSpent: number;
}

export interface RevenueReport {
  totalRevenue: number;
  monthlyRevenue: MonthlyRevenueData[];
  revenueBySource: RevenueSourceData[];
  revenueGrowth: number;
}

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

export interface RevenueSourceData {
  source: string;
  amount: number;
  percentage: number;
}

export interface OccupancyReport {
  currentOccupancy: number;
  averageOccupancy: number;
  dailyOccupancy: DailyOccupancyData[];
  occupancyByRoomType: RoomOccupancyData[];
}

export interface DailyOccupancyData {
  date: string;
  occupancyRate: number;
  totalRooms: number;
  occupiedRooms: number;
}

// Request DTOs for backend API calls
export interface ReportQueryDto {
  startDate?: string;
  endDate?: string;
  status?: string;
  groupBy?: string;
}

export interface FinancialReportQueryDto extends ReportQueryDto {
  paymentMethod?: string;
}

export interface BookingReportQueryDto extends ReportQueryDto {
  roomType?: string;
  customerId?: number;
}

export interface RoomReportQueryDto extends ReportQueryDto {
  roomType?: string;
  floorNumber?: number;
}

export interface CustomerReportQueryDto extends ReportQueryDto {
  minBookings?: number;
  sortBy?: 'bookings' | 'revenue' | 'name';
}

export interface RevenueReportQueryDto extends ReportQueryDto {
  granularity?: 'daily' | 'weekly' | 'monthly';
}

export interface OccupancyReportQueryDto extends ReportQueryDto {
  roomType?: string;
  granularity?: 'daily' | 'weekly' | 'monthly';
}
