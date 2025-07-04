export interface CustomerBookingForm {
  roomId: number;
  checkinDate: string; // YYYY-MM-DD
  checkoutDate: string; // YYYY-MM-DD
}

// ✅ เพิ่ม CustomerBookingInput สำหรับการจองของลูกค้า
export interface CustomerBookingInput {
  RoomId: number;
  CheckinDate: string; // YYYY-MM-DD format
  CheckoutDate: string; // YYYY-MM-DD format
}