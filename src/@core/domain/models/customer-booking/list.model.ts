export interface CustomerBooking {
  bookingId: number;
  bookingDate: string;
  checkinDate: string;
  checkoutDate: string;
  statusId: number;
  roomId: number;
  // Relations for display
  room?: {
    roomId: number;
    roomNumber?: string;
    roomPrice?: number;
    roomType?: {
      typeId: number;
      typeName: string;
    };
  };
  bookingStatus?: {
    statusId: number;
    statusName: string;
    statusDescription?: string;
  };
} 