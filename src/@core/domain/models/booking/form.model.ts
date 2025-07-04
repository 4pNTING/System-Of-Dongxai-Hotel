export interface CustomerBookingInput {
  RoomId: number;
  CheckinDate: string;       // YYYY-MM-DD format
  CheckoutDate: string;      // YYYY-MM-DD format
}

// ✅ สำหรับ Admin/Staff Booking API (ใช้ทั้งหมด)
export interface BookingInput {
  RoomId: number;
  CustomerId: number;
  StaffId: number;
  CheckinDate: string;
  CheckoutDate: string;
  BookingDate: string;
  StatusId: number;
}

export interface BookingCreateInput {
  RoomId: number;
  CheckinDate: string;
  CheckoutDate: string;
}

export interface BookingUpdateInput {
  CheckinDate?: string;
  CheckoutDate?: string;
}